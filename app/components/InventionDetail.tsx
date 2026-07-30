"use client";

import React, { useState } from "react";
import { Invention, useApp } from "../context/AppContext";
import { useRouter } from "next/navigation";

interface InventionDetailProps {
  invention: Invention;
  onBack: () => void;
}

export default function InventionDetail({ invention, onBack }: InventionDetailProps) {
  const { toggleFavorite, isFavorite, currentMember, addReview, deleteInvention } = useApp();
  const favorited = isFavorite(invention.inventionId);
  const router = useRouter();

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewsList, setReviewsList] = useState(invention.reviews || []);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentMember) {
      alert("กรุณาเข้าสู่ระบบก่อนบันทึกรายการโปรด");
      return;
    }
    toggleFavorite(invention.inventionId);
  };

  const handleDeleteClick = () => {
    if (!currentMember) {
      alert("กรุณาเข้าสู่ระบบเพื่อดำเนินการ");
      return;
    }
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบสิ่งประดิษฐ์นี้?")) {
      deleteInvention(invention.inventionId);
      onBack();
    }
  };

  const handleEditClick = () => {
    alert("ฟังก์ชันแก้ไขกำลังอยู่ในระหว่างการพัฒนา");
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) {
      alert("กรุณาเข้าสู่ระบบก่อนรีวิวสิ่งประดิษฐ์");
      return;
    }
    if (!comment.trim()) {
      alert("กรุณากรอกข้อความความคิดเห็น");
      return;
    }
    
    // Call addReview from context
    addReview(invention.inventionId, rating, comment);

    // Refresh reviews from updated state/storage
    const reviewerName = `${currentMember.firstName} ${currentMember.lastName}`;
    const newRev = {
      reviewId: Date.now(),
      reviewerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviewsList([...reviewsList, newRev]);
    setComment("");
    setRating(5);
    alert("โพสต์ความคิดเห็นเรียบร้อยแล้ว!");
  };

  const handleCancelReview = () => {
    setComment("");
    setRating(5);
  };

  const handleShareClick = () => {
    alert("ขอบคุณที่ร่วมแชร์! ระบบได้บันทึกไว้ว่าคุณทำสิ่งประดิษฐ์นี้สำเร็จแล้ว 🎉");
  };

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

  const renderStars = (starCount: number) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span key={i} className={`text-base ${i <= starCount ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-[32px] p-6 sm:p-8 flex flex-col gap-8 shadow-xs animate-fade-in font-sans w-full max-w-4xl mx-auto mb-10">
      
      {/* Back Button */}
      <div className="self-start">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-550 dark:text-zinc-400 hover:text-[#f39c12] dark:hover:text-[#f39c12] font-extrabold text-sm transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          กลับหน้าแรก
        </button>
      </div>

      {/* Header Info Block */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        {/* Title, Badge, Date, Stars */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">
            {invention.inventionName}
          </h1>
          <p className="text-sm font-bold text-zinc-450 dark:text-zinc-550">
            โดย <span className="text-[#f39c12] hover:underline cursor-pointer">TheGorka</span>
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            {/* Category badge */}
            <span className="bg-[#ffeaa7] dark:bg-amber-950/40 text-[#d35400] dark:text-amber-450 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wide">
              {invention.category_id === 2 ? "อิเล็กทรอนิกส์ / วงจร" : "งานฝีมือ"}
            </span>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-450 dark:text-zinc-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2.5" className="w-4 h-4">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>ประดิษฐ์เมื่อวันที่ : {formatBuddhistDate(invention.createdAt)}</span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {renderStars(Math.round(invention.averageRating))}
          </div>
        </div>

        {/* Action Buttons (Favorite) */}
        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800/60 pt-4 sm:pt-0 shrink-0">

          {/* Heart Button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-150 dark:border-zinc-800 transition-all cursor-pointer ${
              favorited ? "text-red-500 border-red-200/50" : "text-zinc-400"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={favorited ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Image Gallery (2 images side-by-side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-sans">
        {invention.inventionImages.map((img, index) => (
          <div
            key={index}
            className="aspect-[4/3] rounded-[24px] overflow-hidden border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 shadow-2xs hover:scale-[1.01] transition-all duration-300"
          >
            <img
              src={img}
              alt={`${invention.inventionName} gallery ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {invention.inventionImages.length === 1 && (
          <div
            className="aspect-[4/3] rounded-[24px] overflow-hidden border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 shadow-2xs md:col-span-2"
          >
            <img
              src={invention.inventionImages[0]}
              alt={invention.inventionName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Render Steps */}
      {invention.steps && invention.steps.length > 0 && (
        <div className="flex flex-col gap-10 border-t border-zinc-100 dark:border-zinc-800/60 pt-8 mt-2">
          {invention.steps.map((step, idx) => {
            const hasMultipleImages = step.images && step.images.length > 1;
            const singleImage = step.image || (step.images ? step.images[0] : "");

            return (
              <div key={step.id} className="flex flex-col gap-5 items-center w-full">
                {/* Step Heading */}
                <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white text-center leading-snug">
                  {step.title.startsWith("ขั้นตอนที่") ? step.title : `ขั้นตอนที่ ${idx + 1}: ${step.title}`}
                </h3>

                {/* Step Images */}
                {hasMultipleImages ? (
                  <div className="flex flex-col gap-4 w-full items-center">
                    {/* Top Row: Two side-by-side images */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {step.images!.slice(0, 2).map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 shadow-2xs"
                        >
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    {/* Bottom Row: One centered image if there's a third image */}
                    {step.images!.length > 2 && (
                      <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 shadow-2xs mt-1">
                        <img src={step.images![2]} className="w-full h-full object-cover" />
                        {step.images![2] === "/images/led_lamp_lid_switch.png" && (
                          <button
                            onClick={() => alert("รายละเอียดเพิ่มเติมกำลังประมวลผล")}
                            className="absolute bottom-3 right-3 bg-white/95 dark:bg-zinc-900/95 text-zinc-850 dark:text-zinc-100 text-[10px] font-bold px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-[#f39c12] hover:text-white dark:hover:bg-[#f39c12] dark:hover:text-white cursor-pointer transition-all shadow-2xs"
                          >
                            ดูเพิ่มเติม
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // Single image
                  singleImage && (
                    <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 shadow-2xs">
                      <img
                        src={singleImage}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                      {singleImage === "/images/led_lamp_lid_switch.png" && (
                        <button
                          onClick={() => alert("รายละเอียดเพิ่มเติมกำลังประมวลผล")}
                          className="absolute bottom-3 right-3 bg-white/95 dark:bg-zinc-900/95 text-zinc-850 dark:text-zinc-100 text-[10px] font-bold px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-[#f39c12] hover:text-white dark:hover:bg-[#f39c12] dark:hover:text-white cursor-pointer transition-all shadow-2xs"
                        >
                          ดูเพิ่มเติม
                        </button>
                      )}
                    </div>
                  )
                )}

                {/* Step Description / Materials List */}
                {/* Check if it's step 1 / Materials step to display as bullet list */}
                {idx === 0 ? (
                  <div className="self-start pl-4 sm:pl-10 mt-2">
                    <ul className="text-zinc-800 dark:text-zinc-200 text-sm font-bold flex flex-col gap-2">
                      {invention.requiredMaterials.map((mat, mIdx) => (
                        <li key={mIdx}>
                          {mIdx + 1}- {mat}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  step.desc && (
                    <p className="text-sm font-bold text-zinc-750 dark:text-zinc-250 leading-relaxed text-center max-w-2xl px-4 sm:px-10 mt-2">
                      {step.desc}
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* "I Did It" Section */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-8 mt-4 flex flex-col items-center gap-4 text-center">
        <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white tracking-tight">
          คุณทำโปรเจ็กต์นี้ใช่ไหม? แชร์ให้เราดูหน่อยสิ!
        </h4>
        {currentMember ? (
          <button
            onClick={handleShareClick}
            className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs sm:text-sm font-black py-3 px-10 rounded-[14px] transition-all cursor-pointer shadow-md shadow-[#f39c12]/20 hover:scale-[1.02]"
          >
            ฉันทำมันแล้ว
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs sm:text-sm font-black py-3 px-10 rounded-[14px] transition-all cursor-pointer shadow-md shadow-[#f39c12]/20 hover:scale-[1.02]"
          >
            เข้าสู่ระบบ
          </button>
        )}
      </div>

      {/* Comments / Reviews Section */}
      <div className="border-t border-[#eaeaea] dark:border-zinc-800/60 pt-8 mt-4 flex flex-col gap-6">
        <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white text-center">
          ความคิดเห็น
        </h3>

        {/* Reviews List */}
        <div className="flex flex-col">
          {reviewsList.length === 0 ? (
            <p className="text-xs text-zinc-450 dark:text-zinc-550 text-center py-6 font-bold">
              ยังไม่มีความคิดเห็นสำหรับสิ่งประดิษฐ์นี้ มารีวิวคนแรกกันเถอะ!
            </p>
          ) : (
            reviewsList.map((rev) => (
              <div key={rev.reviewId} className="flex flex-col gap-2 py-4 border-b border-[#eaeaea] dark:border-zinc-800/40 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-zinc-900 dark:text-white">
                    {rev.reviewerName}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {renderStars(rev.rating)}
                  </div>
                </div>
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Write Review Form Card */}
        {currentMember ? (
          <div className="bg-[#fafafa] dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 mt-4">
            <form onSubmit={handlePostReview} className="flex flex-col gap-4">
              
              {/* Stars Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-350">
                  ให้คะแนนสิ่งประดิษฐ์
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-xl sm:text-2xl transition-all hover:scale-110 focus:outline-none cursor-pointer"
                    >
                      <span className={star <= rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="เขียนรีวิวสิ่งประดิษฐ์"
                rows={3}
                required
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-2xl px-4 py-3 text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-550 font-bold focus:outline-none focus:ring-1 focus:ring-[#f39c12] resize-none"
              />

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelReview}
                  className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 dark:bg-zinc-850 dark:border-zinc-750 dark:text-zinc-300 dark:hover:bg-zinc-750 text-[11px] font-black px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                
                <button
                  type="submit"
                  className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-[11px] font-black px-7 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  โพสต์
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="bg-[#fafafa] dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-800/80 rounded-3xl p-6 text-center mt-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mb-3">
              กรุณาเข้าสู่ระบบเพื่อเขียนรีวิวสำหรับสิ่งประดิษฐ์นี้
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-xs"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
