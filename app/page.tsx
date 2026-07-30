"use client";

import React, { useState } from "react";
import { useApp } from "./context/AppContext";
import InventionDetail from "./components/InventionDetail";

export default function SearchInventionPage() {
  const { inventions, categories, isFavorite, toggleFavorite, currentMember } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvention, setSelectedInvention] = useState<any | null>(null);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (selectedInvention) {
      setSelectedInvention(null);
    }
  };

  const filteredInventions = inventions.filter((inv) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = inv.inventionName.toLowerCase().includes(q);
      const descMatch = inv.description.toLowerCase().includes(q);
      const catName = categories.find((c) => c.categoryId === inv.category_id)?.categoryName.toLowerCase() || "";
      const catMatch = catName.includes(q);

      return nameMatch || descMatch || catMatch;
    }
    return true;
  });

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
    <div className="flex flex-col gap-6">
      {/* Huge Search Bar matching screenshot */}
      <div className="relative w-full shadow-xs rounded-[24px]">
        <span className="absolute inset-y-0 left-6 flex items-center text-zinc-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="ค้นหาสิ่งประดิษฐ์ หรือ ประเภท"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] pl-16 pr-6 py-5 text-base focus:outline-none focus:border-[#f39c12] dark:focus:border-[#f39c12] transition-all text-zinc-800 dark:text-white font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute inset-y-0 right-6 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Cards Grid List - 3 Columns matching Screenshot */}
      {selectedInvention ? (
        <InventionDetail
          invention={selectedInvention}
          onBack={() => setSelectedInvention(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {filteredInventions.map((inv) => {
          const catName = categories.find((c) => c.categoryId === inv.category_id)?.categoryName || "อื่นๆ";
          const isFav = isFavorite(inv.inventionId);
          return (
            <div
              key={inv.inventionId}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-[32px] p-5 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-205 group"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!currentMember) {
                        alert("กรุณาเข้าสู่ระบบก่อนบันทึกรายการโปรด");
                        return;
                      }
                      toggleFavorite(inv.inventionId);
                    }}
                    className={`p-2 rounded-full hover:bg-zinc-550 dark:hover:bg-zinc-800 transition-all cursor-pointer ${
                      isFav ? "text-red-500" : "text-zinc-400 hover:text-zinc-650"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill={isFav ? "currentColor" : "none"}
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

              {/* Bottom Actions Row matching Screenshot */}
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
