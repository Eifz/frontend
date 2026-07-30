"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { loginApi } from "../../service/api";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("อีเมลต้องถูกต้องตามรูปแบบ username@gmail.com");
      return;
    }

    if (password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      const result = await loginApi(email, password);

      if (result.status === "success") {
        setSuccess("เข้าสู่ระบบสำเร็จ");
        let memberData = result.data;
        if (memberData && memberData.profileImageUrl && !memberData.profileImageUrl.startsWith("http")) {
          const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
          memberData = {
            ...memberData,
            profileImageUrl: `http://${hostname}:8080/images/${memberData.profileImageUrl}`
          };
        }
        login(memberData);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(result.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.errors && Object.keys(errorData.errors).length > 0) {
          const firstError = Object.values(errorData.errors)[0] as string;
          setError(firstError);
        } else {
          setError(errorData.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
      } else {
        console.warn("Backend server not available, logging in using mock data.", err);
        // Fallback: local mock login
        const mockMember = {
          memberId: 1,
          email,
          firstName: "Somchai",
          lastName: "Jaidee",
          profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
        };
        login(mockMember);
        setSuccess("เข้าสู่ระบบสำเร็จ (โหมดตัวอย่าง)");
        setTimeout(() => {
          router.push("/");
        }, 1000);
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
          เข้าสู่ระบบ
        </h2>

        {/* White Inner Card Containing the Form */}
        <div className="w-full bg-white rounded-[28px] p-6 md:p-8 flex flex-col gap-5 shadow-inner">
          {error && (
            <div className="bg-red-50 text-red-650 text-xs font-bold p-3.5 rounded-xl border border-red-100 animate-pulse">
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

            {/* Remember password custom checkbox */}
            <div className="flex items-center mt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-[11.5px] font-extrabold text-[#7a7a7a]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-[17px] h-[17px] rounded-[4px] flex items-center justify-center border transition-all ${
                    rememberMe
                      ? "bg-[#ff9f1c] border-[#ff9f1c]"
                      : "border-zinc-300 bg-white"
                  }`}
                >
                  {rememberMe && (
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
                <span>จดจำรหัสผ่าน</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-sm font-black py-4 rounded-xl transition-all shadow-md shadow-[#f39c12]/20 mt-2 cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {/* Registration link inside the white card */}
          <div className="text-center text-xs font-bold text-zinc-400 mt-1">
            ยังไม่มีบัญชี{" "}
            <Link
              href="/register"
              className="text-[#a0a0a0] hover:text-zinc-650 underline cursor-pointer"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
