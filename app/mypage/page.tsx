"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearToken, getTokenClient } from "@/lib/api";

type MeResponse = {
  ok: boolean;
  user: {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    birth_date?: string | null;
    signup_method?: string | null;
    created_at: string;
    service_active: number;
    check_active: number;
    check_day: string | null;
    check_time: string | null;
    last_check_confirmed_at?: string | null;
    check_policy?: {
      summary: string;
      steps: string[];
    };
  };
  counts: { recipients: number };
};

type Recipient = {
  id: number;
  name: string;
  phone: string;
  relation?: string | null;
  has_access_password?: number | boolean;
  created_at: string;
};

type RecipientsResponse = { ok: boolean; recipients: Recipient[] };
type MessageResponse = { ok: boolean; has_message: boolean; content: string };

export default function Mypage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse["user"] | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [savingMessage, setSavingMessage] = useState(false);
  const [messageSaved, setMessageSaved] = useState(false);
  const [recipientSaved, setRecipientSaved] = useState(false);
  const [linkResult, setLinkResult] = useState<string | null>(null);
  const [heartbeatMessage, setHeartbeatMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!getTokenClient()) {
      router.replace("/signup");
      return;
    }

    async function fetchAll() {
      setLoading(true);
      try {
        const [meRes, recRes, msgRes] = await Promise.all([
          apiFetch<MeResponse>("/api/me"),
          apiFetch<RecipientsResponse>("/api/recipients"),
          apiFetch<MessageResponse>("/api/message"),
        ]);
        setMe(meRes.user);
        setRecipients(recRes.recipients);
        setMessageDraft(msgRes.content || "");
        if (recRes.recipients[0]) {
          setNewName(recRes.recipients[0].name);
          setNewPhone(recRes.recipients[0].phone);
        }
      } catch (err: any) {
        if (err?.error === "invalid_token") {
          clearToken();
          router.replace("/signup");
          return;
        }
        setErrorMsg(err?.message || err?.error || "마이페이지를 불러오지 못했어.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [router]);

  const exampleTexts = useMemo(() => [
    "이 글을 본다는 건 내게 갑작스러운 일이 생긴 걸 거야.",
    "우리 가족을 위해 투자해 둔 자산이 몇 개 있어.",
    "당황스럽겠지만, 이 순서대로 먼저 확인해 줘.",
  ], []);

  async function handleSaveRecipient(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setRecipientSaved(false);
    try {
      const res = await apiFetch<{ ok: boolean; recipient: Recipient }>("/api/recipients", {
        method: "POST",
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          access_password: accessPassword.trim(),
        }),
      });
      setRecipients([res.recipient]);
      setRecipientSaved(true);
      setAccessPassword("");
    } catch (err: any) {
      setErrorMsg(err?.message || err?.error || "지정인 저장 중 문제가 발생했어.");
    }
  }

  async function handleSaveMessage() {
    setErrorMsg(null);
    setMessageSaved(false);
    setSavingMessage(true);
    try {
      await apiFetch("/api/message", {
        method: "PUT",
        body: JSON.stringify({ content: messageDraft.trim() }),
      });
      setMessageSaved(true);
      setTimeout(() => setMessageSaved(false), 2000);
    } catch (err: any) {
      setErrorMsg(err?.message || err?.error || "메시지를 저장하지 못했어.");
    } finally {
      setSavingMessage(false);
    }
  }

  async function handleHeartbeat() {
    try {
      const res = await apiFetch<{ ok: boolean; confirmed_at: string; message: string }>("/api/check/heartbeat", { method: "POST" });
      setHeartbeatMessage(res.message);
      setMe((prev) => (prev ? { ...prev, last_check_confirmed_at: res.confirmed_at } : prev));
    } catch (err: any) {
      setErrorMsg(err?.message || err?.error || "생존 확인 처리에 실패했어.");
    }
  }

  async function handleCreateRecipientLink() {
    try {
      const res = await apiFetch<{ ok: boolean; access_link: string }>("/api/recipient-access-link", { method: "POST" });
      setLinkResult(res.access_link);
    } catch (err: any) {
      setErrorMsg(err?.message || err?.error || "열람 링크를 만들지 못했어.");
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">불러오는 중...</div>;
  }

  if (!me) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-lg font-semibold">NOVO 마이페이지</div>
            <div className="text-xs text-slate-400">혹시 모를 그날을 위해, 오늘 미리 적어 두는 한 문장</div>
          </div>
          <button onClick={() => { clearToken(); router.push("/signup"); }} className="text-sm underline text-slate-300">로그아웃</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {errorMsg && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{errorMsg}</div>}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-slate-400">가입 정보</div>
            <div className="mt-3 space-y-1 text-sm text-slate-100">
              <div>{me.name}</div>
              <div>{me.birth_date}</div>
              <div>{me.signup_method === "email" ? me.email || "이메일 미입력" : me.phone}</div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-slate-400">생존 확인 상태</div>
            <div className="mt-3 text-sm leading-7 text-slate-100">
              <div>{me.check_policy?.summary}</div>
              <div className="mt-2 text-xs text-slate-400">마지막 확인: {me.last_check_confirmed_at || "아직 없음"}</div>
            </div>
            <button onClick={handleHeartbeat} className="mt-4 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">이번 달 생존 확인</button>
            {heartbeatMessage && <div className="mt-2 text-xs text-emerald-300">{heartbeatMessage}</div>}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-slate-400">지정인 전달 테스트</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">카카오 버튼 자리에 들어갈 열람 링크를 미리 생성해 볼 수 있어.</p>
            <button onClick={handleCreateRecipientLink} className="mt-4 rounded-2xl border border-white/15 px-4 py-2 text-sm">열람 링크 만들기</button>
            {linkResult && <div className="mt-3 break-all rounded-2xl bg-slate-900 px-3 py-3 text-xs text-slate-200">{linkResult}</div>}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_1.35fr]">
          <div className="rounded-[28px] border border-white/10 bg-white p-6 text-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">지정인 등록</h2>
              <span className="text-xs text-slate-500">관계 항목은 제거했어.</span>
            </div>
            <form onSubmit={handleSaveRecipient} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">받는 사람 이름</label>
                <input className="w-full rounded-xl border px-3 py-2" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="홍길동" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">연락처</label>
                <input className="w-full rounded-xl border px-3 py-2" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="01012345678" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">지정인 열람 비밀번호</label>
                <input type="password" className="w-full rounded-xl border px-3 py-2" value={accessPassword} onChange={(e) => setAccessPassword(e.target.value)} placeholder="최소 4자" />
                <p className="mt-1 text-[11px] text-slate-500">지정인이 링크 접속 후 생년월일과 함께 입력할 비밀번호야.</p>
              </div>
              <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">지정인 저장</button>
              {recipientSaved && <div className="text-xs text-emerald-600">지정인 정보가 저장됐어.</div>}
            </form>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-600">현재 등록 상태</div>
              {recipients.length > 0 ? (
                <div className="mt-2 text-sm leading-7 text-slate-800">
                  <div>{recipients[0].name}</div>
                  <div>{recipients[0].phone}</div>
                  <div className="text-xs text-slate-500">열람 비밀번호 설정됨: {recipients[0].has_access_password ? "예" : "아니오"}</div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-500">아직 지정인이 등록되지 않았어.</div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white p-6 text-slate-900">
            <div className="grid gap-5 md:grid-cols-[1.25fr_0.75fr]">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">전달할 메시지 작성</h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">암호화 저장</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  저장된 메시지는 암호화된 형태로 보관돼. 글쓴이 외 단 한 명도, 그 누구도 본문을 바로 볼 수 없도록 준비하는 흐름이야.
                </p>
                <textarea className="mt-4 min-h-[320px] w-full rounded-2xl border px-4 py-4 text-sm leading-7" value={messageDraft} onChange={(e) => setMessageDraft(e.target.value)} placeholder="전달하고 싶은 말을 텍스트로 남겨 줘." />
                <button onClick={handleSaveMessage} disabled={savingMessage} className="mt-4 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{savingMessage ? "저장 중..." : "메시지 저장"}</button>
                {messageSaved && <span className="ml-3 text-xs text-emerald-600">저장 완료</span>}
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">작성 예시</div>
                <div className="mt-3 space-y-3">
                  {exampleTexts.map((item) => (
                    <div key={item} className="rounded-2xl bg-white px-3 py-3 text-xs leading-6 text-slate-700">{item}</div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
