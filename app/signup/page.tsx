"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, setToken } from "@/lib/api";

type RegisterResponse = {
  ok: boolean;
  access_token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    birth_date: string;
    signup_method: string;
    check_frequency: string;
    check_start_date: string;
    check_time: string;
    next_check_at: string;
  };
};

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [signupMethod, setSignupMethod] = useState<"phone" | "email">("phone");
  const [password, setPassword] = useState("");
  const [checkFrequency, setCheckFrequency] = useState<"biweekly" | "monthly">("monthly");
  const [checkStartDate, setCheckStartDate] = useState("");
  const [checkTime, setCheckTime] = useState("09:00");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !birthDate.trim() || !password.trim()) {
      setErrorMsg("이름, 생년월일, 비밀번호를 입력해 주세요.");
      return;
    }
    if (signupMethod === "phone" && !phone.trim()) {
      setErrorMsg("휴대폰 번호를 입력해 주세요.");
      return;
    }
    if (signupMethod === "email" && !email.trim()) {
      setErrorMsg("이메일을 입력해 주세요.");
      return;
    }
    if (!checkStartDate.trim() || !checkTime.trim()) {
      setErrorMsg("생존확인 시작 날짜와 시간을 선택해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<RegisterResponse>("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          birth_date: birthDate.trim(),
          phone: phone.trim(),
          email: email.trim(),
          signup_method: signupMethod,
          password: password.trim(),
          check_frequency: checkFrequency,
          check_start_date: checkStartDate.trim(),
          check_time: checkTime.trim(),
        }),
      });
      setToken(res.access_token);
      router.push("/mypage");
    } catch (err: any) {
      setErrorMsg(err?.message || err?.error || "가입 처리 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 text-white">
      <div className="max-w-5xl w-full grid gap-8 md:grid-cols-[1.1fr_1fr] items-start">
        <section className="space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-100">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            떠난 뒤에도 닿아야 할 말이 있다면
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            NOVO 회원가입
            <br />
            <span className="text-emerald-400">생존확인 주기까지 한 번에 설정해요</span>
          </h1>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed">
            회원가입 시 본인 확인용 비밀번호를 저장하고,
            <br />
            생존확인 주기와 시작 날짜, 시간을 함께 정할 수 있어요.
          </p>
          <div className="text-sm text-slate-300">
            이미 가입했다면 <Link href="/login" className="text-emerald-300 underline">로그인하기</Link>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-7 text-slate-900">
          <h2 className="text-xl font-semibold mb-1">시작하기</h2>
          <p className="text-xs text-slate-500 mb-4">회원가입 후 바로 마이페이지로 이동해요.</p>

          {errorMsg && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">이름</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">생년월일</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="19900101" value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">가입 방식</label>
              <div className="flex gap-3 text-sm">
                <label className="flex items-center gap-2"><input type="radio" checked={signupMethod==="phone"} onChange={()=>setSignupMethod("phone")} /> 휴대폰</label>
                <label className="flex items-center gap-2"><input type="radio" checked={signupMethod==="email"} onChange={()=>setSignupMethod("email")} /> 이메일</label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">연락처</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="01012345678" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">이메일(선택 또는 이메일 가입 시 필수)</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">로그인 비밀번호</label>
              <input type="password" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
              <div className="text-xs font-semibold text-slate-700 mb-2">생존확인 요청 주기</div>
              <div className="flex gap-3 text-sm mb-3">
                <label className="flex items-center gap-2"><input type="radio" checked={checkFrequency==="biweekly"} onChange={()=>setCheckFrequency("biweekly")} /> 2주에 1번</label>
                <label className="flex items-center gap-2"><input type="radio" checked={checkFrequency==="monthly"} onChange={()=>setCheckFrequency("monthly")} /> 1달에 1번</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">시작 날짜</label>
                  <input type="date" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={checkStartDate} onChange={(e)=>setCheckStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">보낼 시간</label>
                  <input type="time" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={checkTime} onChange={(e)=>setCheckTime(e.target.value)} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-2 w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
              {loading ? "가입 처리 중입니다..." : "NOVO 시작하기"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
