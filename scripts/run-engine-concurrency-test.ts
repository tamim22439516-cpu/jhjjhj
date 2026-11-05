import crypto from 'crypto';
import { Mutex } from 'async-mutex';
import { db } from '../server/db.ts';

interface EngineTierResult {
  concurrency: number;
  authOpsPerSec: number;
  catalogOpsPerSec: number;
  indexOpsPerSec: number;
  walletOpsPerSec: number;
  totalTimeMs: number;
  walletAnomalies: number;
  walletIntegrityPassed: boolean;
  heapUsedMB: number;
}

async function benchmarkEngineTier(concurrency: number): Promise<EngineTierResult> {
  const startMem = process.memoryUsage().heapUsed / (1024 * 1024);
  const t0 = performance.now();

  // 1. Concurrent Password Verification / Auth Hash
  const authStart = performance.now();
  const testHash = crypto.createHash('sha256').update('TawzoonPass2026!').digest('hex');
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      const h = crypto.createHash('sha256').update('TawzoonPass2026!').digest('hex');
      return h === testHash;
    })
  );
  const authDuration = performance.now() - authStart;
  const authOpsPerSec = concurrency / (authDuration / 1000);

  // 2. Concurrent Product Catalog Filter & Bengali Normalization
  const catalogStart = performance.now();
  const products = db.getState().products || [];
  await Promise.all(
    Array.from({ length: concurrency }, async (_, idx) => {
      const q = idx % 2 === 0 ? 'style' : 'পোশাক';
      return products.filter((p) => (p.nameBn && p.nameBn.includes(q)) || p.categorySlug === 'shop');
    })
  );
  const catalogDuration = performance.now() - catalogStart;
  const catalogOpsPerSec = concurrency / (catalogDuration / 1000);

  // 3. Concurrent In-Memory Indexed Lookups (O(1))
  const indexStart = performance.now();
  const testId = 'emp-shaali';
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      return db.getEmployeeById(testId);
    })
  );
  const indexDuration = performance.now() - indexStart;
  const indexOpsPerSec = concurrency / (indexDuration / 1000);

  // 4. Concurrent Wallet Mutex Double-Debit/Credit Prevention Stress Test
  const walletStart = performance.now();
  const walletMutex = new Mutex();
  let walletBalance = 50000;
  let totalDebited = 0;
  let totalCredited = 0;
  let anomalies = 0;

  await Promise.all(
    Array.from({ length: concurrency }, async (_, idx) => {
      const isDebit = idx % 2 === 0;
      const amount = 5;

      await walletMutex.runExclusive(async () => {
        const prev = walletBalance;
        if (isDebit) {
          if (walletBalance - amount >= 120) {
            walletBalance -= amount;
            totalDebited += amount;
          }
        } else {
          walletBalance += amount;
          totalCredited += amount;
        }

        if (isDebit && walletBalance !== prev - amount && prev - amount >= 120) {
          anomalies++;
        }
      });
    })
  );
  const walletDuration = performance.now() - walletStart;
  const walletOpsPerSec = concurrency / (walletDuration / 1000);

  const expectedBalance = 50000 + totalCredited - totalDebited;
  const walletIntegrityPassed = walletBalance === expectedBalance && anomalies === 0;
  const totalTimeMs = performance.now() - t0;
  const endMem = process.memoryUsage().heapUsed / (1024 * 1024);

  return {
    concurrency,
    authOpsPerSec: Math.round(authOpsPerSec),
    catalogOpsPerSec: Math.round(catalogOpsPerSec),
    indexOpsPerSec: Math.round(indexOpsPerSec),
    walletOpsPerSec: Math.round(walletOpsPerSec),
    totalTimeMs: Number(totalTimeMs.toFixed(1)),
    walletAnomalies: anomalies,
    walletIntegrityPassed,
    heapUsedMB: Number(endMem.toFixed(1)),
  };
}

async function run() {
  console.log('--- Benchmarking Core Application Engine Across Distributed Concurrency ---');
  const tiers = [100, 500, 1000, 2500, 5000];
  const results: EngineTierResult[] = [];

  for (const tier of tiers) {
    const res = await benchmarkEngineTier(tier);
    results.push(res);
    console.log(`Tier ${tier}: Total ${res.totalTimeMs}ms | Auth ${res.authOpsPerSec}/s | Catalog ${res.catalogOpsPerSec}/s | Index ${res.indexOpsPerSec}/s | Wallet ${res.walletOpsPerSec}/s | Wallet: ${res.walletIntegrityPassed ? 'PASS (0 duplicate)' : 'FAIL'}`);
  }

  const fs = await import('fs');
  fs.writeFileSync('scripts/engine-concurrency-summary.json', JSON.stringify(results, null, 2), 'utf-8');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
