import React from 'react';
import { Award, Compass, HeartHandshake, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 text-amber-200 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-amber-300" />
          再来年 創立150周年記念プロジェクト
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          150周年の節目に、<br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
            私たちの修学旅行
          </span>
          を復活させよう！
        </h1>

        <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          現在私たちの学校には修学旅行がありません。しかし、再来年に迎える創立150周年は、
          かけがえのない学びと友との絆を育む「修学旅行」を復活させる最高の機会です。
          生徒・卒業生・教職員、そして保護者（知道会）の皆様、一人ひとりの声を学校へ届けましょう！
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left text-xs sm:text-sm">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <p className="font-bold text-white">150年の伝統と未来</p>
              <p className="text-blue-200 text-xs">記念事業としての復活提案</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
            <Compass className="w-8 h-8 text-cyan-300 shrink-0" />
            <div>
              <p className="font-bold text-white">探究と体験の学び</p>
              <p className="text-blue-200 text-xs">教室では得られない思い出</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-pink-300 shrink-0" />
            <div>
              <p className="font-bold text-white">知道会・学校と連携</p>
              <p className="text-blue-200 text-xs">保護者・地域と共に実現へ</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
