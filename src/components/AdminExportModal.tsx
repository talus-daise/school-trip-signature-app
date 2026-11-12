import React, { useState } from 'react';
import { Download, FileText, ShieldAlert, Copy, Check, Info } from 'lucide-react';
import type { Signature } from '../types';
import { exportToCSV, generateSummaryReport } from '../utils/petitionUtils';

interface AdminExportModalProps {
  signatures: Signature[];
  onClose: () => void;
  // 未指定の場合は「デモに戻す」を表示しない (共有モードで D1 を消さないため)
  onResetToDemo?: () => void;
}

export const AdminExportModal: React.FC<AdminExportModalProps> = ({
  signatures,
  onClose,
  onResetToDemo,
}) => {
  const [copied, setCopied] = useState(false);
  const summary = generateSummaryReport(signatures);

  const handleDownloadCSV = () => {
    const csvData = exportToCSV(signatures);
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `150th_school_trip_signatures_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-rule max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2 text-navy">
            <FileText className="w-5 h-5" />
            <h3 className="text-xl font-bold text-slate-800">学校・知道会 提出用データ管理</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">学校提出用エクスポートについて</p>
            <p className="text-xs text-blue-800 mt-1">
              署名用紙のアナログ紛失リスクをゼロにし、校長先生や教員会議、知道会（PTA）への公式プレゼンテーションに使える信頼性の高いデータ（CSV・要約報告書）を作成できます。
            </p>
          </div>
        </div>

        {/* ダウンロード・コピーアクション */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            CSVデータを出力（全件・Excel対応）
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center justify-center gap-2 bg-navy hover:bg-ink text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '要約文をコピーしました！' : '提出用サマリーをコピー'}
          </button>
        </div>

        {/* サマリープレビュー */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            提出用サマリーレポートプレビュー
          </h4>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-64">
            {summary}
          </pre>
        </div>

        {/* 開発・デモ用リセット (localStorage のみのときだけ表示) */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          {onResetToDemo ? (
            <button
              onClick={() => {
                if (confirm('初期サンプルデータにリセットしますか？')) {
                  onResetToDemo();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              テストデータを初期状態に戻す
            </button>
          ) : (
            <span className="text-xs text-slate-400">
              共有モードのため、サーバーの署名データをここから消すことはできません。
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
