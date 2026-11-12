import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { SignatureForm } from './components/SignatureForm';
import { SignatureList } from './components/SignatureList';
import { AdminExportModal } from './components/AdminExportModal';
import { INITIAL_SIGNATURES } from './types';
import type { Signature } from './types';
import { calculateStats, isDuplicate } from './utils/petitionUtils';
import { fetchSignatures, createSignature } from './lib/signaturesApi';
import { DownloadCloud, School, HeartHandshake, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'school_trip_signatures_150th_v1';

function loadLocalSignatures(): Signature[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return INITIAL_SIGNATURES;
}

export const App: React.FC = () => {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  // true: D1 (共有) に接続できている / false: localStorage のみにフォールバック
  const [apiAvailable, setApiAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  // 初回: 共有データ (D1) を読む。ダメならこの端末の localStorage にフォールバックする。
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await fetchSignatures();
        if (cancelled) return;
        setSignatures(remote);
        setApiAvailable(true);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        } catch {
          // キャッシュの保存失敗は無視する
        }
      } catch {
        if (cancelled) return;
        setSignatures(loadLocalSignatures());
        setApiAvailable(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddSignature = useCallback(
    async (
      newSigData: Omit<Signature, 'id' | 'createdAt'>,
    ): Promise<{ success: boolean; error?: string }> => {
      // 共有モード: サーバー (D1) に登録する。重複チェックもサーバー側で行う。
      if (apiAvailable) {
        try {
          const created = await createSignature(newSigData);
          setSignatures((prev) => {
            const next = [created, ...prev];
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
              // ignore
            }
            return next;
          });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : '署名の保存に失敗しました。',
          };
        }
      }

      // フォールバック (localStorage のみ): 従来どおりこの端末内で処理する。
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

      setSignatures((prev) => {
        const next = [newSignature, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      return { success: true };
    },
    [apiAvailable, signatures],
  );

  const handleResetToDemo = () => {
    setSignatures(INITIAL_SIGNATURES);
    localStorage.removeItem(STORAGE_KEY);
  };

  const stats = calculateStats(signatures, 300);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* 学校への提案メリット・150周年復活の背景 */}
        <section className="bg-white border border-rule rounded-lg p-6 sm:p-7 mb-8">
          <p className="text-vermilion font-bold text-sm mb-2">
            150周年記念 修学旅行復活プロジェクトについて
          </p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink mb-3">
            「記憶に残る150周年にしよう」
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            私たちの学校は再来年に創立150周年という偉大な節目を迎えます。
            しかし現在、本来学生生活の中で最も深く学び、友情を育む体験である修学旅行がありません。
            紙の署名では「集計の大変さ」や「紛失」の恐れがありますが、このデジタル署名アプリで安全に声を可視化し、
            <strong>学校長・教職員会議、そしてPTA（知道会）</strong>へ公式の復活請願として提出します！
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
            <div className="bg-paper p-3 rounded-lg border border-rule flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-vermilion shrink-0" />
              <span>デジタル暗号管理で紛失リスクゼロ</span>
            </div>
            <div className="bg-paper p-3 rounded-lg border border-rule flex items-center gap-2.5">
              <School className="w-4 h-4 text-navy shrink-0" />
              <span>学校側へ客観的な集計データ提出</span>
            </div>
            <div className="bg-paper p-3 rounded-lg border border-rule flex items-center gap-2.5">
              <HeartHandshake className="w-4 h-4 text-vermilion shrink-0" />
              <span>知道会（保護者）・同窓生とも連携</span>
            </div>
          </div>
        </section>

        {/* 共有モード / フォールバックの表示 */}
        <p className="text-xs text-slate-500 text-center mb-6">
          {loading
            ? '署名データを読み込んでいます…'
            : apiAvailable
              ? '共有モード：署名はサーバーに保存され、どの端末から見ても同じ一覧になります。'
              : 'この端末のみの表示です：サーバーに接続できなかったため、この端末の保存データを使っています。'}
        </p>

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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-ink text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            提出用データ管理・CSV出力（管理者・生徒会用）
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-ink text-slate-300 py-8 px-4 border-t border-slate-700 text-center text-xs">
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
          // 共有モードでは D1 のデータを消す「デモに戻す」は出さない
          onResetToDemo={apiAvailable ? undefined : handleResetToDemo}
        />
      )}
    </div>
  );
};

export default App;
