import React, { useState, useEffect } from 'react';
import { Play, GraduationCap, ExternalLink, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext.js';
import { api } from '../../services/api.js';
import { getYouTubeEmbedUrl } from '../../utils/youtube.js';

export const ResellerTrainingTab: React.FC = () => {
  const { lang, employeeToken } = useApp();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      if (!employeeToken) return;
      try {
        const data = await api.employeeGetTrainingVideos(employeeToken);
        setVideos(data || []);
      } catch (err) {
        console.error('Failed to load training videos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, [employeeToken]);

  const handleOpenLink = (video: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">ট্রেনিং ফাইল লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8 w-full max-w-[1920px] mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {lang === 'bn' ? 'রিসেলার ট্রেনিং সেন্টার' : 'Reseller Training Center'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {lang === 'bn' ? 'নিচের যেকোনো টিউটোরিয়ালে ক্লিক করে ভিডিও প্লে করুন বা ওপেন করুন' : 'Click on any tutorial title to play or open video link'}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 shrink-0">
          {videos.length} টি ট্রেনিং
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-4">
        {/* Active Embedded Player (if video selected) */}
        {selectedVideo && (
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.videoUrl) || ''}
                title={selectedVideo.titleBn || selectedVideo.titleEn || 'Training Video'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 flex items-center justify-between gap-3 bg-slate-900 text-white">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold truncate">
                  {selectedVideo.titleBn || selectedVideo.titleEn || 'ট্রেনিং ভিডিও'}
                </h3>
              </div>
              <button
                onClick={(e) => handleOpenLink(selectedVideo, e)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>মূল লিংকে যান</span>
              </button>
            </div>
          </div>
        )}

        {/* Serialized Training List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-emerald-600" />
              ট্রেনিং তালিকা (ক্রমানুসারে)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">ক্লিক করে ভিডিও দেখুন</span>
          </div>

          {videos.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-300 flex items-center justify-center mx-auto">
                <Play className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">কোনো ট্রেনিং ভিডিও খুঁজে পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {videos.map((video, idx) => {
                const title = video.titleBn || video.titleEn || `ট্রেনিং টিউটোরিয়াল #${idx + 1}`;
                const isSelected = selectedVideo?.id === video.id;

                return (
                  <div
                    key={video.id || idx}
                    onClick={() => setSelectedVideo(video)}
                    className={`p-3.5 sm:p-4 flex items-center gap-3 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Serial Number Badge */}
                    <span className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 group-hover:border-slate-300'
                    }`}>
                      {idx + 1}
                    </span>

                    {/* Video Title Name */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                        isSelected ? 'text-emerald-900' : 'text-slate-900 group-hover:text-emerald-600'
                      }`}>
                        {title}
                      </h4>
                      {video.videoUrl && (
                        <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                          {video.videoUrl}
                        </p>
                      )}
                    </div>

                    {/* Open / Play Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleOpenLink(video, e)}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 rounded-lg inline-flex items-center gap-1 transition-all"
                        title="ইউটিউবে ভিডিও খুলুন"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="hidden sm:inline">লিংক খুলুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedVideo(video)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white'
                        }`}
                        title="প্লে করুন"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
