"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getTokenClient, clearToken } from "@/lib/api";

type Faq = { q: string; a: string };

export default function HomePage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getTokenClient();
    setHasToken(!!token);
  }, []);

  const faqs: Faq[] = useMemo(
    () => [
      {
        q: "NOVO는 어떤 서비스야?",
        a: "NOVO는 말하지 못한 마음을 미리 기록하고, 지정인에게 안전하게 전달하는 ‘마지막 메시지 보관 서비스’야.",
      },
      {
        q: "연락처(휴대폰 번호)는 어디에 쓰여?",
        a: "지정인 알림 및 메시지 전달을 위해서만 사용돼. 다른 목적으로는 쓰지 않는 방향으로 설계하고 있어.",
      },
      {
        q: "지금 실제로 메시지 발송이 돼?",
        a: "현재 버전은 테스트 환경이야. 메시지 작성/저장과 관리 기능이 중심이고, 실제 발송(알림톡)은 정식 연동 단계에서 제공될 예정이야.",
      },
      {
        q: "메시지는 나중에 수정할 수 있어?",
        a: "응. 마이페이지에서 언제든 수정/삭제할 수 있어.",
      },
    ],
    []
  );

  const primaryCta = () => router.push("/signup");
  const secondaryCta = () => router.push("#how");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 배경 포인트 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-64 left-1/3 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* 상단바 */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <button
            className="flex items-center gap-2"
            onClick={() => router.push("/")}
            aria-label="NOVO Home"
          >
            <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
              N
            </div>
            <div className="leading-tight text-left">
              <div className="text-sm font-semibold tracking-tight">NOVO</div>
              <div className="text-[11px] text-slate-300">
                nova + note · 새로운 시작을 위한 기록
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            <a className="hover:text-white" href="#how">
              작동 방식
            </a>
            <a className="hover:text-white" href="#why">
              왜 NOVO
            </a>
            <a className="hover:text-white" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {hasToken ? (
              <>
                <button
                  className="hidden sm:inline-flex px-3 py-2 rounded-md bg-white/10 hover:bg-white/15 text-sm"
                  onClick={() => router.push("/mypage")}
                >
                  마이페이지
                </button>
                <button
                  className="hidden sm:inline-flex px-3 py-2 rounded-md text-sm text-slate-200 hover:text-white underline"
                  onClick={() => {
                    clearToken();
                    setHasToken(false);
                    router.push("/signup");
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/15 text-sm"
                onClick={() => router.push("/signup")}
              >
                시작하기
              </button>
            )}

            <button
              className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold"
              onClick={() => (hasToken ? router.push("/mypage") : router.push("/signup"))}
            >
              {hasToken ? "지금 관리하기" : "NOVO 시작하기"}
            </button>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-4 pt-12 pb-10 md:pt-16">
          <div className="grid gap-8 md:grid-cols-[1.25fr_0.9fr] items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1 text-xs text-slate-100 border border-slate-700/60">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                말하지 못한 마음은, 사라지지 않습니다
              </div>

              <h1 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight">
                만약 오늘이 마지막이라면,
                <br />
                <span className="text-emerald-400">
                  누구에게 어떤 말을 남기고 싶으신가요?
                </span>
              </h1>

              <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                NOVO는 말하지 못한 마음을 미리 기록하고, 안전하게 전달합니다.
                <br className="hidden sm:block" />
                <span className="text-slate-300">
                  한 문장이면 충분합니다. 그 한 문장이 누군가에겐 평생의 위로가 됩니다.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold"
                  onClick={primaryCta}
                >
                  3분 만에 시작하기
                </button>
                <button
                  className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold"
                  onClick={secondaryCta}
                >
                  어떻게 동작해?
                </button>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed pt-2">
                * 현재 버전은 테스트 환경입니다. 실제 알림톡/메시지 발송은 정식 연동 후 제공될
                예정입니다.
              </div>
            </div>

            {/* 오른쪽: 미리보기 카드 */}
            <div className="bg-white text-slate-900 rounded-2xl border border-slate-100 shadow-lg p-6 md:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">PREVIEW</div>
                  <div className="mt-1 text-lg font-semibold">내가 남길 한 문장</div>
                  <div className="mt-1 text-xs text-slate-500">
                    실제 마이페이지에서 지정인/메시지를 관리할 수 있어.
                  </div>
                </div>
                <div className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[11px] font-semibold border border-emerald-100">
                  베타
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[11px] font-semibold text-slate-500">지정인</div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">엄마</span>
                      <span className="text-[11px] text-slate-500">가족</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">친구</span>
                      <span className="text-[11px] text-slate-500">지인</span>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400">
                    연락처는 실제 발송용으로만 사용돼.
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-[11px] font-semibold text-slate-500">메시지</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-800">
                    “고마웠어. 그리고 사랑해.
                    <br className="hidden sm:block" />
                    혹시 내가 먼저 가도, 너의 내일이 따뜻하길 바라.”
                  </div>
                </div>

                <button
                  onClick={() => router.push("/signup")}
                  className="w-full mt-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  지금 내 메시지 남기기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">어떻게 동작해?</h2>
              <p className="mt-2 text-sm text-slate-300">
                복잡한 설명 없이, 필요한 것만.
              </p>
            </div>
            <a className="text-sm text-emerald-300 hover:text-emerald-200" href="#faq">
              궁금한 점 보기 →
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "지정인을 등록해",
                desc: "메시지를 받게 될 사람의 연락처를 등록해.",
              },
              {
                step: "02",
                title: "남길 말을 기록해",
                desc: "긴 글이 아니어도 돼. 한 문장도 충분해.",
              },
              {
                step: "03",
                title: "안전하게 전달해",
                desc: "조건이 충족되면 지정인에게 메시지가 전달돼. (정식 연동 예정)",
                badge: "준비 중",
              },
            ].map((it) => (
              <div
                key={it.step}
                className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300">
                    STEP {it.step}
                  </div>
                  {it.badge && (
                    <div className="text-[11px] px-2 py-1 rounded-full bg-white/10 border border-slate-700 text-slate-200">
                      {it.badge}
                    </div>
                  )}
                </div>
                <div className="mt-3 text-lg font-semibold">{it.title}</div>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{it.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY */}
        <section id="why" className="max-w-6xl mx-auto px-4 py-12">
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/30 p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1 text-xs text-slate-100 border border-slate-700/60">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  NOVO의 철학
                </div>

                <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                  떠난 후에도 전하고 싶은 말이
                  <br />
                  <span className="text-emerald-400">안전하게 도착하도록</span>
                </h3>

                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  우리는 죽음을 끝으로 보지 않습니다.
                  <br />
                  그것은 형태를 바꾼 또 다른 시작.
                  <br />
                  NOVO는 그 시작의 빛이 되어,
                  <br />
                  당신의 사랑과 기억이 다음날의 위로가 되도록.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    title: "개인정보 최소 수집",
                    desc: "꼭 필요한 정보만. 서비스의 목적에 맞게.",
                  },
                  {
                    title: "언제든 수정 가능",
                    desc: "마이페이지에서 지정인/메시지를 계속 다듬을 수 있어.",
                  },
                  {
                    title: "전달은 ‘필요할 때’",
                    desc: "평소엔 조용히 보관하고, 정해진 조건에서 전달돼.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-slate-800/70 bg-slate-950/30 p-5"
                  >
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="mt-1 text-sm text-slate-300 leading-relaxed">
                      {c.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="rounded-3xl border border-emerald-800/40 bg-emerald-500/10 p-6 md:p-10">
            <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] items-center">
              <div>
                <div className="text-xs font-semibold text-emerald-200">
                  말하지 못한 마음은, 사라지지 않습니다
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-bold leading-snug">
                  오늘, 한 문장만 남겨두자.
                </div>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                  지금은 기록하고, 필요할 때 전달됩니다.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="w-full px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold"
                  onClick={() => (hasToken ? router.push("/mypage") : router.push("/signup"))}
                >
                  {hasToken ? "마이페이지로 가기" : "NOVO 시작하기"}
                </button>
                <button
                  className="w-full px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold"
                  onClick={() => router.push("/signup")}
                >
                  가입만 먼저 해둘게
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-6xl mx-auto px-4 py-12 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">FAQ</h2>
          <p className="mt-2 text-sm text-slate-300">
            불안한 부분이 있으면, 여기서 먼저 풀고 가자.
          </p>

          <div className="mt-6 grid gap-3">
            {faqs.map((f, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-800/70 bg-slate-900/30 p-5 open:bg-slate-900/45"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                  <span className="font-semibold">{f.q}</span>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform select-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <footer className="mt-12 border-t border-slate-800/60 pt-6 text-xs text-slate-400">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} NOVO · nova + note</div>
              <div className="flex gap-4">
                <a className="hover:text-slate-200" href="/signup">
                  시작하기
                </a>
                <a className="hover:text-slate-200" href="/mypage">
                  마이페이지
                </a>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
