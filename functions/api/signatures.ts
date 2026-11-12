// Pages Functions (Worker ランタイム) — 署名 API
// GET  /api/signatures  … D1 の署名を新しい順に返す
// POST /api/signatures  … 署名を D1 に登録する (識別子の重複は 409)
// D1 バインディングは wrangler.toml の [[d1_databases]] (binding = "DB") で定義する。
// フロントは localStorage ではなくこの API を正とするため、
// どの端末から見ても同じ署名一覧になる。

type RoleType = 'student' | 'alumni' | 'parent' | 'faculty' | 'other';
type DisplayOption = 'real_name' | 'initial' | 'anonymous';

interface Signature {
  id: string;
  name: string;
  role: RoleType;
  grade?: string;
  classRoom?: string;
  identifier: string;
  displayOption: DisplayOption;
  destinationIdea?: string;
  message?: string;
  agreedToTerms: boolean;
  createdAt: string;
}

// D1 の型は @cloudflare/workers-types を入れていないため、使う分だけ最小限に定義する。
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB?: D1Database;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const ROLES: RoleType[] = ['student', 'alumni', 'parent', 'faculty', 'other'];
const DISPLAY_OPTIONS: DisplayOption[] = ['real_name', 'initial', 'anonymous'];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function toSignature(row: Record<string, unknown>): Signature {
  return {
    id: String(row.id),
    name: String(row.name),
    role: row.role as RoleType,
    grade: row.grade ? String(row.grade) : undefined,
    classRoom: row.class_room ? String(row.class_room) : undefined,
    // identifier (学籍番号/メール) は公開しない。フォームにも「公開されません」と
    // 書いてあるため、一覧 API では返さない。重複チェックは POST 時にサーバー側で行う。
    // 管理者用の全件 (identifier 付き) は D1 から直接出す (docs/D1_SETUP.md 参照)。
    identifier: '',
    displayOption: row.display_option as DisplayOption,
    destinationIdea: row.destination_idea ? String(row.destination_idea) : undefined,
    message: row.message ? String(row.message) : undefined,
    agreedToTerms: row.agreed_to_terms === 1 || row.agreed_to_terms === true,
    createdAt: String(row.created_at),
  };
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function onRequestGet({ env }: PagesContext): Promise<Response> {
  if (!env.DB) {
    return json({ error: 'D1 binding (DB) is not configured.' }, 500);
  }
  try {
    const { results } = await env.DB.prepare(
      // identifier は一覧では返さない (公開防止のため)
      `SELECT id, name, role, grade, class_room, display_option,
              destination_idea, message, agreed_to_terms, created_at
         FROM signatures
        ORDER BY created_at DESC
        LIMIT 1000`,
    ).all<Record<string, unknown>>();
    return json({ signatures: results.map(toSignature) });
  } catch (error) {
    console.error('Failed to list signatures', error);
    return json({ error: '署名一覧の取得に失敗しました。' }, 500);
  }
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (!env.DB) {
    return json({ error: 'D1 binding (DB) is not configured.' }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'リクエストの形式が正しくありません。' }, 400);
  }

  const name = asText(body.name);
  const identifier = asText(body.identifier);
  const identifierNormalized = identifier.toLowerCase();
  const role = asText(body.role) as RoleType;
  const displayOption = (asText(body.displayOption) || 'real_name') as DisplayOption;
  const grade = asText(body.grade) || undefined;
  const classRoom = asText(body.classRoom) || undefined;
  const destinationIdea = asText(body.destinationIdea) || undefined;
  const message = asText(body.message) || undefined;

  if (!name) return json({ error: '氏名を入力してください。' }, 400);
  if (!identifier) {
    return json({ error: '重複確認のための学籍番号またはメールアドレスを入力してください。' }, 400);
  }
  if (!ROLES.includes(role)) return json({ error: '属性が正しくありません。' }, 400);
  if (!DISPLAY_OPTIONS.includes(displayOption)) {
    return json({ error: '表示方法が正しくありません。' }, 400);
  }
  if (body.agreedToTerms !== true) {
    return json({ error: '趣旨および個人情報の取り扱いへの同意が必要です。' }, 400);
  }

  try {
    // 重複チェック (大文字・小文字を区別しない)
    const existing = await env.DB.prepare(
      'SELECT id FROM signatures WHERE identifier_normalized = ? LIMIT 1',
    )
      .bind(identifierNormalized)
      .first();
    if (existing) {
      return json(
        {
          error: `入力された学籍番号/メールアドレス「${identifier}」は既に署名済みです。重複登録は防止されています。`,
        },
        409,
      );
    }

    const signature: Signature = {
      id: `sig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      role,
      grade: role === 'student' ? grade : undefined,
      classRoom: role === 'student' ? classRoom : undefined,
      identifier,
      displayOption,
      destinationIdea,
      message,
      agreedToTerms: true,
      createdAt: new Date().toISOString(),
    };

    await env.DB.prepare(
      `INSERT INTO signatures
         (id, name, role, grade, class_room, identifier, identifier_normalized,
          display_option, destination_idea, message, agreed_to_terms, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    )
      .bind(
        signature.id,
        signature.name,
        signature.role,
        signature.grade ?? null,
        signature.classRoom ?? null,
        signature.identifier,
        identifierNormalized,
        signature.displayOption,
        signature.destinationIdea ?? null,
        signature.message ?? null,
        signature.createdAt,
      )
      .run();

    // 返す署名からは identifier を除く (一覧と同じ理由。提出者本人の入力値は
    // サーバーに保存済みで、画面表示には不要なため)
    return json({ signature: { ...signature, identifier: '' } }, 201);
  } catch (error) {
    console.error('Failed to create signature', error);
    return json({ error: '署名の保存に失敗しました。時間をおいて再度お試しください。' }, 500);
  }
}
