import React from 'react';
import { MessageSquareQuote, MapPin, UserCheck, Calendar } from 'lucide-react';
import { ROLE_LABELS } from '../types';
import type { Signature } from '../types';
import { formatDisplayName } from '../utils/petitionUtils';

interface SignatureListProps {
  signatures: Signature[];
}

export const SignatureList: React.FC<SignatureListProps> = ({ signatures }) => {
  return (
    <section className="bg-white rounded-lg border border-rule p-6 sm:p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-navy px-2.5 py-1">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            賛同者の声 &amp; 応援メッセージ
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">
            寄せられたメッセージ（{signatures.length}件）
          </h2>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {signatures.length === 0 ? (
          <p className="text-slate-500 text-center py-8">まだ署名がありません。最初の賛同者になりましょう！</p>
        ) : (
          signatures.map((sig) => (
            <div
              key={sig.id}
              className="p-4 rounded-lg border border-rule bg-paper transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-navy" />
                    {formatDisplayName(sig)}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {ROLE_LABELS[sig.role]}
                    {sig.role === 'student' && sig.grade && ` (${sig.grade})`}
                  </span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(sig.createdAt).toLocaleDateString('ja-JP')}
                </span>
              </div>

              {sig.destinationIdea && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md mb-2 w-fit">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  希望先: {sig.destinationIdea}
                </div>
              )}

              {sig.message ? (
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {sig.message}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">「修学旅行の復活に賛同します」</p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
