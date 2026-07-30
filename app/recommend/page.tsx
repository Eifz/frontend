"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";

interface MaterialItem {
  materialId: number;
  materialName: string;
  category: string;
  materialImageUrl: string;
  checked: boolean;
}

interface RecommendedInvention {
  id: number;
  name: string;
  category: string;
  dateString: string;
  rating: number;
  comments: number;
  likes: number;
  dislikes: number;
  matchPercentage: number;
  imageUrl: string;
}

const RECOMMENDED_INVENTIONS: RecommendedInvention[] = [
  {
    id: 1,
    name: "ชั้นเก็บของจากกล่องกระดาษลัง",
    category: "งานฝีมือ",
    dateString: "6/4/2568",
    rating: 5,
    comments: 17,
    likes: 23,
    dislikes: 1,
    matchPercentage: 93,
    imageUrl: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "กระเป๋าเงินกระดาษบาง",
    category: "งานฝีมือ",
    dateString: "10/8/2568",
    rating: 3,
    comments: 10,
    likes: 23,
    dislikes: 1,
    matchPercentage: 87,
    imageUrl: "https://images.unsplash.com/photo-1627224224601-575517904711?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    name: "เวทีหุ่นกระดาษ",
    category: "งานฝีมือ",
    dateString: "6/1/2568",
    rating: 4,
    comments: 10,
    likes: 23,
    dislikes: 1,
    matchPercentage: 85,
    imageUrl: "https://images.unsplash.com/photo-1537884944318-390069bb8665?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "กิ๊บติดผมประดับกระดาษ DIY",
    category: "งานฝีมือ",
    dateString: "19/5/2568",
    rating: 5,
    comments: 1,
    likes: 23,
    dislikes: 1,
    matchPercentage: 85,
    imageUrl: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 5,
    name: "ที่ใส่ปากกา",
    category: "ของใช้ในบ้าน",
    dateString: "24/2/2568",
    rating: 3,
    comments: 2,
    likes: 23,
    dislikes: 1,
    matchPercentage: 76,
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&auto=format&fit=crop&q=60",
  },
];

export default function RecommendPage() {
  const { currentMember } = useApp();
  const [hasCheckedMaterials, setHasCheckedMaterials] = useState(false);
  const [satisfactionRating, setSatisfactionRating] = useState(4);

  useEffect(() => {
    const saved = localStorage.getItem("diy_materials");
    const requested = localStorage.getItem("diy_recommendation_requested") === "true";

    if (saved && requested) {
      const parsed: MaterialItem[] = JSON.parse(saved);
      const hasChecked = parsed.some((m) => m.checked);
      setHasCheckedMaterials(hasChecked);
    } else {
      setHasCheckedMaterials(false);
    }
  }, []);

  // If not logged in
  if (!currentMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] font-sans gap-4">
        <span className="text-zinc-400 font-bold text-sm">กรุณาเข้าสู่ระบบเพื่อดูคำแนะนำสิ่งประดิษฐ์</span>
        <Link
          href="/login"
          className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-3 rounded-xl transition-all"
        >
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-amber-400 text-sm" : "text-zinc-200 dark:text-zinc-800 text-sm"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Conditional rendering based on checked materials */}
      {!hasCheckedMaterials ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[32px] p-16 flex flex-col items-center justify-center gap-4 shadow-xs text-center">
          <span className="text-zinc-300 text-6xl">💡</span>
          <h3 className="font-extrabold text-zinc-650 mt-2 text-base">กรุณาเลือกวัสดุของคุณก่อน</h3>
          <p className="text-xs text-zinc-400 font-bold max-w-xs leading-normal">
            กรุณาเข้าไปเลือกวัสดุที่คุณมีในหน้าจัดการวัสดุก่อน เพื่อนำข้อมูลวัสดุดังกล่าวมาวิเคราะห์และคำนวณหาแนะนำสิ่งประดิษฐ์ค่ะ
          </p>
          <Link
            href="/materials"
            className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-xs mt-2"
          >
            เลือกวัสดุของฉัน
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Section Heading */}
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
            สิ่งประดิษฐ์ที่ระบบแนะนำ
          </h2>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RECOMMENDED_INVENTIONS.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[32px] p-5 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-200 group animate-fade-in"
              >
                <div>
                  {/* Top section: image on left, match percentage on right */}
                  <div className="flex items-start justify-between gap-4">
                    {/* Thumbnail */}
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 dark:border-zinc-800 shrink-0">
                      <img
                        src={inv.imageUrl}
                        alt={inv.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-300"
                      />
                    </div>

                    {/* Match percentage container */}
                    <div className="flex flex-col items-end pr-2">
                      <span className="text-sm font-extrabold text-zinc-600 dark:text-zinc-350">โอกาสในการประดิษฐ์</span>
                      <span className="text-2xl font-black text-[#ff9f1c] mt-0.5">{inv.matchPercentage}%</span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="mt-4 flex flex-col gap-1.5">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                      {inv.name}
                    </h3>
                    
                    {/* Tag category */}
                    <div className="self-start">
                      <span className="bg-[#ffeaa7] dark:bg-amber-950/30 text-[#d35400] dark:text-amber-450 text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase">
                        {inv.category}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 mt-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      <span>ประดิษฐ์เมื่อวันที่ : {inv.dateString}</span>
                    </div>

                    {/* Star ratings */}
                    <div className="flex items-center gap-0.5">
                      {renderStars(inv.rating)}
                    </div>
                  </div>
                </div>

                {/* Bottom stats row */}
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-5">
                  {/* Reviews count */}
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{inv.comments}</span>
                  </div>

                  {/* Likes/Dislikes */}
                  <div className="flex items-center gap-3 text-zinc-400 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <span>👍</span> <span>{inv.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>👎</span> <span>{inv.dislikes}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom rating widget centered and slightly bigger */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12 w-full py-6 border-t border-zinc-100 dark:border-zinc-800/40">
            <span className="text-sm sm:text-base font-black text-zinc-850 dark:text-zinc-200">
              กรุณาให้คะแนนความพึงพอใจ
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSatisfactionRating(star)}
                  className="text-2xl sm:text-3xl cursor-pointer focus:outline-none transition-all hover:scale-110"
                >
                  <span className={star <= satisfactionRating ? "text-[#f39c12]" : "text-zinc-250 dark:text-zinc-800"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
