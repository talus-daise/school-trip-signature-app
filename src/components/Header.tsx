import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white text-ink border-b-4 border-double border-rule py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] text-vermilion font-bold mb-4">
          創立150周年記念プロジェクト
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-4 leading-snug">
          150周年の節目に、
          <br />
          私たちの修学旅行を復活させよう
        </h1>

        <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 text-slate-700">
          現在私たちの学校には修学旅行がありません。しかし、再来年に迎える創立150周年は、
          かけがえのない学びと友との絆を育む「修学旅行」を復活させる最高の機会です。
          生徒・卒業生・教職員、そして保護者（知道会）の皆様、一人ひとりの声を学校へ届けましょう。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 border-t border-rule pt-4">
          <span>150年の伝統と未来</span>
          <span className="text-rule">|</span>
          <span>探究と体験の学び</span>
          <span className="text-rule">|</span>
          <span>知道会・学校と連携</span>
        </div>
      </div>
    </header>
  );
};
