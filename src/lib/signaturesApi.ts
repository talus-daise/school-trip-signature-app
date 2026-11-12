import type { Signature } from '../types';

export type NewSignature = Omit<Signature, 'id' | 'createdAt'>;

interface ListResponse {
  signatures: Signature[];
}

interface CreateResponse {
  signature: Signature;
}

interface ErrorResponse {
  error?: string;
}

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as ErrorResponse;
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

/** D1 に保存された共有の署名一覧を取得する。 */
export async function fetchSignatures(): Promise<Signature[]> {
  const res = await fetch('/api/signatures');
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, '署名一覧の取得に失敗しました。'));
  }
  const data = (await res.json()) as ListResponse;
  return Array.isArray(data.signatures) ? data.signatures : [];
}

/** 署名を D1 に登録する。重複時はサーバーが 409 を返す。 */
export async function createSignature(
  input: NewSignature,
): Promise<Signature> {
  const res = await fetch('/api/signatures', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, '署名の保存に失敗しました。'));
  }
  const data = (await res.json()) as CreateResponse;
  return data.signature;
}
