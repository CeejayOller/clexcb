import { cookies } from 'next/headers'
import type { RequestCookie, ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export type CookieOptions = Partial<Omit<ResponseCookie, 'name' | 'value'>>

export async function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const cookieStore = await cookies();
  if (!cookieStore.set) {
    throw new Error('Cookie store not available');
  }
  return cookieStore.set(name, value, {
    path: '/',
    ...options,
  });
}

export async function getCookie(name: string): Promise<RequestCookie | undefined> {
  const cookieStore = await cookies();
  if (!cookieStore.get) {
    return undefined;
  }
  return cookieStore.get(name);
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  if (!cookieStore.delete) {
    return;
  }
  return cookieStore.delete(name);
}