import { describe, it, expect } from 'vitest';
import {
  calculateStats,
  isDuplicate,
  formatDisplayName,
  exportToCSV,
  generateSummaryReport,
} from '../utils/petitionUtils';
import type { Signature } from '../types';

describe('Petition Utilities', () => {
  const sampleSignatures: Signature[] = [
    {
      id: '1',
      name: '山田 太郎',
      role: 'student',
      grade: '2年生',
      classRoom: '1組',
      identifier: 's1001@school.ed.jp',
      displayOption: 'real_name',
      destinationIdea: '京都・奈良',
      message: 'みんなで行きたい！',
      agreedToTerms: true,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: '佐藤 花子',
      role: 'student',
      grade: '1年生',
      classRoom: '2組',
      identifier: 's1002@school.ed.jp',
      displayOption: 'initial',
      destinationIdea: '沖縄',
      message: '平和学習を深めたい',
      agreedToTerms: true,
      createdAt: '2025-01-02T00:00:00.000Z',
    },
    {
      id: '3',
      name: '鈴木 一郎',
      role: 'parent',
      identifier: 'parent.suzuki@example.com',
      displayOption: 'anonymous',
      destinationIdea: '',
      message: '知道会（PTA）としても応援します',
      agreedToTerms: true,
      createdAt: '2025-01-03T00:00:00.000Z',
    },
  ];

  describe('calculateStats', () => {
    it('correctly calculates total, percentage, and roles', () => {
      const stats = calculateStats(sampleSignatures, 10);
      expect(stats.total).toBe(3);
      expect(stats.goal).toBe(10);
      expect(stats.percentage).toBe(30);
      expect(stats.byRole.student).toBe(2);
      expect(stats.byRole.parent).toBe(1);
      expect(stats.byGrade['1年生']).toBe(1);
      expect(stats.byGrade['2年生']).toBe(1);
    });

    it('caps percentage at 100%', () => {
      const stats = calculateStats(sampleSignatures, 2);
      expect(stats.percentage).toBe(100);
    });
  });

  describe('isDuplicate', () => {
    it('detects case-insensitive duplicate identifiers', () => {
      expect(isDuplicate(sampleSignatures, 'S1001@SCHOOL.ED.JP')).toBe(true);
      expect(isDuplicate(sampleSignatures, 'parent.suzuki@example.com')).toBe(true);
      expect(isDuplicate(sampleSignatures, 'new_person@example.com')).toBe(false);
    });

    it('ignores empty identifiers or self match when id provided', () => {
      expect(isDuplicate(sampleSignatures, '')).toBe(false);
      expect(isDuplicate(sampleSignatures, '   ')).toBe(false);
      expect(isDuplicate(sampleSignatures, 's1001@school.ed.jp', '1')).toBe(false);
    });
  });

  describe('formatDisplayName', () => {
    it('formats real names, initials, and anonymity properly', () => {
      expect(formatDisplayName(sampleSignatures[0])).toBe('山田 太郎');
      expect(formatDisplayName(sampleSignatures[1])).toBe('佐. 花.');
      expect(formatDisplayName(sampleSignatures[2])).toBe('匿名希望の賛同者');
    });
  });

  describe('exportToCSV', () => {
    it('generates valid CSV format with headers and quotes', () => {
      const csv = exportToCSV(sampleSignatures);
      expect(csv).toContain('署名ID,氏名,属性,学年,クラス,識別子(学籍番号/メール),表示設定,希望・アイデア,メッセージ,署名日時');
      expect(csv).toContain('"山田 太郎"');
      expect(csv).toContain('"s1001@school.ed.jp"');
      expect(csv).toContain('"京都・奈良"');
    });
  });

  describe('generateSummaryReport', () => {
    it('generates printable summary text mentioning 150th anniversary and 知道会', () => {
      const report = generateSummaryReport(sampleSignatures, 10);
      expect(report).toContain('創立150周年記念');
      expect(report).toContain('保護者（知道会会員）: 1名');
      expect(report).toContain('総署名数: 3名');
      expect(report).toContain('京都・奈良');
    });
  });
});
