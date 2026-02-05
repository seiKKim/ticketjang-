"use client";

import { Bell, ChevronRight, Loader2, Pin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Notice {
  id: string;
  title: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
}

export function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices?limit=5");
        const data = await res.json();
        if (data.success) {
          setNotices(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-600" />
          공지사항
        </h2>
        <Link
          href="/cs"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
          title="더보기"
        >
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : notices.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          notices.map((notice) => {
            const isNew =
              new Date(notice.createdAt).getTime() >
              Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days
            return (
              <Link
                key={notice.id}
                href="/cs"
                className="flex justify-between items-start group cursor-pointer"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-1 mb-0.5">
                    {notice.isPinned && (
                      <Pin className="w-3 h-3 text-indigo-500 fill-current rotate-45" />
                    )}
                    {notice.category === "EVENT" && (
                      <span className="text-[10px] bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded font-bold">
                        EVENT
                      </span>
                    )}
                    {isNew && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
                        N
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm truncate font-medium group-hover:text-indigo-600 transition-colors ${
                      isNew ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {notice.title}
                  </p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap mt-0.5">
                  {new Date(notice.createdAt).toLocaleDateString().slice(2)}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
