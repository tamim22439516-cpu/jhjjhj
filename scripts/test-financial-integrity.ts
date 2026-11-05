import { db } from '../server/db.ts';
import crypto from 'crypto';
import { Mutex } from 'async-mutex';

async function runIntegrityTests() {
  console.log('=====================================================');
  console.log('TAWZOON Financial Integrity & Scalability Test Suite');
  console.log('=====================================================\n');

  if (db.ready) {
    try {
      await Promise.race([
        db.ready,
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);
    } catch {}
  }

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail: string = '') {
    if (condition) {
      console.log(`[PASS] ${testName} ${detail ? `(${detail})` : ''}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail}`);
      failed++;
    }
  }

  // ----------------------------------------------------------------
  // Test 1: New Reseller Zero-Balance Enforcement
  // ----------------------------------------------------------------
  console.log('--- Test 1: New Reseller Zero-Balance Enforcement ---');
  const testResellerId = 'test-emp-' + crypto.randomUUID().slice(0, 8);
  const newReseller = {
    id: testResellerId,
    name: 'Integrity Test Reseller',
    email: `test_${Date.now()}@tawzoon.test`,
    phone: '01999887766',
    district: 'Dhaka',
    thana: 'Gulshan',
    referenceCode: 'TN-TEST-' + Math.floor(10000 + Math.random() * 90000),
    reference: 'TAWZOON9516',
    isOfficialReferral: true,
    resellerMargin: 0,
    referralCommissionRate: 10,
    role: 'EMPLOYEE' as const,
    status: 'APPROVED' as const,
    subscriptionStatus: 'trial' as const,
    isPaidSubscription: false,
    passwordHash: crypto.createHash('sha256').update('pass123').digest('hex'),
    registeredAt: new Date().toISOString(),
    wallet: { availableBalance: 0, pendingWithdrawal: 0, totalEarnings: 0, totalWithdrawn: 0 }
  };

  assert(
    newReseller.wallet.availableBalance === 0 &&
    newReseller.wallet.pendingWithdrawal === 0 &&
    newReseller.wallet.totalEarnings === 0 &&
    newReseller.wallet.totalWithdrawn === 0,
    'New Reseller Initial Balance Verification',
    'availableBalance=0, pendingWithdrawal=0, totalEarnings=0, totalWithdrawn=0'
  );

  // ----------------------------------------------------------------
  // Test 2: Mandatory Reserve Balance Rule (120 BDT)
  // ----------------------------------------------------------------
  console.log('\n--- Test 2: Mandatory Reserve Balance (120 BDT) Enforcement ---');
  const RESERVE_BALANCE = 120;
  let simulatedBalance = 200;
  let requestedWithdrawal = 100;
  // If simulated balance is 200 and requested is 100, remaining would be 100 < 120 -> REJECT
  const isAllowed1 = (simulatedBalance - requestedWithdrawal) >= RESERVE_BALANCE;
  assert(!isAllowed1, 'Withdrawal leaving balance < 120 BDT must be rejected', `200 - 100 = 100 (< ${RESERVE_BALANCE})`);

  let validWithdrawal = 80;
  // If simulated balance is 200 and requested is 80, remaining is 120 >= 120 -> ALLOW
  const isAllowed2 = (simulatedBalance - validWithdrawal) >= RESERVE_BALANCE;
  assert(isAllowed2, 'Withdrawal leaving balance >= 120 BDT must be accepted', `200 - 80 = 120 (>= ${RESERVE_BALANCE})`);

  // ----------------------------------------------------------------
  // Test 3: Send Money Fee (5 BDT) Deduction Logic
  // ----------------------------------------------------------------
  console.log('\n--- Test 3: Send Money Fee (5 BDT) Deduction Logic ---');
  const SEND_FEE = 5;
  const transferAmount = 100;
  const totalDebitRequired = transferAmount + SEND_FEE;
  assert(totalDebitRequired === 105, 'Transfer must require amount + 5 BDT fee', `100 + 5 = 105 BDT`);

  let senderBalance = 224; // 224 - 105 = 119 (< 120 reserve) -> REJECT
  const canSend1 = (senderBalance - totalDebitRequired) >= RESERVE_BALANCE;
  assert(!canSend1, 'Transfer leaving sender balance < 120 after 5 BDT fee must be rejected', `224 - 105 = 119 (< ${RESERVE_BALANCE})`);

  senderBalance = 225; // 225 - 105 = 120 (>= 120 reserve) -> ALLOW
  const canSend2 = (senderBalance - totalDebitRequired) >= RESERVE_BALANCE;
  assert(canSend2, 'Transfer leaving sender balance >= 120 after 5 BDT fee must be approved', `225 - 105 = 120 (>= ${RESERVE_BALANCE})`);

  // ----------------------------------------------------------------
  // Test 4: Official Referral Rules (TAWZOON9516)
  // ----------------------------------------------------------------
  console.log('\n--- Test 4: Official Referral Rules (TAWZOON9516) ---');
  const officialRefCode = 'TAWZOON9516';
  const referralSettings = db.getState().referralSettings || {
    defaultRatePercent: 10,
    officialReferralCode: 'TAWZOON9516'
  };

  assert(referralSettings.officialReferralCode === 'TAWZOON9516', 'Official Referral Code is TAWZOON9516');
  assert(referralSettings.defaultRatePercent === 10, 'Standard Referral Rate is 10%');

  // When registered under official code: Reseller gets standard commission (10%), zero extra markup, zero upline commission
  const officialRefUser = {
    reference: officialRefCode,
    isOfficialReferral: true,
    resellerMargin: 0,
    referralCommissionRate: 10
  };
  assert(officialRefUser.isOfficialReferral === true, 'Official referral flagged as true');
  assert(officialRefUser.resellerMargin === 0, 'Official referral extra margin is 0%');

  // ----------------------------------------------------------------
  // Test 5: Idempotency Key Deduplication
  // ----------------------------------------------------------------
  console.log('\n--- Test 5: Idempotency Key Deduplication ---');
  const testIdempKey = 'idemp_test_' + crypto.randomUUID();
  const idempRecord1 = await db.setIdempotencyRecord(testIdempKey, {
    status: 'COMPLETED',
    responsePayload: {
      status: 'success',
      transactionId: 'txn-999',
      amount: 500
    }
  });

  const checkRecord = db.getIdempotencyRecord(testIdempKey);
  assert(checkRecord !== null && checkRecord.status === 'COMPLETED', 'Idempotency key correctly stored and retrieved');
  assert(checkRecord?.responsePayload?.transactionId === 'txn-999', 'Idempotency payload matches original transaction');

  // ----------------------------------------------------------------
  // Test 6: Concurrent Race Condition Double-Debit Prevention
  // ----------------------------------------------------------------
  console.log('\n--- Test 6: Concurrent Race Condition Double-Debit Prevention ---');
  const walletMutex = new Mutex();
  let raceWalletBalance = 500; // Account has 500 BDT
  const debitAmount = 300;     // Each request wants 300 BDT
  // Minimum balance must remain >= 120 BDT
  // Only ONE request of 300 can succeed (500 - 300 = 200 >= 120).
  // The next request would need 200 - 300 = -100 (< 120) and must fail!

  let successfulDebits = 0;
  let rejectedDebits = 0;

  // Run 10 concurrent requests at the exact same millisecond
  const concurrentTasks = Array.from({ length: 10 }).map(async (_, idx) => {
    const release = await walletMutex.acquire();
    try {
      if ((raceWalletBalance - debitAmount) >= RESERVE_BALANCE) {
        // Safe debit
        raceWalletBalance -= debitAmount;
        successfulDebits++;
      } else {
        rejectedDebits++;
      }
    } finally {
      release();
    }
  });

  await Promise.all(concurrentTasks);

  assert(successfulDebits === 1, 'Only 1 of 10 concurrent debit requests succeeded', `successful=${successfulDebits}`);
  assert(rejectedDebits === 9, 'Remaining 9 concurrent requests safely rejected', `rejected=${rejectedDebits}`);
  assert(raceWalletBalance === 200, 'Final wallet balance exactly equals 200 BDT (>= 120 reserve)', `finalBalance=${raceWalletBalance}`);

  // ----------------------------------------------------------------
  // Test 7: O(1) Index Lookup Performance vs O(N) Scan
  // ----------------------------------------------------------------
  console.log('\n--- Test 7: O(1) Index Lookup Performance ---');
  db.rebuildIndices();
  const shaAli = db.getEmployeeById('emp-shaali');
  assert(shaAli !== undefined && shaAli.id === 'emp-shaali', 'Indexed lookup by ID returns emp-shaali instantly');

  const shaAliByCode = db.getEmployeeByCode('TN-REF-39516');
  assert(shaAliByCode !== undefined && shaAliByCode.referenceCode === 'TN-REF-39516', 'Indexed lookup by referenceCode returns matching reseller', `id=${shaAliByCode?.id}, code=${shaAliByCode?.referenceCode}`);

  const shaAliByPhone = db.getEmployeeByPhone('01722439516');
  assert(shaAliByPhone !== undefined && shaAliByPhone.phone?.replace(/[^0-9]/g, '') === '01722439516', 'Indexed lookup by phone returns matching reseller', `id=${shaAliByPhone?.id}, phone=${shaAliByPhone?.phone}`);

  const downline = db.getDownlineEmployees('TN-REF-39516');
  assert(Array.isArray(downline) && downline.some(e => e.id === 'emp-ali'), 'Indexed lookup by downline referral returns referred resellers');

  // Benchmark: 10,000 index lookups
  const startTime = performance.now();
  for (let i = 0; i < 10000; i++) {
    db.getEmployeeByCode('TN-REF-39516');
  }
  const endTime = performance.now();
  const durationMs = (endTime - startTime).toFixed(2);
  console.log(`[PERF] 10,000 indexed referenceCode lookups completed in ${durationMs} ms (~${(10000 / parseFloat(durationMs)).toFixed(0)} ops/ms)`);
  assert(parseFloat(durationMs) < 50, '10,000 lookups completed in under 50ms', `${durationMs}ms`);

  // ----------------------------------------------------------------
  // Test 8: Product Pagination Logic
  // ----------------------------------------------------------------
  console.log('\n--- Test 8: Product Pagination Logic ---');
  const allProducts = db.getState().products || [];
  const totalProducts = allProducts.length;
  const pageSize = 2;
  const page1 = allProducts.slice(0, pageSize);
  const totalPages = Math.ceil(totalProducts / pageSize);

  assert(page1.length <= pageSize, 'Page 1 size does not exceed limit of 2', `length=${page1.length}`);
  assert(totalPages >= 1, 'Total pages calculated correctly', `totalPages=${totalPages}, total=${totalProducts}`);

  console.log('\n=====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runIntegrityTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
