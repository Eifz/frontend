"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";

interface StepItem {
  id: number;
  title: string;
  images: string[];
  desc: string;
}

export default function AddInventionPage() {
  const { currentMember, categories, addCategory, addInvention } = useApp();
  const router = useRouter();

  // If not logged in
  if (!currentMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] font-sans gap-4">
        <span className="text-zinc-400 font-bold text-sm">กรุณาเข้าสู่ระบบเพื่อเพิ่มสิ่งประดิษฐ์</span>
        <Link
          href="/login"
          className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-3 rounded-xl transition-all"
        >
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const othersCategory = categories.find((c) => c.categoryName === "อื่นๆ");
  const sortedCategories = othersCategory
    ? [...categories.filter((c) => c.categoryId !== othersCategory.categoryId), othersCategory]
    : categories;

  // Form Fields State
  const [invName, setInvName] = useState("");
  const [invCategory, setInvCategory] = useState(categories[0]?.categoryId.toString() || "1");
  const [customCategory, setCustomCategory] = useState("");
  const [invDescription, setInvDescription] = useState("");
  const [invMaterials, setInvMaterials] = useState("");
  
  // Image Upload States
  const [coverImage, setCoverImage] = useState("");
  const [descImages, setDescImages] = useState<string[]>([]);
  const [matImages, setMatImages] = useState<string[]>([]);

  // Dynamic Steps State
  const [steps, setSteps] = useState<StepItem[]>([
    { id: 1, title: "", images: [], desc: "" }
  ]);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultiFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const promises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            resolve("");
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((results) => {
      const validResults = results.filter((r) => r.length > 0);
      setter((prev) => [...prev, ...validResults]);
    });
  };

  const handleStepMultiFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (!files) return;

    const promises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            resolve("");
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((results) => {
      const validResults = results.filter((r) => r.length > 0);
      const updated = [...steps];
      updated[index].images = [...updated[index].images, ...validResults];
      setSteps(updated);
    });
  };

  const handleAddStep = () => {
    setSteps([...steps, { id: Date.now(), title: "", images: [], desc: "" }]);
  };

  const handleMoveStepUp = (index: number) => {
    if (index === 0) return;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSteps(updated);
  };

  const handleMoveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSteps(updated);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length === 1) {
      alert("ต้องมีอย่างน้อย 1 ขั้นตอน");
      return;
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim() || !invCategory) return;

    // Parse materials by newline or comma
    const materialsArray = invMaterials
      .split(/[\n,]/)
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    // Resolve category id
    let resolvedCategoryId = parseInt(invCategory);
    if (othersCategory && invCategory === othersCategory.categoryId.toString()) {
      const typedCategory = customCategory.trim() || "อื่นๆ";
      resolvedCategoryId = addCategory(typedCategory);
    }

    // Call addInvention from AppContext with multi-image support
    addInvention(
      invName,
      invDescription,
      resolvedCategoryId,
      materialsArray,
      coverImage,
      descImages,
      matImages,
      steps.map((st) => ({
        id: st.id,
        title: st.title,
        image: st.images[0] || "",
        images: st.images,
        desc: st.desc,
      }))
    );

    alert("โพสต์สิ่งประดิษฐ์เรียบร้อยแล้ว!");
    router.push("/my-inventions");
  };

  return (
    <div className="flex flex-col gap-6 font-sans max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
          สิ่งประดิษฐ์ของฉัน
        </h1>
      </div>

      {/* Buttons Header Row */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-4 shadow-2xs">
        <Link
          href="/my-inventions"
          className="bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-250 dark:border-zinc-750 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
        >
          ยกเลิก
        </Link>
        <button
          type="submit"
          form="add-invention-form"
          className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-7 py-2.5 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          โพสต์
        </button>
      </div>

      {/* Form Area */}
      <form id="add-invention-form" onSubmit={handleFormSubmit} className="flex flex-col gap-6">
        
        {/* Box 1: Cover Image & General Details */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[20px] p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left Cover upload square */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <input
                type="file"
                id="cover-image-upload"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("cover-image-upload")?.click()}
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-[20px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all overflow-hidden shrink-0 group relative hover:bg-zinc-100"
              >
                {coverImage ? (
                  <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-zinc-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-[11px] font-black text-zinc-400">อัพโหลดรูปภาพ</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Form column */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                สิ่งประดิษฐ์
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-zinc-700 dark:text-zinc-350">
                  ชื่อสิ่งประดิษฐ์
                </label>
                <input
                  type="text"
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  placeholder="ป้อนชื่อสิ่งประดิษฐ์"
                  className="bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-1 focus:ring-[#f39c12]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-zinc-700 dark:text-zinc-350">
                  ประเภทของสิ่งประดิษฐ์
                </label>
                <div className="relative">
                  <select
                    value={invCategory}
                    onChange={(e) => setInvCategory(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#f39c12] appearance-none cursor-pointer"
                  >
                    {sortedCategories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* Custom category input if 'อื่นๆ' is selected */}
              {othersCategory && invCategory === othersCategory.categoryId.toString() && (
                <div className="flex flex-col gap-1.5 animate-fade-in mt-1">
                  <label className="text-[11px] font-black text-zinc-700 dark:text-zinc-350">
                    ระบุประเภทอื่นๆ
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="กรอกประเภทสิ่งประดิษฐ์ของคุณ"
                    className="bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-1 focus:ring-[#f39c12]"
                    required
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Box 2: Invention Description */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[20px] p-6 flex flex-col gap-4 shadow-2xs">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white text-center">
            คำอธิบายสิ่งประดิษฐ์
          </h2>
          
          {/* Custom Multi-image layout with "+" box matching screenshot */}
          <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 flex flex-wrap gap-3 items-center bg-zinc-50/20 dark:bg-zinc-900/20">
            {descImages.map((img, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                <img src={img} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setDescImages(descImages.filter((_, i) => i !== idx))}
                  className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black cursor-pointer shadow-2xs"
                  title="ลบรูปภาพ"
                >
                  ✕
                </button>
              </div>
            ))}
            
            <input
              type="file"
              id="desc-image-upload"
              accept="image/*"
              multiple
              onChange={(e) => handleMultiFileChange(e, setDescImages)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById("desc-image-upload")?.click()}
              className="w-16 h-16 rounded-xl border border-zinc-250 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 flex items-center justify-center text-xl font-bold text-zinc-450 cursor-pointer shrink-0 transition-all"
            >
              +
            </button>
          </div>

          <textarea
            value={invDescription}
            onChange={(e) => setInvDescription(e.target.value)}
            placeholder="อธิบายสั้นๆ ว่าคุณสร้างอะไร"
            rows={3}
            className="bg-white dark:bg-zinc-800/25 border border-zinc-200/50 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3.5 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-1 focus:ring-[#f39c12] resize-none"
            required
          />
        </div>

        {/* Box 3: Materials / Tools */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[20px] p-6 flex flex-col gap-4 shadow-2xs">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white text-center">
            วัสดุ / อุปกรณ์
          </h2>

          {/* Custom Multi-image layout with "+" box matching screenshot */}
          <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 flex flex-wrap gap-3 items-center bg-zinc-50/20 dark:bg-zinc-900/20">
            {matImages.map((img, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                <img src={img} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMatImages(matImages.filter((_, i) => i !== idx))}
                  className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black cursor-pointer shadow-2xs"
                  title="ลบรูปภาพ"
                >
                  ✕
                </button>
              </div>
            ))}
            
            <input
              type="file"
              id="mat-image-upload"
              accept="image/*"
              multiple
              onChange={(e) => handleMultiFileChange(e, setMatImages)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById("mat-image-upload")?.click()}
              className="w-16 h-16 rounded-xl border border-zinc-250 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 flex items-center justify-center text-xl font-bold text-zinc-450 cursor-pointer shrink-0 transition-all"
            >
              +
            </button>
          </div>

          <textarea
            value={invMaterials}
            onChange={(e) => setInvMaterials(e.target.value)}
            placeholder="ระบุเครื่องมือหรือวัสดุที่ใช้ทั้งหมด"
            rows={4}
            className="bg-white dark:bg-zinc-800/25 border border-zinc-200/50 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3.5 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-1 focus:ring-[#f39c12] resize-none"
            required
          />
        </div>

        {/* Box 4: Steps */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[20px] p-6 flex flex-col gap-4 shadow-2xs animate-fade-in"
          >
            {/* Step header with title input centered and actions on right matching mockup */}
            <div className="flex items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-3 relative">
              <div className="flex items-center justify-center gap-2 flex-1 text-center w-full">
                <span className="font-black text-xl text-zinc-900 dark:text-white shrink-0">
                  วิธีที่{index + 1} :
                </span>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const updated = [...steps];
                    updated[index].title = e.target.value;
                    setSteps(updated);
                  }}
                  placeholder="ป้อนชื่อขั้นตอน"
                  className="bg-transparent border-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-black text-xl focus:outline-none focus:ring-0 text-center max-w-[200px] sm:max-w-[300px]"
                  required
                />
              </div>

              {/* Action buttons (Move Up, Move Down, Delete) absolutely positioned on the right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveStepUp(index)}
                  disabled={index === 0}
                  className={`p-1.5 rounded-lg transition-all text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer ${
                    index === 0 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  title="เลื่อนขึ้น"
                >
                  <span className="text-base">↑</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveStepDown(index)}
                  disabled={index === steps.length - 1}
                  className={`p-1.5 rounded-lg transition-all text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer ${
                    index === steps.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  title="เลื่อนลง"
                >
                  <span className="text-base">↓</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteStep(index)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                  title="ลบขั้นตอนนี้"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Custom Multi-image layout with "+" box matching screenshot */}
            <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 flex flex-wrap gap-3 items-center bg-zinc-50/20 dark:bg-zinc-900/20">
              {step.images.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...steps];
                      updated[index].images = updated[index].images.filter((_, i) => i !== idx);
                      setSteps(updated);
                    }}
                    className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black cursor-pointer shadow-2xs"
                    title="ลบรูปภาพ"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <input
                type="file"
                id={`step-image-${index}`}
                accept="image/*"
                multiple
                onChange={(e) => handleStepMultiFileChange(e, index)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById(`step-image-${index}`)?.click()}
                className="w-16 h-16 rounded-xl border border-zinc-250 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 flex items-center justify-center text-xl font-bold text-zinc-455 cursor-pointer shrink-0 transition-all"
              >
                +
              </button>
            </div>

            <textarea
              value={step.desc}
              onChange={(e) => {
                const updated = [...steps];
                updated[index].desc = e.target.value;
                setSteps(updated);
              }}
              placeholder="เขียนคำอธิบายอย่างละเอียดของขั้นตอนนี้"
              rows={3}
              className="bg-white dark:bg-zinc-800/25 border border-zinc-200/50 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3.5 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-1 focus:ring-[#f39c12] resize-none"
              required
            />
          </div>
        ))}

        {/* Center: Add Step Button */}
        <div className="flex items-center justify-center mt-3">
          <button
            type="button"
            onClick={handleAddStep}
            className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-7 py-3 rounded-2xl text-xs font-black shadow-md shadow-[#f39c12]/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>เพิ่มขั้นตอนใหม่</span>
            <span>+</span>
          </button>
        </div>

      </form>
    </div>
  );
}
