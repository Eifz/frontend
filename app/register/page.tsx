"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { registerApi } from "../../service/api";

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const result = await registerApi({ email, firstName, lastName, password });

      if (result.status === "success") {
        setSuccess(result.message || "สมัครสมาชิกสำเร็จ");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(result.message || "สมัครสมาชิกไม่สำเร็จ");
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.errors && Object.keys(errorData.errors).length > 0) {
          const firstError = Object.values(errorData.errors)[0] as string;
          setError(firstError);
        } else {
          setError(errorData.message || "สมัครสมาชิกไม่สำเร็จ");
        }
      } else {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] py-8 font-sans">
      {/* Dark Grey Outer Card matching Mockup EXACTLY */}
      <div className="w-full max-w-xl bg-[#4c4c4c] rounded-[36px] p-8 md:p-10 shadow-2xl flex flex-col items-center gap-6 border border-[#5a5a5a]">
        {/* Brand logo at the top */}
        <img
          src="/logo.png"
          alt="DIY Invention Recommendation"
          className="h-16 w-auto object-contain brightness-100 invert-0 select-none"
        />

        {/* Title */}
        <h2 className="text-2xl font-black text-white tracking-wide -mt-2">
          สมัครสมาชิก
        </h2>

        {/* White Inner Card Containing the Form */}
        <div className="w-full bg-white rounded-[28px] p-6 md:p-8 flex flex-col gap-5 shadow-inner">
          {error && (
            <div className="bg-red-50 text-red-650 text-xs font-bold p-3.5 rounded-xl border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-650 text-xs font-bold p-3.5 rounded-xl border border-green-100">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-0.5">
                อีเมล {!email && <span className="text-red-500 font-extrabold">*</span>}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมล"
                className="bg-[#f2f2f2] border-none text-zinc-800 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12]"
                required
              />
            </div>

            {/* Names Input Grid (Firstname & Lastname) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-0.5">
                  ชื่อ {!firstName && <span className="text-red-500 font-extrabold">*</span>}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="กรอกชื่อ"
                  className="bg-[#f2f2f2] border-none text-zinc-800 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-0.5">
                  นามสกุล {!lastName && <span className="text-red-500 font-extrabold">*</span>}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="กรอกนามสกุล"
                  className="bg-[#f2f2f2] border-none text-zinc-800 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12]"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-0.5">
                รหัสผ่าน {!password && <span className="text-red-500 font-extrabold">*</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                className="bg-[#f2f2f2] border-none text-zinc-800 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12]"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-0.5">
                ยืนยันรหัสผ่าน {!confirmPassword && <span className="text-red-500 font-extrabold">*</span>}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่าน"
                className="bg-[#f2f2f2] border-none text-zinc-800 rounded-xl px-4 py-3 text-xs placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#f39c12]"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-sm font-black py-4 rounded-xl transition-all shadow-md shadow-[#f39c12]/20 mt-2 cursor-pointer"
            >
              สมัครสมาชิก
            </button>
          </form>

          {/* Already have an account link inside the white card */}
          <div className="text-center text-xs font-bold text-zinc-450 mt-1">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-zinc-400 dark:text-zinc-550 hover:underline border-b border-zinc-400">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
