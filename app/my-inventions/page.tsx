"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import InventionDetail from "../components/InventionDetail";

export default function MyInventionsPage() {
  const { currentMember, inventions, categories, isFavorite, toggleFavorite } = useApp();
  const [selectedInvention, setSelectedInvention] = useState<any | null>(null);

  // If not logged in
  if (!currentMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] font-sans gap-4">
        <span className="text-zinc-400 font-bold text-sm">กรุณาเข้าสู่ระบบเพื่อดูสิ่งประดิษฐ์ของฉัน</span>
        <Link
          href="/login"
          className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-3 rounded-xl transition-all"
        >
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  // Filter inventions created by the current member
  const myInventions = inventions.filter((inv) => inv.member_id === currentMember.memberId);

  const formatBuddhistDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const date = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear() + 543;
      return `${date}/${month}/${year}`;
    } catch {
      return "12/2/2569";
    }
  };

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= filledStars) {
        stars.push(
          <span key={i} className="text-amber-400 text-base">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-zinc-300 dark:text-zinc-700 text-base">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col gap-5 font-sans">
      {/* Inventions list */}
      {myInventions.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[32px] p-16 flex flex-col items-center justify-center gap-4 shadow-xs text-center">
          <span className="text-zinc-300 text-6xl">💡</span>
          <h3 className="font-extrabold text-zinc-650 mt-2 text-base">ยังไม่มีสิ่งประดิษฐ์ที่สร้างเอง</h3>
          <p className="text-xs text-zinc-400 font-bold max-w-xs leading-normal">
            คุณสามารถคลิกปุ่ม <strong className="text-[#f39c12] font-black">+ สิ่งประดิษฐ์</strong> ที่อยู่แถบเมนูหัวข้อด้านบนขวา เพื่อบันทึกสร้างสิ่งประดิษฐ์ชิ้นใหม่ของคุณเองได้ที่นี่!
          </p>
        </div>
      ) : selectedInvention ? (
        <InventionDetail
          invention={selectedInvention}
          onBack={() => setSelectedInvention(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
          {myInventions.map((inv) => {
            const catName = categories.find((c) => c.categoryId === inv.category_id)?.categoryName || "อื่นๆ";
            const favorited = isFavorite(inv.inventionId);
            return (
              <div
                key={inv.inventionId}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-[32px] p-5 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-205 group animate-fade-in"
              >
                <div>
                  {/* Image and Favorite Top Section */}
                  <div className="flex items-start justify-between gap-4">
                    {/* Padded rounded thumbnail */}
                    <div className="w-36 h-36 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800/40 shrink-0 border border-zinc-100 dark:border-zinc-800/60">
                      <img
                        src={inv.inventionImages[0]}
                        alt={inv.inventionName}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-300"
                      />
                    </div>

                    {/* Heart/Favorite Outline Button on Right */}
                    <button
                      onClick={() => toggleFavorite(inv.inventionId)}
                      className={`p-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer ${
                        favorited ? "text-red-500 hover:text-red-650" : "text-zinc-300 hover:text-zinc-450 dark:text-zinc-600"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill={favorited ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Invention Details Section */}
                  <div className="mt-4 flex flex-col gap-2">
                    <h3 className="font-extrabold text-base text-zinc-900 dark:text-white leading-snug">
                      {inv.inventionName}
                    </h3>

                    {/* Category Tag */}
                    <div className="self-start">
                      <span className="bg-[#ffeaa7] dark:bg-amber-950/40 text-[#d35400] dark:text-amber-450 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
                        {catName}
                      </span>
                    </div>

                    {/* Creation Date BE format */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-450 dark:text-zinc-500 mt-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2.5" className="w-4 h-4">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      <span>ประดิษฐ์เมื่อวันที่ : {formatBuddhistDate(inv.createdAt)}</span>
                    </div>

                    {/* Stars Rating */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {renderStars(inv.averageRating)}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-5">
                  {/* Comment review stats */}
                  <div className="flex items-center gap-1.5 text-zinc-450 dark:text-zinc-500 text-xs font-bold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-zinc-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{inv.reviewCount}</span>
                  </div>

                  {/* View details button in orange color */}
                  <button
                    onClick={() => setSelectedInvention(inv)}
                    className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
