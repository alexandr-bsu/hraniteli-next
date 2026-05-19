/**
 * Поток бесплатной/донатной записи в application_form:
 * - после исследовательской анкеты (?research=true)
 * - со страницы записи / iframe (?zapis=1)
 */
export function isApplicationDonationEntry(searchParams: { get: (key: string) => string | null }): boolean {
  return searchParams.get('research') === 'true' || searchParams.get('zapis') === '1';
}

/** Подмена поля promocode в заявке для донатных входов (иначе из localStorage). */
export function getApplicationDonationPromocodeNote(searchParams: {
  get: (key: string) => string | null;
}): string | null {
  if (searchParams.get('research') === 'true') {
    return 'Клиент перешёл из исследовательской анкеты';
  }
  if (searchParams.get('zapis') === '1') {
    return 'Клиент со страницы записи к психологу (zapis=1)';
  }
  return null;
}
