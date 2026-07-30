"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp, Invention } from "../context/AppContext";
import { getMaterialTypes, getMaterialsList, addMaterial, editMaterial, deleteMaterial } from "../../service/api";

interface MaterialItem {
  materialId: number;
  materialName: string;
  category: string;
  materialImageUrl: string;
  checked: boolean;
  commentCount: number;
  rating: number;
  dateString: string;
}

const SEED_MATERIALS: MaterialItem[] = [
  {
    materialId: 2,
    materialName: "กระดาษลัง",
    category: "กระดาษ",
    materialImageUrl: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=300&auto=format&fit=crop&q=60",
    checked: true,
    commentCount: 8,
    rating: 3,
    dateString: "10/2/2569",
  },
  {
    materialId: 1,
    materialName: "ขวดพลาสติก 1.5 L",
    category: "พลาสติก",
    materialImageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&auto=format&fit=crop&q=60",
    checked: true,
    commentCount: 46,
    rating: 4,
    dateString: "12/2/2569",
  },
  {
    materialId: 3,
    materialName: "ไม้ไอติม",
    category: "ไม้",
    materialImageUrl: "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=300&auto=format&fit=crop&q=60",
    checked: false,
    commentCount: 10,
    rating: 3,
    dateString: "10/2/2569",
  },
  {
    materialId: 4,
    materialName: "กระป๋องโค้ก",
    category: "โลหะ",
    materialImageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=60",
    checked: false,
    commentCount: 8,
    rating: 3,
    dateString: "8/2/2569",
  },
  {
    materialId: 5,
    materialName: "ขวดแก้ว",
    category: "แก้ว",
    materialImageUrl: "https://images.unsplash.com/photo-1582291993433-be760ec252f9?w=300&auto=format&fit=crop&q=60",
    checked: false,
    commentCount: 4,
    rating: 3,
    dateString: "9/2/2569",
  },
  {
    materialId: 6,
    materialName: "ไหมพรม",
    category: "ผ้า / เส้นใย",
    materialImageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&auto=format&fit=crop&q=60",
    checked: false,
    commentCount: 2,
    rating: 2,
    dateString: "7/2/2569",
  },
];

const CATEGORIES = [
  "พลาสติก",
  "ไม้",
  "โลหะ",
  "ผ้า / เส้นใย",
  "แก้ว",
  "กระดาษ",
  "อื่นๆ"
];

// Fallback images based on category to make new materials look nice
const CATEGORY_IMAGES: Record<string, string> = {
  "พลาสติก": "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&auto=format&fit=crop&q=60",
  "ไม้": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=300&auto=format&fit=crop&q=60",
  "โลหะ": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&auto=format&fit=crop&q=60",
  "ผ้า / เส้นใย": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=60",
  "แก้ว": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=300&auto=format&fit=crop&q=60",
  "กระดาษ": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&auto=format&fit=crop&q=60",
  "อื่นๆ": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&auto=format&fit=crop&q=60",
};

export default function MaterialsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 font-bold text-zinc-400">กำลังโหลด...</div>}>
      <MaterialsPageContent />
    </Suspense>
  );
}

function MaterialsPageContent() {
  const { currentMember, inventions } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [dbCategories, setDbCategories] = useState<{ materialTypeIid: number; materialTypeName: string; }[]>([]);
  const [filterOnlyChecked, setFilterOnlyChecked] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("พลาสติก");
  const [formImage, setFormImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageCleared, setIsImageCleared] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);

  const getImageUrl = (url: string, category: string) => {
    if (!url || url === "M1.jpg") {
      return CATEGORY_IMAGES[category] || CATEGORY_IMAGES["อื่นๆ"];
    }
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    if (typeof window !== "undefined") {
      return `http://${window.location.hostname}:8080/uploads/${url}`;
    }
    return `http://localhost:8080/uploads/${url}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFormImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Load types and materials from backend
  useEffect(() => {
    const loadData = async () => {
      if (!currentMember) return;
      
      try {
        const types = await getMaterialTypes();
        setDbCategories(types);
      } catch (err) {
        console.error("Failed to load material types", err);
      }

      try {
        const list = await getMaterialsList(currentMember.memberId);
        const savedChecked = localStorage.getItem("diy_materials_checked");
        const checkedIds = savedChecked ? JSON.parse(savedChecked) : [];
        
        const mappedList = list.map((m: any) => ({
          ...m,
          checked: checkedIds.includes(m.materialId)
        }));
        setMaterials(mappedList);
      } catch (err) {
        console.warn("Could not fetch materials from backend, falling back to mock/local storage.", err);
        const saved = localStorage.getItem("diy_materials");
        if (saved) {
          setMaterials(JSON.parse(saved));
        } else {
          setMaterials(SEED_MATERIALS);
          localStorage.setItem("diy_materials", JSON.stringify(SEED_MATERIALS));
        }
      }
    };

    loadData();
  }, [currentMember]);

  // Detect ?add=true param
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      handleOpenAddModal();
      // Remove query param to avoid reopen on refresh
      router.replace("/materials");
    }
  }, [searchParams]);

  const saveToStorage = (updated: MaterialItem[]) => {
    setMaterials(updated);
    const checkedIds = updated.filter(m => m.checked).map(m => m.materialId);
    localStorage.setItem("diy_materials_checked", JSON.stringify(checkedIds));
    localStorage.setItem("diy_recommendation_requested", "false");
  };

  const handleToggleCheck = (id: number) => {
    const updated = materials.map((m) =>
      m.materialId === id ? { ...m, checked: !m.checked } : m
    );
    saveToStorage(updated);
  };

  const handleOpenAddModal = () => {
    setEditingMaterial(null);
    setFormName("");
    setFormCategory("พลาสติก");
    setCustomCategory("");
    setFormImage("");
    setSelectedFile(null);
    setIsImageCleared(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (material: MaterialItem) => {
    setEditingMaterial(material);
    setFormName(material.materialName);
    if (CATEGORIES.includes(material.category)) {
      setFormCategory(material.category);
      setCustomCategory("");
    } else {
      setFormCategory("อื่นๆ");
      setCustomCategory(material.category);
    }
    setFormImage(material.materialImageUrl);
    setSelectedFile(null);
    setIsImageCleared(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setMaterialToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (materialToDelete !== null) {
      try {
        const response = await deleteMaterial(materialToDelete);
        if (response.status === "success") {
          const updated = materials.filter((m) => m.materialId !== materialToDelete);
          setMaterials(updated);
        }
      } catch (err) {
        console.error("Failed to delete material", err);
        alert("ไม่สามารถลบข้อมูลวัสดุได้ค่ะ");
      }
      setIsDeleteModalOpen(false);
      setMaterialToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMaterialToDelete(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !currentMember) return;

    const finalCategory = formCategory === "อื่นๆ" ? (customCategory.trim() || "อื่นๆ") : formCategory;
    const selectedCat = dbCategories.find(c => c.materialTypeName === finalCategory) || dbCategories.find(c => c.materialTypeName === "อื่นๆ");
    const materialTypeIid = selectedCat ? selectedCat.materialTypeIid : 7; // default to 'อื่นๆ'

    const formData = new FormData();
    formData.append("materialName", formName);
    formData.append("materialTypeIid", materialTypeIid.toString());
    
    if (selectedFile) {
      formData.append("materialImage", selectedFile);
    }

    try {
      if (editingMaterial) {
        formData.append("materialId", editingMaterial.materialId.toString());
        formData.append("clearImage", isImageCleared.toString());
        const response = await editMaterial(formData);
        if (response.status === "success") {
          const updatedItem = response.data;
          const updated = materials.map((m) =>
            m.materialId === editingMaterial.materialId ? { ...updatedItem, checked: m.checked } : m
          );
          setMaterials(updated);
        }
      } else {
        formData.append("memberId", currentMember.memberId.toString());
        const response = await addMaterial(formData);
        if (response.status === "success") {
          const newItem = response.data;
          setMaterials([{ ...newItem, checked: true }, ...materials]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save material", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("ไม่สามารถบันทึกข้อมูลวัสดุได้ค่ะ");
      }
    }
  };

  // Mock Recommendation Trigger
  const handleRecommend = () => {
    const checkedNames = materials.filter(m => m.checked).map(m => m.materialName.toLowerCase());
    
    if (checkedNames.length === 0) {
      alert("กรุณาเลือกวัสดุเพื่อนำไปแนะนำก่อนค่ะ");
      return;
    }

    // Set recommendation requested flag in localStorage
    localStorage.setItem("diy_recommendation_requested", "true");

    // Redirect to the recommend page
    router.push("/recommend");
  };

  const displayMaterials = materials.filter((m) => {
    if (filterOnlyChecked) {
      return m.checked;
    }
    return true;
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-amber-400 text-sm" : "text-zinc-200 dark:text-zinc-700 text-sm"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Redirect if not logged in
  if (!currentMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] font-sans gap-4">
        <span className="text-zinc-400 font-bold text-sm">กรุณาเข้าสู่ระบบเพื่อใช้งานหน้าจัดการวัสดุ</span>
        <Link
          href="/login"
          className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-3 rounded-xl transition-all"
        >
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 font-sans relative">

      {/* Main Container Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[32px] p-6 md:p-8 flex flex-col gap-6 shadow-xs">
        {/* Controls Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/50 pb-5">
          {/* Use for Recommendation Filter Option - Instruction Box matching screenshot */}
          <div className="flex items-center">
            <div className="flex items-center gap-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl select-none text-[12px] font-bold text-zinc-700 dark:text-zinc-300 shadow-2xs">
              <span>คลิก</span>
              <div className="w-[17px] h-[17px] rounded-[4px] flex items-center justify-center border bg-[#ff9f1c] border-[#ff9f1c]">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>เลือกวัสดุเพื่อใช้แนะนำ</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>+</span>
              <span>เพิ่มวัสดุ</span>
            </button>

            <button
              onClick={handleRecommend}
              className="bg-[#ff9f1c] hover:bg-[#e67e22] text-white text-xs font-black px-6 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer"
            >
              แนะนำสิ่งประดิษฐ์
            </button>
          </div>
        </div>

        {/* Materials Grid list (3 columns like mockup) */}
        {materials.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 font-bold text-sm">
            ไม่มีข้อมูลวัสดุ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((mat) => (
              <div
                key={mat.materialId}
                className={`bg-white dark:bg-zinc-900 border rounded-[24px] p-6 flex flex-col gap-4 shadow-xs relative hover:shadow-sm transition-all duration-200 group min-h-[200px] ${
                  mat.checked
                    ? "border-[#ff9f1c] ring-1 ring-[#ff9f1c]/10"
                    : "border-zinc-150 dark:border-zinc-800"
                }`}
              >
                {/* Top Section: Checkbox and Title */}
                <div className="flex items-start gap-2.5">
                  <label className="cursor-pointer select-none mt-0.5">
                    <input
                      type="checkbox"
                      checked={mat.checked}
                      onChange={() => handleToggleCheck(mat.materialId)}
                      className="sr-only"
                    />
                    <div
                      className={`w-[17px] h-[17px] rounded-[4px] flex items-center justify-center border transition-all ${
                        mat.checked
                          ? "bg-[#ff9f1c] border-[#ff9f1c]"
                          : "border-zinc-300 bg-white dark:bg-zinc-700"
                      }`}
                    >
                      {mat.checked && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                  
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-tight">
                      {mat.materialName}
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-bold mt-1">
                      ประเภท: {mat.category}
                    </span>
                  </div>
                </div>

                {/* Body section: image on left, actions on right aligned to bottom */}
                <div className="flex items-end justify-between mt-1">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-855 flex items-center justify-center shrink-0">
                    {!mat.materialImageUrl || mat.materialImageUrl === "M1.jpg" ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-10 h-10 text-zinc-350 dark:text-zinc-650"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.9 2.9m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    ) : (
                      <img
                        src={getImageUrl(mat.materialImageUrl, mat.category)}
                        alt={mat.materialName}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-350"
                      />
                    )}
                  </div>
                  
                  {/* Action Buttons Overlay - Always visible at bottom right */}
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold select-none pb-1">
                    <button
                      onClick={() => handleOpenEditModal(mat)}
                      className="hover:text-amber-500 transition-all flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>✏️</span> <span>แก้ไข</span>
                    </button>
                    <span className="text-zinc-200 dark:text-zinc-700">|</span>
                    <button
                      onClick={() => handleDeleteClick(mat.materialId)}
                      className="hover:text-red-500 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pop-up Add/Edit Modal overlay matching mockup EXACTLY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] w-full max-w-md p-7 md:p-8 flex flex-col gap-5 shadow-2xl relative border border-zinc-100 dark:border-zinc-800 animate-scale-up">
            {/* Close cross top-right */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all font-black text-base cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Heading */}
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-wide border-b border-zinc-100 dark:border-zinc-800 pb-3">
              {editingMaterial ? "แก้ไขข้อมูลวัสดุ" : "เพิ่มวัสดุ"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Material Name input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-zinc-700 dark:text-zinc-300">
                  ชื่อวัสดุ
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ชื่อวัสดุ"
                  className="bg-[#f2f2f2] dark:bg-zinc-800 border-none text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12]"
                  required
                />
              </div>

              {/* Material Category selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-zinc-700 dark:text-zinc-300">
                  ประเภท
                </label>
                <div className="relative">
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#f2f2f2] dark:bg-zinc-800 border-none text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12] appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* Custom Category Input if "อื่นๆ" is selected */}
              {formCategory === "อื่นๆ" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-zinc-700 dark:text-zinc-300">
                    ระบุประเภทอื่นๆ
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="กรอกประเภทวัสดุของคุณ"
                    className="bg-[#f2f2f2] dark:bg-zinc-800 border-none text-zinc-800 dark:text-zinc-200 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12]"
                    required
                  />
                </div>
              )}

              {/* Upload image box */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-zinc-700 dark:text-zinc-300">
                  รูปภาพ
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="material-image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("material-image-upload")?.click()}
                    className="flex items-center justify-center gap-2 bg-[#f2f2f2] hover:bg-[#eaeaea] dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-500 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700 px-4 py-3.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-2xs"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>อัปโหลดรูปภาพ</span>
                  </button>
                  {formImage && formImage !== "M1.jpg" ? (
                    <div className="relative w-12 h-12 shrink-0">
                      <div className="w-full h-full rounded-lg overflow-hidden border border-zinc-200">
                        <img src={getImageUrl(formImage, formCategory)} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormImage("");
                          setSelectedFile(null);
                          setIsImageCleared(true);
                          const fileInput = document.getElementById("material-image-upload") as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-md cursor-pointer transition-all border border-white select-none"
                        title="ลบรูปภาพ"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-6 h-6 text-zinc-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.9 2.9m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Save button bottom right */}
              <button
                type="submit"
                className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-black px-7 py-3 rounded-xl transition-all shadow-md mt-3 self-end cursor-pointer"
              >
                บันทึก
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pop-up Delete Confirmation Modal overlay matching mockup EXACTLY */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-55 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] w-full max-w-[280px] p-5 flex flex-col gap-6 shadow-2xl relative border border-zinc-100 dark:border-zinc-800 animate-scale-up">
            {/* Close cross top-right */}
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all font-black text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Heading */}
            <div className="text-center pb-2 border-b border-zinc-150 dark:border-zinc-800 mt-2">
              <h2 className="text-sm font-black text-zinc-900 dark:text-white tracking-wide">
                ยืนยันที่จะลบ
              </h2>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="bg-[#b2b2b2] hover:bg-zinc-400 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-[#ff9f1c] hover:bg-[#e67e22] text-white text-xs font-bold px-7 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
