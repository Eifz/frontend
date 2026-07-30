"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { currentMember, login, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  // Normalize pathname to remove trailing slash for routing comparison (except root)
  const cleanPathname = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const getHeaderConfig = () => {
    switch (cleanPathname) {
      case "/":
        return {
          title: "DIY Invention Recommendation",
          subtitle: "",
          showAddButton: true,
        };
      case "/recommend":
        return {
          title: "แนะนำสิ่งประดิษฐ์จากวัสดุที่มี",
          subtitle: "พบสิ่งประดิษฐ์ที่คุณสามารถทำได้ จากรายการวัสดุที่คุณมีอยู่",
          showAddButton: true,
        };
      case "/my-inventions":
        return {
          title: "สิ่งประดิษฐ์ของฉัน",
          subtitle: "รายการสิ่งประดิษฐ์ที่คุณเพิ่มและสร้างขึ้นเองในระบบ",
          showAddButton: true,
        };
      case "/favorites":
        return {
          title: "รายการโปรด",
          subtitle: "สิ่งประดิษฐ์ที่คุณชื่นชอบและบันทึกไว้ใช้งาน",
          showAddButton: true,
        };
      case "/materials":
        return {
          title: "วัสดุของฉัน",
          subtitle: "จัดการวัสดุที่คุณมี เพื่อรับคำแนะนำสิ่งประดิษฐ์ที่เหมาะสม",
          showAddButton: true,
        };
      default:
        return null;
    }
  };

  const config = getHeaderConfig();

  return (
    <div className="h-screen flex overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar - Matching Screenshot EXACTLY - Docked to left, top, and bottom, rounded on the right */}
      <aside className="w-72 bg-[#333333] text-zinc-155 flex flex-col justify-between shrink-0 rounded-r-[36px] border-r border-[#424242] font-sans overflow-hidden shadow-lg">
        <div>
          {/* Logo container with larger padding and image */}
          <div className="p-8 border-b border-[#424242] flex items-center justify-center">
            <img
              src="/logo.png"
              alt="DIY Invention Recommendation Logo"
              className="w-full h-auto max-h-24 object-contain"
            />
          </div>

          {/* Navigation Section */}
          <div className="px-4 py-4 flex flex-col gap-4">
            {/* Menu Block */}
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] font-black tracking-widest text-[#888888] uppercase px-3">
                Menu
              </span>
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    cleanPathname === "/"
                      ? "bg-zinc-700/60 text-white font-extrabold"
                      : "hover:bg-[#424242] text-zinc-300 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span>หน้าแรก</span>
                </Link>

                <Link
                  href="/materials"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    cleanPathname === "/materials"
                      ? "bg-zinc-700/60 text-white font-extrabold"
                      : "hover:bg-[#424242] text-zinc-300 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  <span>วัสดุของฉัน</span>
                </Link>

                <Link
                  href="/recommend"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    cleanPathname === "/recommend"
                      ? "bg-zinc-700/60 text-white font-extrabold"
                      : "hover:bg-[#424242] text-zinc-300 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-8.982M18 13.616L19.813 15.9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>แนะนำ</span>
                </Link>

                <Link
                  href="/favorites"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    cleanPathname === "/favorites"
                      ? "bg-zinc-700/60 text-white font-extrabold"
                      : "hover:bg-[#424242] text-zinc-300 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span>รายการโปรด</span>
                </Link>
              </div>
            </div>

            {/* Projects Section */}
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] font-black tracking-widest text-[#888888] uppercase px-3">
                Projects
              </span>
              <div className="flex flex-col gap-1">
                <Link
                  href="/my-inventions"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    cleanPathname === "/my-inventions"
                      ? "bg-zinc-700/60 text-white font-extrabold"
                      : "hover:bg-[#424242] text-zinc-300 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                  <span>สิ่งประดิษฐ์ของฉัน</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area with Member Profile/Login */}
        <div className="p-4 border-t border-[#424242]">
          {currentMember ? (
            <div className="flex items-center justify-between bg-[#424242] px-4 py-3 rounded-2xl gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="text-xs font-bold text-white tracking-wide">
                  {currentMember.firstName} {currentMember.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-white transition-all cursor-pointer"
                title="ออกจากระบบ"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#424242] hover:bg-[#4d4d4d] text-zinc-300 transition-all cursor-pointer w-full text-left"
            >
              <span>👤</span>
              <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-all font-sans overflow-x-hidden">
        {config && (
          <header className="bg-white dark:bg-zinc-900 px-8 py-5 flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800/80 shrink-0">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                {config.title}
              </h1>
              {config.subtitle && (
                <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 mt-1.5 dark:text-zinc-550">
                  {config.subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {config.showAddButton && currentMember && (
                <button
                  onClick={() => router.push("/my-inventions/add")}
                  className="px-5 py-2.5 text-xs font-black bg-[#f39c12] hover:bg-[#e67e22] text-white rounded-xl transition-all shadow-md shadow-[#f39c12]/20 cursor-pointer flex items-center justify-center shrink-0"
                >
                  + สิ่งประดิษฐ์
                </button>
              )}

              {/* Login controls on the right when logged out */}
              {!currentMember && (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-5 py-2 text-xs font-bold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all cursor-pointer flex items-center justify-center"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-xs font-bold bg-[#f39c12] hover:bg-[#e67e22] text-white rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              )}
            </div>
          </header>
        )}

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
