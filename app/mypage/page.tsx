"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getTokenClient, clearToken } from "@/lib/api";

type MeResponse = {
  ok: boolean;
  user: {
    id: number;
    name: string;
    phone: string;
    created_at: string;
    service_active: number;
    check_active: number;
    check_day: string | null;
    check_time: string | null;
  };
  counts: {
    recipients: number;
  };
};

type Recipient = {
  id: number;
  name: string;
  phone: string;
  relation: string;
  created_at: string;
};

type RecipientsResponse = {
  ok: boolean;
  recipients: Recipient[];
};

type MessageResponse = {
  ok: boolean;
  has_message: boolean;
  content: string;
};

type PaymentLatestResponse = {
  ok: boolean;
  payment: {
    id: number;
    status: string;
    amount: number;
    created_at: string;
  } | null;
};

export default function Mypage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [me, setMe] = useState<MeResponse["user"] | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const [message, setMessage] = useState<string>("");
  const [messageDraft, setMessageDraft] = useState<string>("");
  const [savingMessage, setSavingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageSaved, setMessageSaved] = useState(false);

  const [paymentLatest, setPaymentLatest] =
    useState<PaymentLatestResponse["payment"]>(null);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelation, setNewRelation] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getTokenClient();
    if (!token) {
      router.replace("/signup");
      return;
    }

    async function fetchAll() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [meRes, recRes, msgRes, payRes] = await Promise.all([
          apiFetch<MeResponse>("/api/me"),
          apiFetch<RecipientsResponse>("/api/recipients"),
          apiFetch<MessageResponse>("/api/message"),
          apiFetch<PaymentLatestResponse>("/api/payment/latest"),
        ]);

        setMe(meRes.user);
        setRecipients(recRes.recipients);

        const initialMessage = msgRes.content || "";
        setMessage(initialMessage);
        setMessageDraft(initialMessage);

        setPaymentLatest(payRes.payment);
      } catch (err: any) {
        console.error(err);
        if (err?.error === "invalid_token") {
          clearToken();
          router.replace("/signup");
          return;
        }
        setErrorMsg(
          err?.message ||
            err?.error ||
            "정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [router]);

  async function handleAddRecipient(e: FormEvent) {
    e.preventDefault();
    setAddError(null);

    const name = newName.trim();
    const phone = newPhone.trim();
    const relation = newRelation.trim();

    if (!name || !phone) {
      setAddError("이름과 휴대폰 번호는 필수입니다.");
      return;
    }

    setAdding(true);
    try {
      await apiFetch("/api/recipients", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          relation,
        }),
      });

      const recRes = await apiFetch<RecipientsResponse>("/api/recipients");
      setRecipients(recRes.recipients);

      setNewName("");
      setNewPhone("");
      setNewRelation("");
    } catch (err: any) {
      console.error(err);
      setAddError(
        err?.message ||
          err?.error ||
          "지정인을 추가하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteRecipient(id: number) {
    setErrorMsg(null);
    setDeletingId(id);
    try {
      await apiFetch(`/api/recipients/${id}`, {
        method: "DELETE",
      });

      setRecipients((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message ||
          err?.error ||
          "지정인을 삭제하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveMessage() {
    setMessageError(null);
    setMessageSaved(false);

    const content = messageDraft.trim();
    setSavingMessage(true);
    try {
      await apiFetch("/api/message", {
        method: "PUT",
        body: JSON.stringify({ content }),
      });

      setMessage(content);
      setMessageSaved(true);
    } catch (err: any) {
      console.error(err);
      setMessageError(
        err?.message ||
          err?.error ||
          "메시지를 저장하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setSavingMessage(false);
      setTimeout(() => setMessageSaved(false), 2000);
    }
  }

  async function handleStartPayment() {
    setPaymentError(null);
    setPaying(true);
    try {
      await apiFetch("/api/payment/start", {
        method: "POST",
        body: JSON.stringify({
          pay_method: "kakaopay",
        }),
      });

      const payRes = await apiFetch<PaymentLatestResponse>(
        "/api/payment/latest"
      );
      setPaymentLatest(payRes.payment);
    } catch (err: any) {
      console.error(err);
      setPaymentError(
        err?.message ||
          err?.error ||
          "결제를 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
        마이페이지를 불러오는 중입니다...
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div>회원 정보를 불러오지 못했습니다.</div>
          <button
            className="px-4 py-2 rounded bg-emerald-600 text-white text-sm"
            onClick={() => router.replace("/signup")}
          >
            다시 가입하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
            {/* 상단 바 */}
      <header className="border-b bg-slate-900/90 backdrop-blur text-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 왼쪽: 로고 + 설명 */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
              N
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">
                NOVO 마이페이지
              </div>
              <div className="mt-0.5 text-[11px] text-slate-300 leading-snug">
                혹시 모를 그날을 위해, 오늘 미리 적어 두는 한 문장입니다.
              </div>
            </div>
          </div>

          {/* 오른쪽: 이름 + 로그아웃 */}
          <div className="flex items-center gap-3 text-xs text-slate-200 justify-end">
            <span className="whitespace-nowrap">{me.name} 님</span>
            <button
              className="whitespace-nowrap underline"
              onClick={() => {
                clearToken();
                router.push("/signup");
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>


      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6 text-slate-900">
        {errorMsg && (
          <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* 상단 요약 카드 */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-1">
            <div className="text-xs font-semibold text-slate-500">
              기본 정보
            </div>
            <div className="text-sm text-slate-800">
              <div>{me.name}</div>
              <div className="text-xs text-slate-500">{me.phone}</div>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              가입일: {me.created_at}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500">
                지정인 수
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {recipients.length}
                <span className="ml-1 text-xs font-normal text-slate-500">
                  명
                </span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              가족, 지인, 파트너 등 실제로 메시지를 받게 될 분들을 등록해
              주세요.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between">
            <div className="text-xs font-semibold text-slate-500">
              이용권 상태
            </div>
            {paymentLatest ? (
              <div className="mt-1 space-y-1 text-sm text-slate-800">
                <div>상태: {paymentLatest.status}</div>
                <div>
                  금액: {paymentLatest.amount.toLocaleString()}
                  원
                </div>
                <div className="text-[11px] text-slate-400">
                  최근 결제: {paymentLatest.created_at}
                </div>
              </div>
            ) : (
              <div className="mt-1 text-sm text-slate-700">
                아직 결제 내역이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 메인 3컬럼 레이아웃 (모바일에서는 세로) */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* 지정인 관리 */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                지정인 관리
              </h2>
              <span className="text-[11px] text-slate-400">
                연락처는 실제 발송용으로만 사용됩니다.
              </span>
            </div>

            <form
              onSubmit={handleAddRecipient}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end"
            >
              <div>
                <label className="block text-[11px] font-medium mb-1 text-slate-600">
                  이름
                </label>
                <input
                  className="w-full border rounded-md px-2 py-1.5 text-xs border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="아들"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1 text-slate-600">
                  휴대폰 번호
                </label>
                <input
                  className="w-full border rounded-md px-2 py-1.5 text-xs border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="01012345678"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1 text-slate-600">
                  관계
                </label>
                <input
                  className="w-full border rounded-md px-2 py-1.5 text-xs border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  placeholder="자녀 / 배우자 등"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={adding}
                  className="w-full py-2 rounded-md bg-emerald-600 text-white text-xs font-semibold disabled:opacity-60"
                >
                  {adding ? "추가 중입니다..." : "지정인 추가"}
                </button>
              </div>
            </form>

            {addError && (
              <div className="text-[11px] text-red-500 whitespace-pre-line">
                {addError}
              </div>
            )}

            <div className="border-t border-slate-100 pt-3">
              <ul className="space-y-2 text-xs">
                {recipients.length === 0 && (
                  <li className="text-slate-500">
                    등록된 지정인이 아직 없습니다.
                  </li>
                )}
                {recipients.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between border rounded-md px-3 py-2"
                  >
                    <div>
                      <div className="font-medium text-slate-900">
                        {r.name} ({r.relation || "관계 미입력"})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {r.phone}
                      </div>
                    </div>
                    <button
                      className="text-[11px] text-red-500 disabled:opacity-50"
                      onClick={() => handleDeleteRecipient(r.id)}
                      disabled={deletingId === r.id}
                    >
                      {deletingId === r.id ? "삭제 중입니다..." : "삭제"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 메시지 + 결제 */}
          <div className="space-y-4">
            {/* 메시지 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                남길 메시지
              </h2>
              <p className="text-[11px] text-slate-500">
                지정인께 실제로 전달될 문장입니다.
                <br />
                마음이 바뀌면 언제든지 다시 수정하실 수 있습니다.
              </p>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-xs min-h-[130px] border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveMessage}
                  disabled={savingMessage}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs disabled:opacity-60"
                >
                  {savingMessage ? "저장 중입니다..." : "메시지 저장"}
                </button>
                {messageSaved && (
                  <span className="text-[11px] text-emerald-600">
                    저장이 완료되었습니다.
                  </span>
                )}
              </div>
              {messageError && (
                <div className="text-[11px] text-red-500 whitespace-pre-line">
                  {messageError}
                </div>
              )}
            </div>

            {/* 결제 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                이용권 / 결제
              </h2>
              <div className="text-xs text-slate-700 space-y-1">
                {paymentLatest ? (
                  <>
                    <div>마지막 결제 상태: {paymentLatest.status}</div>
                    <div>
                      금액: {paymentLatest.amount.toLocaleString()}
                      원
                    </div>
                    <div className="text-[11px] text-slate-400">
                      일시: {paymentLatest.created_at}
                    </div>
                  </>
                ) : (
                  <div>아직 결제 내역이 없습니다.</div>
                )}
              </div>
              {paymentError && (
                <div className="text-[11px] text-red-500 whitespace-pre-line">
                  {paymentError}
                </div>
              )}
              <button
                className="w-full px-3 py-2 rounded-md bg-slate-900 text-white text-xs disabled:opacity-60"
                onClick={handleStartPayment}
                disabled={paying}
              >
                {paying
                  ? "결제 처리 중입니다..."
                  : "연 14,900원 결제하기 (테스트용 / 추후 연동)"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
