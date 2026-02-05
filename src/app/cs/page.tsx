"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  ChevronDown,
  ChevronUp,
  Bell,
  Calendar,
} from "lucide-react";
import { SubPageHero } from "@/components/SubPageHero";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  isActive: boolean;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
}

export default function CSPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices");
        const data = await res.json();
        if (data.success) {
          setNotices(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch notices");
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f1f2f6] dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <SubPageHero
        title="공지사항 & 이벤트"
        description="티켓대장의 새로운 소식과 혜택을 확인하세요."
        badgeText="고객센터"
        category="Community"
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-20 -mt-24">
        <div
          className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notices.map((notice) => (
                <div key={notice.id} className="group">
                  <button
                    onClick={() => toggleExpand(notice.id)}
                    className={`w-full text-left py-6 px-4 flex gap-4 items-start focus:outline-none transition-colors rounded-xl ${notice.isPinned ? "bg-indigo-50/50 hover:bg-indigo-50" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {notice.category === "EVENT" ? (
                        <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                          {notice.isPinned ? (
                            <Megaphone className="w-5 h-5 fill-current" />
                          ) : (
                            <Bell className="w-5 h-5" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            notice.category === "EVENT"
                              ? "bg-pink-100 text-pink-600"
                              : "bg-indigo-100 text-indigo-600"
                          }`}
                        >
                          {notice.category === "EVENT" ? "EVENT" : "NOTICE"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3
                        className={`font-bold text-lg transition-colors ${expandedId === notice.id ? "text-indigo-600" : "text-slate-800 group-hover:text-indigo-600"}`}
                      >
                        {notice.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 mt-2 text-slate-300">
                      {expandedId === notice.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </div>
                  </button>

                  {/* Expandable Content */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      expandedId === notice.id
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-8 pl-18 pr-4 md:pl-20 text-slate-600 leading-relaxed whitespace-pre-wrap">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm md:text-base">
                          {notice.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
