import { useState } from "react";
import { Message } from "../types/actionCenter";

interface UnreadMessagesCardProps {
  count: number;
  messages?: Message[];
  isMarkingMessageId?: string | null;
  onMarkMessageAsRead?: (messageId: string) => void;
}

export function UnreadMessagesCard({
  count,
  messages = [],
  isMarkingMessageId = null,
  onMarkMessageAsRead,
}: UnreadMessagesCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMarkAsRead = (messageId: string) => {
    onMarkMessageAsRead?.(messageId);
  };

  return (
    <section className="rounded-3xl bg-white/85 p-5 shadow-glow ring-1 ring-slate-200/80 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Unread Messages</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight text-slate-950">{count}</span>
        <span className="pb-1 text-sm text-slate-500">new items</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Keep an eye on recent parent and student messages waiting for review.
      </p>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={count === 0}
      >
        {count > 0 ? "View unread messages" : "No unread messages"}
      </button>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Unread Messages
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {count} message{count === 1 ? "" : "s"} waiting for review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-5 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <article key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{message.subject}</p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{message.from}</p>
                      </div>
                      <time className="shrink-0 text-xs text-slate-500">
                        {new Date(message.receivedAt).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{message.preview}</p>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={isMarkingMessageId === message.id}
                        className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {isMarkingMessageId === message.id ? "Marking..." : "Mark as read"}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                  No unread messages for this student.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
