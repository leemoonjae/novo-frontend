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
  };
};

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      setErrorMsg("이름과 휴대폰 번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<RegisterResponse>("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
        }),
      });

      setToken(res.access_token);
      router.push("/mypage");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message ||
          err?.error ||
          "가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 text-white">
      <div className="max-w-4xl w-full grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
        {/* 왼쪽: 소개 */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-100">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            평소에 말 못한 마음을, 남겨둘 수 있습니다.
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            떠난 후에도
            <br />
            전하고 싶은 말이,
            <br />
            <span className="text-emerald-400">
              안전하게 도착하도록
            </span>{" "}
          </h1>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed">
            NOVO는 갑작스러운 사고나 연락 두절 상황에서
            <br />
            미리 남겨 둔 메시지를, 지정인에게 안전하게 전달하는
            <br />
            &apos;마지막 메시지 보관 서비스&apos;입니다.
          </p>
          <ul className="text-xs md:text-sm text-slate-300 space-y-1">
            <li>· 지정인 연락처 등록</li>
            <li>· 남길 메시지 작성 및 저장</li>
            <li>· 생존 확인 실패 시, 카카오 알림으로 메시지 발송 (준비 중)</li>
          </ul>
        </section>

        {/* 오른쪽: 가입 폼 */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-7 text-slate-900">
          <h2 className="text-xl font-semibold mb-1">시작하기</h2>
          <p className="text-xs text-slate-500 mb-4">
            이름과 휴대폰 번호만으로 간단히 등록하실 수 있습니다.
          </p>

          {errorMsg && (
            <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                이름
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                휴대폰 번호
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="01012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                ※ 실제 서비스에서는 본인 인증 / 카카오 알림 발송용으로만 사용될
                예정입니다.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 disabled:hover:bg-emerald-600"
            >
              {loading ? "가입 처리 중입니다..." : "NOVO 시작하기"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
            현재 버전은 테스트 환경입니다. 실제 메시지 발송은 이루어지지
            않으며,
            <br />
            추후 NHN Cloud / 카카오 알림톡 연동 후 정식 오픈될 예정입니다.
          </p>
        </section>
      </div>
    </div>
  );
}
