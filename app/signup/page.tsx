"use client";

import { FormEvent, useState } from "react";
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
    signup_method: "phone" | "email";
  };
};

export default function SignupPage() {
  const router = useRouter();
  const [signupMethod, setSignupMethod] = useState<"phone" | "email">("phone");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !birthDate.trim()) {
      setErrorMsg("이름과 생년월일을 입력해 주세요.");
      return;
    }

    if (signupMethod === "phone" && !phone.trim()) {
      setErrorMsg("휴대폰 기반 가입을 선택한 경우 연락처를 입력해 주세요.");
      return;
    }

    if (signupMethod === "email" && !email.trim()) {
      setErrorMsg("이메일 기반 가입을 선택한 경우 이메일을 입력해 주세요.");
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
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            오늘 적어 둔 한 문장이, 가장 필요한 순간에 도착하도록
          </div>
          <h1 className="text-3xl font-bold leading-snug md:text-5xl">
            갑작스러운 내일을 대비해,
            <br />
            지금의 마음을
            <span className="text-emerald-400"> 안전하게 남겨 둬.</span>
          </h1>
          <p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            NOVO는 생존 확인에 응답하지 못한 상황이 이어질 때,
            미리 남겨 둔 메시지를 지정인에게 전달할 수 있도록 준비하는 서비스야.
            본문은 텍스트로 작성되고, 저장된 메시지는 암호화된 상태로 보관돼.
          </p>
          <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 font-semibold">가입 정보</div>
              <ul className="space-y-1 text-slate-300">
                <li>· 이름</li>
                <li>· 생년월일</li>
                <li>· 연락처</li>
                <li>· 휴대폰 또는 이메일 기반 가입</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 font-semibold">생존 확인 기본 흐름</div>
              <ul className="space-y-1 text-slate-300">
                <li>· 월 1회 생존 확인</li>
                <li>· 미응답 시 24시간 후 재전송</li>
                <li>· 총 2회 재전송 후 지정인 전달</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-white p-6 text-slate-900 shadow-2xl">
          <h2 className="text-2xl font-semibold">NOVO 시작하기</h2>
          <p className="mt-1 text-xs text-slate-500">
            휴대폰 또는 이메일 기반으로 시작할 수 있어. 실제 본인 확인 연동은 다음 단계에서 붙이면 돼.
          </p>

          {errorMsg && <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 text-sm">
              <button type="button" onClick={() => setSignupMethod("phone")} className={`rounded-xl px-3 py-2 ${signupMethod === "phone" ? "bg-white shadow" : "text-slate-500"}`}>휴대폰 가입</button>
              <button type="button" onClick={() => setSignupMethod("email")} className={`rounded-xl px-3 py-2 ${signupMethod === "email" ? "bg-white shadow" : "text-slate-500"}`}>이메일 가입</button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">이름</label>
              <input className="w-full rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">생년월일</label>
              <input className="w-full rounded-xl border px-3 py-2" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="1990-01-01" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">연락처</label>
              <input className="w-full rounded-xl border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01012345678" />
            </div>

            {signupMethod === "email" && (
              <div>
                <label className="mb-1 block text-xs font-medium">이메일</label>
                <input className="w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="novo@example.com" />
              </div>
            )}

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-6 text-emerald-800">
              저장되는 메시지는 암호화된 형태로 보관되며, 열람 링크와 지정인 비밀번호가 함께 맞아야만 확인할 수 있게 설계했어.
            </div>

            <button disabled={loading} className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? "가입 처리 중..." : "다음 단계로 이동"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
