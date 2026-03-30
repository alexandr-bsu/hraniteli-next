import type { ContactType } from '@/shared/types/application.types';

const STORAGE_KEY = 'app_contact';
const LEGACY_KEY = 'app_phone';

const DEFAULT_TYPE: ContactType = 'Telegram';

const KNOWN: ContactType[] = ['Telegram', 'VK', 'Max', 'WhatsApp', 'Phone'];

export function normalizeContactType(value: string | undefined | null): ContactType {
  if (!value) return DEFAULT_TYPE;
  const v = value.trim();
  const found = KNOWN.find((k) => k === v);
  if (found) return found;
  const lower = v.toLowerCase();
  if (lower === 'vk' || lower === 'вк') return 'VK';
  if (lower === 'max') return 'Max';
  if (lower === 'telegram' || lower === 'телеграм') return 'Telegram';
  return DEFAULT_TYPE;
}

export interface AppContactPayload {
  contact: string;
  contactType: ContactType;
}

/**
 * Читает контакт и тип: сначала `app_contact` (JSON), иначе legacy `app_phone`.
 */
export function getAppContactFromStorage(): AppContactPayload {
  if (typeof window === 'undefined') {
    return { contact: '', contactType: DEFAULT_TYPE };
  }

  const structured = localStorage.getItem(STORAGE_KEY);
  if (structured) {
    try {
      const p = JSON.parse(structured) as { contact?: unknown; contactType?: unknown };
      if (p && typeof p.contact === 'string') {
        return {
          contact: p.contact,
          contactType: normalizeContactType(String(p.contactType ?? DEFAULT_TYPE)),
        };
      }
    } catch {
      /* fall through */
    }
  }

  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy === null || legacy === '') {
    return { contact: '', contactType: DEFAULT_TYPE };
  }

  try {
    const parsed = JSON.parse(legacy) as unknown;
    if (typeof parsed === 'string') {
      return { contact: parsed, contactType: DEFAULT_TYPE };
    }
    if (parsed && typeof parsed === 'object' && parsed !== null) {
      const o = parsed as Record<string, unknown>;
      if (typeof o.phone === 'string') {
        return { contact: o.phone, contactType: normalizeContactType(String(o.contactType ?? DEFAULT_TYPE)) };
      }
      if (typeof o.contact === 'string') {
        return { contact: o.contact, contactType: normalizeContactType(String(o.contactType ?? DEFAULT_TYPE)) };
      }
    }
  } catch {
    return { contact: legacy, contactType: DEFAULT_TYPE };
  }

  return { contact: legacy, contactType: DEFAULT_TYPE };
}

export function persistAppContact(contact: string, contactType: ContactType): void {
  if (typeof window === 'undefined') return;
  const payload = { contact, contactType };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  localStorage.setItem(LEGACY_KEY, JSON.stringify(contact));
}

export function clearAppContactStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY);
}
