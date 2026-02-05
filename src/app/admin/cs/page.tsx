"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Pin } from "lucide-react";
import { useDialog } from "@/context/DialogContext";

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

export default function AdminCSPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { openDialog } = useDialog();

  // Form State
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("NOTICE");
  const [isPinned, setIsPinned] = useState(false); // New State

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notices");
      const data = await res.json();
      if (data.success) {
        setNotices(data.data);
      }
    } catch {
      console.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setId("");
    setTitle("");
    setContent("");
    setCategory("NOTICE");
    setIsPinned(false);
    setIsEditMode(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (notice: Notice) => {
    setId(notice.id);
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category);
    setIsPinned(notice.isPinned); // Set pinned state
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      return openDialog({ message: "제목과 내용을 입력해주세요." });
    }

    try {
      const url = isEditMode
        ? `/api/admin/notices/${id}`
        : "/api/admin/notices";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, isPinned }),
      });

      if (res.ok) {
        openDialog({
          title: isEditMode ? "수정 완료" : "등록 완료",
          message: "정상적으로 처리되었습니다.",
          type: "alert",
        });
        setIsModalOpen(false);
        fetchNotices();
      } else {
        openDialog({ message: "처리 중 오류가 발생했습니다." });
      }
    } catch {
      openDialog({ message: "서버 통신 오류" });
    }
  };

  const handleDelete = (noticeId: string) => {
    openDialog({
      type: "confirm",
      message: "정말 삭제하시겠습니까?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/notices/${noticeId}`, {
            method: "DELETE",
          });
          if (res.ok) fetchNotices();
        } catch {
          console.error("Delete failed");
        }
      },
    });
  };

  if (loading) return <div className="p-8">로딩중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          고객센터 / 공지 관리
        </h2>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> 공지사항 등록
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-sm font-bold text-slate-600 w-24 text-center">
                분류
              </th>
              <th className="p-4 text-sm font-bold text-slate-600">제목</th>
              <th className="p-4 text-sm font-bold text-slate-600 w-32">
                작성일
              </th>
              <th className="p-4 text-sm font-bold text-slate-600 w-24 text-center">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              notices.map((notice) => (
                <tr
                  key={notice.id}
                  className={`border-b last:border-0 hover:bg-slate-50/50 ${notice.isPinned ? "bg-indigo-50/30" : ""}`}
                >
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        notice.category === "EVENT"
                          ? "bg-pink-50 text-pink-600"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {notice.category === "EVENT" ? "이벤트" : "공지"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800 flex items-center gap-2">
                      {notice.isPinned && (
                        <Pin
                          size={14}
                          className="text-indigo-500 fill-current rotate-45"
                        />
                      )}
                      {notice.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {notice.content}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {/* Edit & Delete Buttons */}
                      <button
                        onClick={() => handleOpenEdit(notice)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        title="수정"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Write/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {isEditMode ? "공지사항 수정" : "새 공지사항 등록"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} title="닫기">
                <X className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">분류</label>
                  <select
                    className="w-full border p-3 rounded-lg bg-slate-50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    title="공지사항 분류 선택"
                  >
                    <option value="NOTICE">공지사항</option>
                    <option value="EVENT">이벤트</option>
                  </select>
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">
                      상단 고정
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                  autoFocus
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border p-3 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border p-3 rounded-lg text-slate-900 h-40 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  {isEditMode ? "수정완료" : "등록하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
