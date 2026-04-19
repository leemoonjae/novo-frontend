"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, setToken } from "@/lib/api";

type LoginResponse = {
  ok: boolean;
  access_token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await apiFetch<LoginResponse>("/api/login", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          birth_date: birthDate.trim(),
          phone: phone.trim(),
          password: password.trim(),
        }),
      });
      setToken(res.access_token);
      router.push("/mypage");
    } catch (err: any) {
      setErrorMsg(err?.message || err?.error || "로그인 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 text-white">
      <div className="w-full max-w-md rounded-2xl bg-white text-slate-900 p-6 shadow-lg">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="mt-2 text-sm text-slate-500">회원가입 시 입력한 정보로 로그인해 주세요.</p>
        {errorMsg && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{errorMsg}</div>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="이름" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="생년월일 19900101" value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="연락처 01012345678" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <input type="password" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="비밀번호" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">{loading ? "로그인 중..." : "로그인"}</button>
        </form>
        <div className="mt-4 text-sm text-slate-500">아직 회원이 아니라면 <Link href="/signup" className="text-emerald-600 underline">회원가입</Link></div>
      </div>
    </div>
  );
}
