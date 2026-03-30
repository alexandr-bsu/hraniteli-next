/**
 * Один источник правды для выбора мессенджера в форме контакта
 * (поле contactType в zod и в UI).
 */
export const CONTACT_METHOD_TYPES = ['Telegram', 'VK', 'Max'] as const;

export type ContactMethodOption = (typeof CONTACT_METHOD_TYPES)[number];

export const CONTACT_METHOD_OPTIONS: ReadonlyArray<{
  value: ContactMethodOption;
  label: string;
}> = [
  { value: 'Telegram', label: 'Telegram' },
  { value: 'VK', label: 'VK' },
  { value: 'Max', label: 'Max' },
];

export const CONTACT_ICON_PATH: Record<ContactMethodOption, string> = {
  Telegram: '/icons/contact/telegram.svg',
  VK: '/icons/contact/vk.svg',
  Max: '/icons/contact/max.svg',
};

const PRIVACY_HINT =
  'Рекламу не присылаем. Психологи не видят ваши контакты, пока вы сами не решите их показать.';

export type ContactMethodFieldCopy = {
  title: string;
  hint: string;
  inputLabel: string;
};

export const CONTACT_METHOD_FIELD_COPY: Record<ContactMethodOption, ContactMethodFieldCopy> = {
  Telegram: {
    title: 'Оставьте ник в Telegram или ссылку для связи',
    hint: PRIVACY_HINT,
    inputLabel: '@username или ссылка t.me/…',
  },
  VK: {
    title: 'Оставьте ссылку на профиль VK или ID для связи',
    hint: PRIVACY_HINT,
    inputLabel: 'Ссылка vk.com/… или ID',
  },
  Max: {
    title: 'Оставьте номер или ник в Max для связи',
    hint: PRIVACY_HINT,
    inputLabel: 'Номер телефона или ник в Max',
  },
};
