-- 署名テーブル。D1 (SQLite) に全端末で共有する署名を保存する。
-- identifier_normalized は重複チェック用 (trim + 小文字化した学籍番号/メールアドレス)。
CREATE TABLE IF NOT EXISTS signatures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'alumni', 'parent', 'faculty', 'other')),
  grade TEXT,
  class_room TEXT,
  identifier TEXT NOT NULL,
  identifier_normalized TEXT NOT NULL,
  display_option TEXT NOT NULL DEFAULT 'real_name'
    CHECK (display_option IN ('real_name', 'initial', 'anonymous')),
  destination_idea TEXT,
  message TEXT,
  agreed_to_terms INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_signatures_identifier_normalized
  ON signatures (identifier_normalized);

CREATE INDEX IF NOT EXISTS idx_signatures_created_at
  ON signatures (created_at DESC);
