import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import type { DisplayOption, RoleType, Signature } from '../types';
import confetti from 'canvas-confetti';

interface SignatureFormProps {
  onSubmit: (
    signature: Omit<Signature, 'id' | 'createdAt'>,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const SignatureForm: React.FC<SignatureFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<RoleType>('student');
  const [grade, setGrade] = useState('2年生');
  const [classRoom, setClassRoom] = useState('1組');
  const [identifier, setIdentifier] = useState('');
  const [displayOption, setDisplayOption] = useState<DisplayOption>('real_name');
  const [destinationIdea, setDestinationIdea] = useState('');
  const [message, setMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('氏名を入力してください。');
      return;
    }

    if (!identifier.trim()) {
      setError('重複確認のための学籍番号またはメールアドレスを入力してください。');
      return;
    }

    if (!agreedToTerms) {
      setError('趣旨および個人情報の取り扱いへの同意が必要です。');
      return;
    }

    setSubmitting(true);
    try {
      const result = await onSubmit({
        name: name.trim(),
        role,
        grade: role === 'student' ? grade : undefined,
        classRoom: role === 'student' ? classRoom : undefined,
        identifier: identifier.trim(),
        displayOption,
        destinationIdea: destinationIdea.trim() || undefined,
        message: message.trim() || undefined,
        agreedToTerms,
      });

      if (!result.success) {
        setError(result.error || 'エラーが発生しました。');
        return;
      }
    } finally {
      setSubmitting(false);
    }

    setSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // フォームリセット
    setName('');
    setIdentifier('');
    setDestinationIdea('');
    setMessage('');
    setAgreedToTerms(false);
  };

  return (
    <section className="bg-white rounded-lg border border-rule p-6 sm:p-8 mb-8" id="sign-form">
      <div className="flex items-center gap-2 mb-2 text-navy font-bold text-sm">
        <ShieldCheck className="w-4 h-4" />
        署名入力フォーム（デジタル管理・紛失防止）
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        修学旅行の復活に署名する
      </h2>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        入力されたデータは暗号化・安全に管理され、学校（校長・教員会議・知道会）への公式要望提出の目的のみに使用されます。
      </p>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold">署名が正常に記録されました！</h4>
            <p className="text-sm text-emerald-700 mt-1">
              賛同ありがとうございます。あなたの想いが150周年の修学旅行復活への大きな推進力となります。
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-2 text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
            >
              続けて別の署名を行う、または閉じる
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 属性選択 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            あなたの立場・属性 <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'student', label: '在校生' },
              { id: 'parent', label: '保護者(知道会)' },
              { id: 'alumni', label: '卒業生' },
              { id: 'faculty', label: '教職員' },
              { id: 'other', label: 'サポーター' },
            ].map((item) => (
              <label
                key={item.id}
                className={`flex items-center justify-center p-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                  role === item.id
                    ? 'border-navy bg-paper text-navy shadow-sm font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={item.id}
                  checked={role === item.id}
                  onChange={(e) => setRole(e.target.value as RoleType)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* 在校生の場合の学年・組 */}
        {role === 'student' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                学年 <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="1年生">1年生</option>
                <option value="2年生">2年生</option>
                <option value="3年生">3年生</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                クラス/組 <span className="text-rose-500">*</span>
              </label>
              <select
                value={classRoom}
                onChange={(e) => setClassRoom(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="1組">1組</option>
                <option value="2組">2組</option>
                <option value="3組">3組</option>
                <option value="4組">4組</option>
                <option value="5組">5組</option>
                <option value="6組">6組</option>
              </select>
            </div>
          </div>
        )}

        {/* 氏名 & 重複防止キー */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              氏名（漢字またはフルネーム） <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例: 山田 太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white"
              required
            />
            <span className="text-xs text-slate-400 mt-1 block">
              ※学校への提出書類として実名が記録されます。
            </span>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              学籍番号 または メールアドレス <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例: s123456 または xxx@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white"
              required
            />
            <span className="text-xs text-slate-400 mt-1 block">
              ※同一人物の二重署名を防止・照合するために使用します。公開されません。
            </span>
          </div>
        </div>

        {/* 公開設定 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Web上（署名一覧ボード）での名前の表示方法
          </label>
          <div className="flex flex-wrap gap-4 mt-1.5">
            {[
              { id: 'real_name', label: '実名で表示 (山田 太郎)' },
              { id: 'initial', label: 'イニシャルで表示 (Y. T.)' },
              { id: 'anonymous', label: '匿名で表示 (匿名希望)' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="displayOption"
                  value={opt.id}
                  checked={displayOption === opt.id}
                  onChange={(e) => setDisplayOption(e.target.value as DisplayOption)}
                  className="text-navy focus:ring-navy"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* 行きたい場所アイデア */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            修学旅行で行きたい場所・学びたいこと（任意）
          </label>
          <input
            type="text"
            placeholder="例: 沖縄（自然環境と平和学習）、京都・奈良（歴史文化体験）、北海道（探究活動）など"
            value={destinationIdea}
            onChange={(e) => setDestinationIdea(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white"
          />
        </div>

        {/* 応援メッセージ */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            応援メッセージ・学校や先生への想い（任意）
          </label>
          <textarea
            rows={3}
            placeholder="例: 150周年の特別な思い出として、ぜひみんなで行きたいです！先生方や知道会の皆様、応援よろしくお願いいたします！"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:bg-white"
          />
        </div>

        {/* 同意チェック */}
        <div className="bg-paper border border-rule rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy"
            />
            <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              私は「創立150周年を機に修学旅行を復活させる」という趣旨に賛同し、
              本署名データが学校・教員・知道会（PTA）への要望提出のために使用されることに同意します。
            </span>
          </label>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy hover:bg-ink text-white font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        >
          <Send className="w-5 h-5" />
          {submitting ? '送信しています…' : '署名を送信して賛同する'}
        </button>
      </form>
    </section>
  );
};
