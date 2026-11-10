import React from 'react';
import { Target, Users, BookOpen, HeartHandshake, CheckCircle2 } from 'lucide-react';
import type { PetitionStats } from '../types';

interface ProgressBarProps {
  stats: PetitionStats;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            <Target className="w-3.5 h-3.5" />
            署名進捗ステータス
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">
            現在の署名数: <span className="text-3xl sm:text-4xl text-blue-600 font-extrabold">{stats.total}</span>
            <span className="text-slate-500 text-lg font-medium ml-1">/ {stats.goal} 名目標</span>
          </h2>
        </div>
        <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between">
          <span className="text-sm font-medium text-slate-500">目標達成率</span>
          <span className="text-3xl font-black text-indigo-600">{stats.percentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-6 p-0.5 border border-slate-200">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-1"
          style={{ width: `${Math.max(5, Math.min(100, stats.percentage))}%` }}
        />
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            在校生
          </div>
          <p className="text-xl font-bold text-slate-800">{stats.byRole.student}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">
            1年:{stats.byGrade['1年生'] || 0} / 2年:{stats.byGrade['2年生'] || 0} / 3年:{stats.byGrade['3年生'] || 0}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-pink-600" />
            保護者 (知道会)
          </div>
          <p className="text-xl font-bold text-slate-800">{stats.byRole.parent}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">心強い支援の輪</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            卒業生
          </div>
          <p className="text-xl font-bold text-slate-800">{stats.byRole.alumni}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">先輩方からのエール</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            教職員・サポーター
          </div>
          <p className="text-xl font-bold text-slate-800">{stats.byRole.faculty + stats.byRole.other}<span className="text-xs font-normal ml-0.5 text-slate-500">名</span></p>
          <div className="text-[11px] text-slate-400 mt-1">学校と地域一丸</div>
        </div>
      </div>
    </section>
  );
};
