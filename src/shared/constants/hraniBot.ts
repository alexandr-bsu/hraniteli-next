/** Ссылки в ботов записи; username / peer id менять здесь. */
export const HRANI_TELEGRAM_BOT_USERNAME = 'HraniLiveBot' as const;
export const HRANI_VK_WRITE_PEER_ID = '230628314' as const;

export function telegramBotDeepLink(linkId: string): string {
  return `https://t.me/${HRANI_TELEGRAM_BOT_USERNAME}?start=${linkId}`;
}

export function vkBotWriteUrl(refId: string): string {
  return `https://vk.com/write-${HRANI_VK_WRITE_PEER_ID}?ref=${refId}`;
}
