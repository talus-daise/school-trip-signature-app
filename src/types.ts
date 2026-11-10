export type RoleType = 'student' | 'alumni' | 'parent' | 'faculty' | 'other';
export type DisplayOption = 'real_name' | 'initial' | 'anonymous';

export interface Signature {
  id: string;
  name: string;
  role: RoleType;
  grade?: string; // 1年生, 2年生, 3年生など
  classRoom?: string; // 1組, 2組など
  identifier: string; // 学籍番号またはメールアドレス（重複チェックキー）
  displayOption: DisplayOption;
  destinationIdea?: string; // 行きたい場所・希望
  message?: string; // 応援メッセージ・修学旅行への想い
  agreedToTerms: boolean;
  createdAt: string; // ISO 8601 string
}

export interface PetitionStats {
  total: number;
  goal: number;
  percentage: number;
  byRole: Record<RoleType, number>;
  byGrade: Record<string, number>;
}

export const ROLE_LABELS: Record<RoleType, string> = {
  student: '在校生',
  alumni: '卒業生',
  parent: '保護者（知道会会員）',
  faculty: '教職員',
  other: '地域・学校サポーター',
};

export const INITIAL_SIGNATURES: Signature[] = [
  {
    id: 'sig-init-1',
    name: '田中 颯太',
    role: 'student',
    grade: '2年生',
    classRoom: '3組',
    identifier: 's2023012@school.ed.jp',
    displayOption: 'real_name',
    destinationIdea: '京都・奈良（歴史と伝統の探究学習）',
    message: '150周年の節目に、仲間たちとかけがえのない思い出と学びの場をつくりたいです！',
    agreedToTerms: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'sig-init-2',
    name: '佐藤 結衣',
    role: 'student',
    grade: '1年生',
    classRoom: '1組',
    identifier: 's2024045@school.ed.jp',
    displayOption: 'initial',
    destinationIdea: '沖縄（平和学習と自然環境保全）',
    message: '先輩方と一緒に伝統を繋いで、150周年を祝う修学旅行を実現させたいです。',
    agreedToTerms: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'sig-init-3',
    name: '鈴木 健一',
    role: 'parent',
    identifier: 'suzuki.parent@example.com',
    displayOption: 'real_name',
    destinationIdea: '長崎・広島または関西方面',
    message: '知道会（PTA）の一員としても応援しています。教室では学べない集団行動や体験学習は生徒たちの人生の糧になるはずです。',
    agreedToTerms: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'sig-init-4',
    name: '高橋 悠',
    role: 'alumni',
    identifier: 'takahashi.alumni@example.com',
    displayOption: 'anonymous',
    destinationIdea: '北海道（大自然での探究体験）',
    message: '私たちが在学中は行けず残念な思いをしました。150周年という素晴らしい記念の年にぜひ後輩たちに体験させてあげてほしいです！',
    agreedToTerms: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];
