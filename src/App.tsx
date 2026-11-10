import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { SignatureForm } from './components/SignatureForm';
import { SignatureList } from './components/SignatureList';
import { AdminExportModal } from './components/AdminExportModal';
import { INITIAL_SIGNATURES } from './types';
import type { Signature } from './types';
import { calculateStats, isDuplicate } from './utils/petitionUtils';
import { DownloadCloud, Sparkles, School, HeartHandshake, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'school_trip_signatures_150th_v1';

export const App: React.FC = () => {
  const [signatures, setSignatures] = useState<Signature[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_SIGNATURES;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [signatures]);

  const handleAddSignature = (
    newSigData: Omit<Signature, 'id' | 'createdAt'>
  ): { success: boolean; error?: string } => {
    // 重複チェック (学籍番号またはメールアドレス)
    if (isDuplicate(signatures, newSigData.identifier)) {
      return {
        success: false,
        error: `入力された学籍番号/メールアドレス「${newSigData.identifier}」は既に署名済みです。重複登録は防止されています。`,
      };
    }

    const newSignature: Signature = {
      ...newSigData,
      id: `sig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    setSignatures((prev) => [newSignature, ...prev]);
    return { success: true };
  };

  const handleResetToDemo = () => {
    setSignatures(INITIAL_SIGNATURES);
    localStorage.removeItem(STORAGE_KEY);
  };

  const stats = calculateStats(signatures, 300);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* 学校への提案メリット・150周年復活の背景 */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-2xl p-6 sm:p-7 mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            150周年記念 修学旅行復活プロジェクトについて
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
            「記憶に残る150周年にしよう」
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            私たちの学校は再来年に創立150周年という偉大な節目を迎えます。
            しかし現在、本来学生生活の中で最も深く学び、友情を育む体験である修学旅行がありません。
            紙の署名では「集計の大変さ」や「紛失」の恐れがありますが、このデジタル署名アプリで安全に声を可視化し、
            <strong>学校長・教職員会議、そしてPTA（知道会）</strong>へ公式の復活請願として提出します！
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
            <div className="bg-white p-3 rounded-xl border border-indigo-50 flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>デジタル暗号管理で紛失リスクゼロ</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-indigo-50 flex items-center gap-2.5">
              <School className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>学校側へ客観的な集計データ提出</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-indigo-50 flex items-center gap-2.5">
              <HeartHandshake className="w-4 h-4 text-pink-500 shrink-0" />
              <span>知道会（保護者）・同窓生とも連携</span>
            </div>
          </div>
        </section>

        {/* 進捗プログレス */}
        <ProgressBar stats={stats} />

        {/* 署名入力フォーム */}
        <SignatureForm onSubmit={handleAddSignature} />

        {/* 賛同者メッセージ一覧 */}
        <SignatureList signatures={signatures} />

        {/* 管理・エクスポート用フローティング / ボトムバー */}
        <div className="text-center pt-4 pb-8">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold shadow transition-all cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4 text-amber-300" />
            提出用データ管理・CSV出力（管理者・生徒会用）
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 border-t border-slate-800 text-center text-xs">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-semibold text-slate-300">
            創立150周年記念 修学旅行復活 署名プロジェクト
          </p>
          <p>
            主催: 修学旅行復活有志一同・生徒有志 | 協力: 知道会（PTA）・同窓会
          </p>
          <p className="text-slate-500">
            ※本アプリで収集した個人情報は、修学旅行復活の要望提出目的のみに安全に使用されます。
          </p>
        </div>
      </footer>

      {/* 管理エクスポートモーダル */}
      {isAdminOpen && (
        <AdminExportModal
          signatures={signatures}
          onClose={() => setIsAdminOpen(false)}
          onResetToDemo={handleResetToDemo}
        />
      )}
    </div>
  );
};

export default App;
