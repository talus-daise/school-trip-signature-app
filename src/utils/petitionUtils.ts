import type { Signature, PetitionStats, RoleType } from '../types';

export function calculateStats(signatures: Signature[], goal: number = 300): PetitionStats {
  const total = signatures.length;
  const percentage = Math.min(100, Math.round((total / goal) * 100));

  const byRole: Record<RoleType, number> = {
    student: 0,
    alumni: 0,
    parent: 0,
    faculty: 0,
    other: 0,
  };

  const byGrade: Record<string, number> = {
    '1年生': 0,
    '2年生': 0,
    '3年生': 0,
    'その他': 0,
  };

  signatures.forEach((sig) => {
    if (byRole[sig.role] !== undefined) {
      byRole[sig.role]++;
    } else {
      byRole.other++;
    }

    if (sig.role === 'student' && sig.grade) {
      if (byGrade[sig.grade] !== undefined) {
        byGrade[sig.grade]++;
      } else {
        byGrade['その他']++;
      }
    }
  });

  return {
    total,
    goal,
    percentage,
    byRole,
    byGrade,
  };
}

export function isDuplicate(
  signatures: Signature[],
  identifier: string,
  currentId?: string
): boolean {
  const cleanId = identifier.trim().toLowerCase();
  if (!cleanId) return false;
  return signatures.some(
    (sig) =>
      sig.identifier.trim().toLowerCase() === cleanId &&
      (!currentId || sig.id !== currentId)
  );
}

export function formatDisplayName(sig: Signature): string {
  if (sig.displayOption === 'anonymous') {
    return '匿名希望の賛同者';
  }
  if (sig.displayOption === 'initial') {
    const parts = sig.name.trim().split(/\s+/);
    if (parts.length > 1) {
      return `${parts[0][0]}. ${parts[1][0]}.`;
    }
    return `${sig.name.trim()[0]}.`;
  }
  return sig.name;
}

export function exportToCSV(signatures: Signature[]): string {
  const headers = [
    '署名ID',
    '氏名',
    '属性',
    '学年',
    'クラス',
    '識別子(学籍番号/メール)',
    '表示設定',
    '希望・アイデア',
    'メッセージ',
    '署名日時',
  ];

  const escapeCSV = (val: string | undefined) => {
    if (!val) return '""';
    const escaped = val.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = signatures.map((sig) => [
    escapeCSV(sig.id),
    escapeCSV(sig.name),
    escapeCSV(sig.role),
    escapeCSV(sig.grade || '-'),
    escapeCSV(sig.classRoom || '-'),
    escapeCSV(sig.identifier),
    escapeCSV(sig.displayOption),
    escapeCSV(sig.destinationIdea || '-'),
    escapeCSV(sig.message || '-'),
    escapeCSV(new Date(sig.createdAt).toLocaleString('ja-JP')),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

export function generateSummaryReport(signatures: Signature[], goal: number = 300): string {
  const stats = calculateStats(signatures, goal);
  const now = new Date().toLocaleDateString('ja-JP');

  return `【学校創立150周年記念 修学旅行復活に向けた署名集計報告書】
提出日: ${now}
発起人: 修学旅行復活プロジェクト有志・生徒会

■ 集計概要
・目標署名数: ${stats.goal}名
・現在の総署名数: ${stats.total}名 (達成率: ${stats.percentage}%)

■ 内訳（属性別）
・在校生: ${stats.byRole.student}名
  - 1年生: ${stats.byGrade['1年生']}名
  - 2年生: ${stats.byGrade['2年生']}名
  - 3年生: ${stats.byGrade['3年生']}名
・保護者（知道会会員）: ${stats.byRole.parent}名
・卒業生: ${stats.byRole.alumni}名
・教職員: ${stats.byRole.faculty}名
・地域・学校関係者: ${stats.byRole.other}名

■ 寄せられた代表的な生徒・賛同者の声（抜粋）
${signatures
  .filter((s) => s.message && s.message.trim().length > 0)
  .slice(0, 5)
  .map(
    (s, idx) =>
      `${idx + 1}. [${s.role === 'student' ? `${s.grade || '生徒'} ` : ''}${formatDisplayName(s)}]「${s.message}」`
  )
  .join('\n')}

■ 要望・目的地アイデアの上位傾向
${signatures
  .filter((s) => s.destinationIdea && s.destinationIdea.trim().length > 0)
  .slice(0, 5)
  .map((s) => `・${s.destinationIdea}`)
  .join('\n')}
`;
}
