"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Member {
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Review {
  reviewId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Invention {
  inventionId: number;
  inventionName: string;
  description: string;
  averageRating: number;
  reviewCount: number;
  likeCount: number;
  disLikeCount: number;
  createdAt: string;
  category_id: number;
  inventionImages: string[];
  requiredMaterials: string[];
  member_id?: number;
  descImages?: string[];
  matImages?: string[];
  steps?: {
    id: number;
    title: string;
    image: string;
    images?: string[];
    desc: string;
  }[];
  reviews?: Review[];
}

export interface Favorite {
  favoriteId: number;
  member_id: number;
  invention_id: number;
}

interface AppContextProps {
  currentMember: Member | null;
  login: (member: Member) => void;
  logout: () => void;
  register: (data: Omit<Member, "memberId" | "profileImageUrl"> & { password: string }) => { success: boolean; message: string };
  categories: Category[];
  addCategory: (categoryName: string) => number;
  inventions: Invention[];
  addInvention: (
    name: string,
    description: string,
    categoryId: number,
    requiredMaterials: string[],
    coverImage: string,
    descImages?: string[],
    matImages?: string[],
    steps?: { id: number; title: string; image: string; images?: string[]; desc: string; }[]
  ) => void;
  deleteInvention: (inventionId: number) => void;
  addReview: (inventionId: number, rating: number, comment: string) => void;
  favorites: Favorite[];
  toggleFavorite: (inventionId: number) => void;
  isFavorite: (inventionId: number) => boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const SEED_CATEGORIES: Category[] = [
  { categoryId: 1, categoryName: "งานฝีมือ" },
  { categoryId: 2, categoryName: "อิเล็กทรอนิกส์ / วงจร" },
  { categoryId: 3, categoryName: "ของใช้ในบ้าน" },
  { categoryId: 4, categoryName: "สวน/กลางแจ้ง" },
  { categoryId: 5, categoryName: "อื่นๆ" },
  { categoryId: 6, categoryName: "ครัว/อาหาร" },
  { categoryId: 7, categoryName: "การเรียนรู้/โครงงาน" }
];

const SEED_INVENTIONS: Invention[] = [
  {
    inventionId: 1,
    inventionName: "LED Lamp",
    description: "โคมไฟ LED ดีไซน์มินิมอลจากขวดโหลแก้วเหลือใช้ ทนทาน และประหยัดพลังงาน เหมาะสำหรับตั้งโต๊ะทำงาน",
    averageRating: 4.0,
    reviewCount: 2,
    likeCount: 23,
    disLikeCount: 1,
    createdAt: "2026-02-12T00:00:00Z",
    category_id: 2,
    inventionImages: [
      "/images/led_lamp_cover.png",
      "/images/led_lamp_cover_on.png"
    ],
    requiredMaterials: ["3v baterry", "LED", "Electrical tape", "Part of CLIPS"],
    descImages: [
      "/images/led_lamp_cover.png",
      "/images/led_lamp_cover_on.png"
    ],
    matImages: [
      "/images/led_lamp_materials.png"
    ],
    steps: [
      {
        id: 1,
        title: "สิ่งที่ต้องเตรียม:",
        image: "/images/led_lamp_materials.png",
        desc: "สิ่งที่ต้องเตรียม:\n1- 3v baterry\n2- LED\n3- Electrical tape\n4- Part of CLIPS"
      },
      {
        id: 2,
        title: "วิธีทำ",
        image: "/images/led_lamp_assembly_2.png",
        images: [
          "/images/led_lamp_assembly_1.png",
          "/images/led_lamp_assembly_2.png",
          "/images/led_lamp_switch_assembly.png"
        ],
        desc: "ขั้นแรกให้วางส่วนที่ต่ำกว่าของ LED ไว้ที่ด้านลบของแบตเตอรี่ แล้วพันเทปพันสายไฟตามภาพประกอบ ส่วนที่สูงจะไม่สัมผัสกับแบตเตอรี่"
      },
      {
        id: 3,
        title: "เสร็จสิ้น",
        image: "/images/led_lamp_cover.png",
        images: [
          "/images/led_lamp_cover.png",
          "/images/led_lamp_cover_on.png"
        ],
        desc: "วางคันโยกตามภาพ แล้วพันเทปพันสายไฟอีกครั้ง เย้!!! เสร็จแล้ว ทีนี้เลื่อนคันโยกมาด้านหน้าเพื่อใช้งาน คันโยกที่สัมผัสกับแบตเตอรี่จะส่งพลังงานไปยัง LED และทำให้ระบบสมบูรณ์ เสร็จแล้ว"
      },
      {
        id: 4,
        title: "การปรับแต่งโดยใช้โคมไฟ",
        image: "/images/led_lamp_jar.png",
        desc: "เพื่อทำโคมไฟตั้งโต๊ะ"
      },
      {
        id: 5,
        title: "เพิ่มเติม",
        image: "/images/led_lamp_lid_switch.png",
        images: [
          "/images/led_lamp_jar.png",
          "/images/led_lamp_tape_roll.png",
          "/images/led_lamp_lid_switch.png"
        ],
        desc: "ใช้เทปกาวสองหน้าติดแบตเตอรี่เข้ากับฝาครอบ อ้อ อย่าลืมเจาะรูที่ฝาครอบด้วยนะ!!! แค่นั้นเอง ตัวงัดต้องอยู่ในรูนั้น"
      }
    ],
    reviews: [
      {
        reviewId: 1,
        reviewerName: "claudiof2",
        rating: 3,
        comment: "หน้าที่ของคานงัดคืออะไร? เพื่อเพิ่มพลังงาน? ทำไม... ขอบคุณครับ",
        createdAt: "2026-02-12T10:00:00Z"
      },
      {
        reviewId: 2,
        reviewerName: "Somchai Jaidee",
        rating: 5,
        comment: "เยี่ยมเลย! (คำแนะนำดีมาก!)",
        createdAt: "2026-02-12T11:00:00Z"
      }
    ]
  },
  {
    inventionId: 2,
    inventionName: "เครื่องบินฝึก",
    description: "โมเดลเครื่องบินฝึกทักษะทำจากขวดพลาสติกและกระดาษลังเก่า ช่วยพัฒนาความรู้ด้านการบินเบื้องต้น",
    averageRating: 3.0,
    reviewCount: 10,
    likeCount: 15,
    disLikeCount: 0,
    createdAt: "2026-02-10T00:00:00Z",
    category_id: 1,
    inventionImages: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    ],
    requiredMaterials: ["ขวดพลาสติก 1.5 L", "กระดาษลัง"],
  },
  {
    inventionId: 3,
    inventionName: "คุกกี้และทรัฟเฟิลจากคุกกี้ที่เหลือ",
    description: "นำคุกกี้ก้นถุงที่แตกหักและคุกกี้เหลือใช้มารังสรรค์เป็นทรัฟเฟิลช็อกโกแลตแสนอร่อย",
    averageRating: 3.0,
    reviewCount: 5,
    likeCount: 8,
    disLikeCount: 0,
    createdAt: "2026-02-10T00:00:00Z",
    category_id: 6,
    inventionImages: [
      "https://images.unsplash.com/photo-1548907040-4d42b52145ca?w=600&auto=format&fit=crop&q=60",
    ],
    requiredMaterials: ["คุกกี้"],
  },
  {
    inventionId: 4,
    inventionName: "งานศิลปะผนังเรขาคณิตแบบชิ้น",
    description: "สร้างสรรค์งานประดับตกแต่งผนังลวดลายเรขาคณิตสามมิติจากชิ้นไม้หรือกระดาษลังเก่า",
    averageRating: 3.0,
    reviewCount: 8,
    likeCount: 12,
    disLikeCount: 1,
    createdAt: "2026-02-08T00:00:00Z",
    category_id: 3,
    inventionImages: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=60",
    ],
    requiredMaterials: ["กระดาษลัง"],
  },
  {
    inventionId: 5,
    inventionName: "เครื่องให้น้ำจากฝาขวด สำหรับนก",
    description: "เครื่องจ่ายน้ำขนาดเล็กจากขวดน้ำพลาสติกและฝาขวด ป้องกันฝุ่นละอองและดูแลนกในสวนของคุณ",
    averageRating: 2.0,
    reviewCount: 2,
    likeCount: 3,
    disLikeCount: 1,
    createdAt: "2026-02-07T00:00:00Z",
    category_id: 4,
    inventionImages: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=60",
    ],
    requiredMaterials: ["ขวดพลาสติก 1.5 L"],
  },
  {
    inventionId: 6,
    inventionName: "Luna - the Live Moon Phase Display",
    description: "เครื่องแสดงข้างขึ้นข้างแรมจำลองตามเวลาจริง ตกแต่งด้วยไม้ไอติมและไฟ LED สวยงาม",
    averageRating: 2.0,
    reviewCount: 2,
    likeCount: 6,
    disLikeCount: 0,
    createdAt: "2026-02-07T00:00:00Z",
    category_id: 7,
    inventionImages: [
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=60",
    ],
    requiredMaterials: ["ไม้ไอติม", "ไฟ LED"],
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [inventions, setInventions] = useState<Invention[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const localMember = localStorage.getItem("diy_current_member");
    if (localMember) setCurrentMember(JSON.parse(localMember));

    const localFavs = localStorage.getItem("diy_favorites");
    if (localFavs) setFavorites(JSON.parse(localFavs));

    const loadData = async () => {
      let backendCatsLoaded = false;
      let backendInvsLoaded = false;

      try {
        const catResponse = await fetch("http://localhost:8080/api/categories");
        if (catResponse.ok) {
          const catsData = await catResponse.json();
          const catsArray = Array.isArray(catsData) ? catsData : catsData.data;
          if (Array.isArray(catsArray) && catsArray.length > 0) {
            setCategories(catsArray);
            backendCatsLoaded = true;
          }
        }
      } catch (err) {
        console.warn("Could not load categories from backend, falling back to mock/local storage.", err);
      }

      try {
        const invResponse = await fetch("http://localhost:8080/api/inventions");
        if (invResponse.ok) {
          const invsData = await invResponse.json();
          const invsArray = Array.isArray(invsData) ? invsData : invsData.data;
          if (Array.isArray(invsArray) && invsArray.length > 0) {
            setInventions(invsArray);
            backendInvsLoaded = true;
          }
        }
      } catch (err) {
        console.warn("Could not load inventions from backend, falling back to mock/local storage.", err);
      }

      if (!backendCatsLoaded) {
        const localCats = localStorage.getItem("diy_categories");
        if (localCats) {
          setCategories(JSON.parse(localCats));
        } else {
          setCategories(SEED_CATEGORIES);
          localStorage.setItem("diy_categories", JSON.stringify(SEED_CATEGORIES));
        }
      }

      if (!backendInvsLoaded) {
        const localInventions = localStorage.getItem("diy_inventions");
        if (localInventions) {
          const parsed = JSON.parse(localInventions);
          const ledLamp = parsed.find((i: any) => i.inventionId === 1);
          if (ledLamp && (!ledLamp.steps || !ledLamp.reviews || ledLamp.steps.length < 5)) {
            setInventions(SEED_INVENTIONS);
            localStorage.setItem("diy_inventions", JSON.stringify(SEED_INVENTIONS));
          } else {
            setInventions(parsed);
          }
        } else {
          setInventions(SEED_INVENTIONS);
          localStorage.setItem("diy_inventions", JSON.stringify(SEED_INVENTIONS));
        }
      }
    };

    loadData();
  }, []);

  const login = (member: Member) => {
    setCurrentMember(member);
    localStorage.setItem("diy_current_member", JSON.stringify(member));
  };

  const logout = () => {
    setCurrentMember(null);
    localStorage.removeItem("diy_current_member");
  };

  const register = (data: Omit<Member, "memberId" | "profileImageUrl"> & { password: string }) => {
    const { email, firstName, lastName, password } = data;

    if (!email.trim() || !firstName.trim() || !lastName.trim() || !password.trim()) {
      return { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }

    if (!email.endsWith("@gmail.com")) {
      return { success: false, message: "อีเมลต้องถูกต้องตามรูปแบบ username@gmail.com" };
    }

    const validName = (name: string) => {
      if (name.length < 3 || name.length > 255) return false;
      return /^[a-zA-Zก-๙\s]+$/.test(name);
    };

    if (!validName(firstName)) {
      return { success: false, message: "ชื่อจริงต้องเป็นตัวอักษรเท่านั้น ความยาว 3-255 ตัวอักษร" };
    }
    if (!validName(lastName)) {
      return { success: false, message: "นามสกุลต้องเป็นตัวอักษรเท่านั้น ความยาว 3-255 ตัวอักษร" };
    }

    if (password.length < 8 || password.length > 30) {
      return { success: false, message: "รหัสผ่านต้องมีความยาว 8 ถึง 30 ตัวอักษร" };
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasLetter || !hasNumber || !hasSpecial) {
      return { success: false, message: "รหัสผ่านต้องประกอบด้วยภาษาอังกฤษ ตัวเลข และอักขระพิเศษอย่างน้อยอย่างละ 1 ตัว" };
    }

    const member: Member = {
      memberId: Date.now(),
      email,
      firstName,
      lastName,
      profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
    };

    setCurrentMember(member);
    localStorage.setItem("diy_current_member", JSON.stringify(member));

    return { success: true, message: "สมัครสมาชิกสำเร็จ" };
  };

  const toggleFavorite = (inventionId: number) => {
    if (!currentMember) return;
    const existingIndex = favorites.findIndex((f) => f.invention_id === inventionId && f.member_id === currentMember.memberId);
    let updated: Favorite[];
    if (existingIndex > -1) {
      updated = favorites.filter((_, idx) => idx !== existingIndex);
    } else {
      const newFav: Favorite = {
        favoriteId: Date.now(),
        member_id: currentMember.memberId,
        invention_id: inventionId,
      };
      updated = [...favorites, newFav];
    }
    setFavorites(updated);
    localStorage.setItem("diy_favorites", JSON.stringify(updated));
  };

  const isFavorite = (inventionId: number) => {
    if (!currentMember) return false;
    return favorites.some((f) => f.invention_id === inventionId && f.member_id === currentMember.memberId);
  };

  const addCategory = (categoryName: string): number => {
    const existing = categories.find((c) => c.categoryName.trim().toLowerCase() === categoryName.trim().toLowerCase());
    if (existing) return existing.categoryId;

    const newId = Date.now();
    const othersCat = categories.find(c => c.categoryName === "อื่นๆ");
    const filteredCats = categories.filter(c => c.categoryName !== "อื่นๆ");
    
    const newCat = { categoryId: newId, categoryName: categoryName.trim() };
    const updated = othersCat ? [...filteredCats, newCat, othersCat] : [...categories, newCat];
    
    setCategories(updated);
    localStorage.setItem("diy_categories", JSON.stringify(updated));
    return newId;
  };

  const addInvention = (
    name: string,
    description: string,
    categoryId: number,
    requiredMaterials: string[],
    coverImage: string,
    descImages?: string[],
    matImages?: string[],
    steps?: { id: number; title: string; image: string; images?: string[]; desc: string; }[]
  ) => {
    if (!currentMember) return;
    const newInv: Invention = {
      inventionId: Date.now(),
      inventionName: name,
      description,
      averageRating: 0,
      reviewCount: 0,
      likeCount: 0,
      disLikeCount: 0,
      createdAt: new Date().toISOString(),
      category_id: categoryId,
      inventionImages: [coverImage || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=60"],
      requiredMaterials,
      member_id: currentMember.memberId,
      descImages,
      matImages,
      steps,
    };
    const updated = [newInv, ...inventions];
    setInventions(updated);
    localStorage.setItem("diy_inventions", JSON.stringify(updated));
  };

  const deleteInvention = (inventionId: number) => {
    const updated = inventions.filter((inv) => inv.inventionId !== inventionId);
    setInventions(updated);
    localStorage.setItem("diy_inventions", JSON.stringify(updated));
  };

  const addReview = (inventionId: number, rating: number, comment: string) => {
    const reviewerName = currentMember 
      ? `${currentMember.firstName} ${currentMember.lastName}` 
      : "ผู้ใช้ทั่วไป";

    const newReview: Review = {
      reviewId: Date.now(),
      reviewerName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    const updated = inventions.map((inv) => {
      if (inv.inventionId === inventionId) {
        const reviews = inv.reviews ? [...inv.reviews, newReview] : [newReview];
        const newCount = reviews.length;
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvg = parseFloat((totalRating / newCount).toFixed(1));
        return {
          ...inv,
          reviews,
          reviewCount: newCount,
          averageRating: newAvg,
        };
      }
      return inv;
    });

    setInventions(updated);
    localStorage.setItem("diy_inventions", JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        currentMember,
        login,
        logout,
        register,
        categories,
        addCategory,
        inventions,
        addInvention,
        deleteInvention,
        addReview,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
