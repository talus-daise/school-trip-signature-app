import React from 'react';
import type { PetitionStats } from '../types';

interface ProgressBarProps {
  stats: PetitionStats;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  return (
    <section className="bg-white rounded-lg border border-rule p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-navy">
            署名進捗ステータス
          </p>
          <h2 className="font-serif text-2xl font-bold text-ink mt-1">
            現在の署名数: <span className="text-3xl sm:text-4xl text-vermilion font-bold">{stats.total}</span>
            <span className="text-slate-500 text-lg font-medium ml-1">/ {stats.goal} 名目標</span>
          </h2>
        </div>
        <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between">
          <span className="text-sm font-medium text-slate-500">目標達成率</span>
          <span className="text-3xl font-bold text-navy">{stats.percentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-paper rounded-sm h-4 overflow-hidden mb-6 border border-rule">
        <div
          className="bg-vermilion h-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(5, Math.min(100, stats.percentage))}%` }}
        />
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-rule">
        <div className="bg-paper rounded-lg p-3 text-center border border-rule">
          <p className="text-xs text-slate-500 font-medium mb-1">在校生</p>
          <p className="text-xl font-bold text-ink">{stats.byRole.student}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">
            1年:{stats.byGrade['1年生'] || 0} / 2年:{stats.byGrade['2年生'] || 0} / 3年:{stats.byGrade['3年生'] || 0}
          </div>
        </div>

        <div className="bg-paper rounded-lg p-3 text-center border border-rule">
          <p className="text-xs text-slate-500 font-medium mb-1">保護者 (知道会)</p>
          <p className="text-xl font-bold text-ink">{stats.byRole.parent}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">心強い支援の輪</div>
        </div>

        <div className="bg-paper rounded-lg p-3 text-center border border-rule">
          <p className="text-xs text-slate-500 font-medium mb-1">卒業生</p>
          <p className="text-xl font-bold text-ink">{stats.byRole.alumni}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">先輩方からのエール</div>
        </div>

        <div className="bg-paper rounded-lg p-3 text-center border border-rule">
          <p className="text-xs text-slate-500 font-medium mb-1">教職員・サポーター</p>
          <p className="text-xl font-bold text-ink">{stats.byRole.faculty + stats.byRole.other}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">学校と地域一丸</div>
        </div>
      </div>
    </section>
  );
};
