"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getTokenClient } from "@/lib/api";

const howSteps = [
  "생존 확인에 응답하면 다음 달 일정으로 이월돼.",
  "미응답이면 20시간 뒤 2차 전송, 다시 24시간 뒤 3차 전송이 진행돼.",
  "끝까지 응답이 없으면 지정인에게 열람 링크가 전달돼.",
];

const examples = [
  "이 글을 본다는 건 내게 갑작스러운 일이 생긴 걸 거야.",
  "우리 가족을 위해 투자해 둔 자산이 몇 개 있어.",
  "혹시 당황스럽더라도, 먼저 이 순서대로 확인해 줘.",
];

export default function HomePage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getTokenClient());
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_30%),linear-gradient(#020617,#020617)]" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <button onClick={() => router.push("/")} className="text-left">
            <div className="text-lg font-semibold">NOVO</div>
            <div className="text-[11px] text-slate-400">갑작스러운 부재에 대비한 마지막 메시지 보관</div>
          </button>
          <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
            <a href="#how">작동방식</a>
            <a href="#examples">어떤 내용을 작성해야 할까</a>
          </nav>
          <div className="flex items-center gap-2">
            {hasToken ? (
              <>
                <button onClick={() => router.push("/mypage")} className="rounded-xl bg-white/10 px-3 py-2 text-sm">마이페이지</button>
                <button onClick={() => { clearToken(); setHasToken(false); }} className="px-3 py-2 text-sm text-slate-300 underline">로그아웃</button>
              </>
            ) : (
              <button onClick={() => router.push("/signup")} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">시작하기</button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-14">
        <section className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              말하지 못한 마음이, 너무 늦기 전에 닿을 수 있도록
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              혹시 모를 내일을 위해,
              <br />
              오늘의 마음을
              <span className="text-emerald-400"> 미리 남겨 두는 곳.</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300">
              NOVO는 갑작스러운 사고나 긴 부재가 생겼을 때를 대비해,
              중요한 말과 안내를 미리 기록하고 지정인에게 전달할 수 있도록 준비하는 서비스야.
              저장된 내용은 암호화되어 보관되고, 글쓴이 외에는 아무도 본문을 바로 알 수 없게 설계했어.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => router.push(hasToken ? "/mypage" : "/signup")} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950">{hasToken ? "기록 이어쓰기" : "내 메시지 남기기"}</button>
              <a href="#how" className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold">작동방식 보기</a>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="text-sm font-semibold text-emerald-300">NOVO 핵심 원칙</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              <li>· 월 1회 생존 확인에 응답하면 다음 달로 자연스럽게 넘어가.</li>
              <li>· 미응답 시 재전송이 누적되고, 끝까지 확인되지 않으면 지정인 전달 단계로 넘어가.</li>
              <li>· 본문은 암호화 저장되어, 운영자나 제3자도 내용을 바로 읽을 수 없도록 준비돼.</li>
            </ul>
          </div>
        </section>

        <section id="how" className="mt-24 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold">작동방식</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              사용자가 생존 확인에 응답하면 전달 흐름은 중단되고, 다음 달 일정으로 다시 이어져. 응답이 없을 때만 단계적으로 지정인 전달 절차가 시작돼.
            </p>
          </div>
          <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
            {howSteps.map((step, idx) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs text-emerald-300">STEP {idx + 1}</div>
                <div className="mt-2 text-sm leading-7 text-slate-100">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="examples" className="mt-24 rounded-[32px] border border-white/10 bg-white/5 p-7">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-semibold">어떤 내용을 작성해야 할까</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                가족에게 남길 말, 자산 정리 힌트, 꼭 알려야 하는 순서처럼 갑작스러운 상황에서 도움이 되는 내용을 짧고 분명하게 적는 게 좋아.
              </p>
            </div>
            <div className="grid gap-3">
              {examples.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-7 text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
