# Реализация функционала проекта «Старт практики» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать интеграцию пилотного проекта «Старт практики» для трех психологов: отображение карточек на главной странице Хранителей со специальным маркером, регистрационный вебхук в боте, фильтрация ленты заявок в боте только по бесплатным, ежемесячный лимит (1 отклик) и отправка корректных ссылок и уведомлений клиентам.

**Architecture:** 
- Поле `group = 'Старт практики'` в Supabase таблице `public.hraniteli_psychologists` определяет принадлежность специалиста к проекту.
- Фронтенд Next.js включает специалистов «Старт практики» в выдачу главной страницы (`/`), рендерит отличительную плашку «Старт практики» вместо стажа в сообществе и направляет клики на главную страницу каталога.
- n8n воркфлоу обеспечивают отдельный эндпоинт регистрации (`registration-psyco-start-practice`), фильтрацию заявок в ленте чат-бота строго по `psychologist_price = 'Бесплатно'`, декремент счетчика `clients_rp`, генерацию ссылки на карточку на главной странице, корректное сообщение клиенту и ежемесячный сброс лимита через Cron.

**Tech Stack:** Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS, Redux Toolkit), n8n (JSON workflows, JavaScript Code nodes, Supabase API/PostgreSQL nodes), Supabase (PostgreSQL).

**Spec:** [docs/superpowers/specs/2026-10-15-start-praktiki-design.md](file:///Users/jiil/projects/hraniteli-next/docs/superpowers/specs/2026-10-15-start-praktiki-design.md)

---

## Global Constraints

- Сохранять существующие стили и FSD архитектуру фронтенда.
- Соблюдать стандарт Canvas Layout и линейную структуру нод в n8n JSON-воркфлоу (шаги по X = 180-220px, без циклов назад).
- Использовать существующую колонку `clients_rp` для учета оставшихся откликов психолога.
- Не создавать отдельную вкладку фильтров на фронтенде — психологи «Старт практики» участвуют в общем каталоге главной страницы.
- Перед завершением обязательно прогнать `node /Users/jiil/.gemini/antigravity/brain/516ffa8c-0fd6-4980-bce9-52e31bf2d06b/scratch/agent-verification-loop.mjs`.

## Review Focus

1. Проверка `null` или `undefined` у поля `group` — не должно ломать рендер карточки или фильтрацию каталога.
2. Исключение платных заявок для «Старт практики» — заявки со стоимостью `300 руб`, `500 руб`, `1000 руб`, `1500 руб`, `2000 руб`, `3000 руб` не должны появляться в выдаче бота.
3. Исчерпание лимита откликов (`clients_rp <= 0`) — блокировка кнопки отклика с информативным сообщением без падения воркфлоу.
4. Корректность обратной ссылки клиенту (`/?selected_psychologist=...`, а не `/groups/?...`).
5. Валидность синтаксиса JSON во всех отредактированных воркфлоу n8n без поломки `step_id` и существующих связей.

---

### Task 1: Фронтенд — Фильтрация психологов по группам (`getPsychologistAll.ts`)

**Files:**
- Modify: `src/features/actions/getPsychologistAll.ts:17-27`

**Interfaces:**
- Consumes: API response `IPsychologist[]` из `https://cache-api.hrani.live/cards`
- Produces: Отфильтрованный массив `IPsychologist[]`, где на главной (`is_group === false`) присутствуют `'Сообщество'` и `'Старт практики'`, а в группах (`is_group === true`) — только остальные (Супервизии, Рука помощи).

- [ ] **Step 1: Проверить текущую логику фильтрации**
Просмотреть `src/features/actions/getPsychologistAll.ts`. Сейчас:
```typescript
if (is_group){
    data = data.filter((psy: any) => psy.group !== 'Сообщество')
} else {
    data = data.filter((psy: any) => psy.group === 'Сообщество')
}
```

- [ ] **Step 2: Обновить фильтрацию для поддержки «Старт практики»**
В `src/features/actions/getPsychologistAll.ts` обновить условия:
```typescript
if (is_group){
    // Фильтрация для страницы groups - исключаем "Сообщество" и "Старт практики"
    data = data.filter((psy: any) => psy.group !== 'Сообщество' && psy.group !== 'Старт практики')
} else {
    // Фильтрация для главной страницы - показываем "Сообщество" и "Старт практики"
    data = data.filter((psy: any) => psy.group === 'Сообщество' || psy.group === 'Старт практики')
}
```

- [ ] **Step 3: Проверить компиляцию TypeScript**
Run: `npx tsc --noEmit`
Expected: 0 errors в `src/features/actions/getPsychologistAll.ts`.

- [ ] **Step 4: Commit**
```bash
git add src/features/actions/getPsychologistAll.ts
git commit -m "feat(cards): include Start Praktiki psychologists on main catalog"
```

---

### Task 2: Фронтенд — Отображение маркера «Старт практики» на карточке (`Card.tsx`)

**Files:**
- Modify: `src/widgets/Card/Card.tsx:402-408`

**Interfaces:**
- Consumes: `psychologist: IPsychologist` с полем `group?: string`
- Produces: Плашка `<span className={styles.experience}>Старт практики</span>` без текста "в сообществе", если `psychologist.group === 'Старт практики'`.

- [ ] **Step 1: Изучить рендер плашки опыта в `src/widgets/Card/Card.tsx`**
Строки 402-408:
```tsx
<div className={`${styles.experienceWrapper} px-2 py-1 rounded-full w-fit bg-[#f5f5f5]`}>
    {psychologist.experience && (
        <span className={styles.experience}>
            {psychologist.experience} в сообществе
        </span>
    )}
```

- [ ] **Step 2: Реализовать рендер плашки для «Старт практики»**
Заменить блок на:
```tsx
<div className={`${styles.experienceWrapper} px-2 py-1 rounded-full w-fit bg-[#f5f5f5]`}>
    {psychologist.group === 'Старт практики' ? (
        <span className={styles.experience}>
            Старт практики
        </span>
    ) : (
        psychologist.experience && (
            <span className={styles.experience}>
                {psychologist.experience} в сообществе
            </span>
        )
    )}
    {psychologist.verified && (
        <Image
            src="/card/verified.svg"
            alt="Verified"
            width={23}
            height={23}
            style={{ marginLeft: '6px' }}
            unoptimized
        />
    )}
</div>
```

- [ ] **Step 3: Проверить подсказку тултипа**
Убедиться, что если `psychologist.group === 'Старт практики'`, текст тултипа нейтрален или адаптирован:
```tsx
<Tooltip
    text={psychologist.group === 'Старт практики'
        ? `${psychologist.name.split(" ")[1] || psychologist.name} — участник проекта «Старт практики» Хранителей`
        : `${psychologist.name.split(" ")[1]} как Хранитель придерживается этических правил и принципов сообщества, посещает супервизора, углубляет знания в психологии на наших мероприятиях`}
    customMargin="35%"
>
```

- [ ] **Step 4: Проверить компиляцию TypeScript**
Run: `npx tsc --noEmit`
Expected: 0 errors в `src/widgets/Card/Card.tsx`.

- [ ] **Step 5: Commit**
```bash
git add src/widgets/Card/Card.tsx
git commit -m "feat(ui): display Start Praktiki badge on psychologist card"
```

---

### Task 3: Фронтенд — Поддержка «Старт практики» в модальном окне подтверждения (`ConfirmPsychologistForm.tsx`)

**Files:**
- Modify: `src/widgets/HelpHandConfirmStages/ConfirmPsychologistForm.tsx:453-456, 698-735, 752-800`

**Interfaces:**
- Consumes: `currentPsychologist: IPsychologist`
- Produces: Корректный `basePath = "/"` для перехода на карточку, корректный бейдж «Старт практики» в шапке модалки и отображение основных параметров сессии.

- [ ] **Step 1: Обновить `getFilterQueryParams` (определение `basePath`)**
В строках 453-455:
```typescript
// Если психолог из Сообщества или Старт практики, направляем на главную страницу, иначе в /groups
const isMainPage = currentPsychologist?.group === "Сообщество" || currentPsychologist?.group === "Старт практики";
const basePath = isMainPage ? "/" : "/groups";
```

- [ ] **Step 2: Обновить бейдж опыта в шапке карточки модалки**
В строках 698-735 добавить обработку `group === "Старт практики"`:
```tsx
{currentPsychologist.group === "Старт практики" ? (
  <div className={`${styles_cards.experienceWrapper} px-2 py-1 rounded-full w-fit bg-[#f5f5f5]`}>
    <span className={`${styles_cards.experience} text-[12px] whitespace-nowrap`}>
      Старт практики
    </span>
    {currentPsychologist.verified && (
      <Image src="/card/verified.svg" alt="Verified" width={23} height={23} style={{ marginLeft: '6px' }} unoptimized />
    )}
  </div>
) : currentPsychologist.group !== "Сообщество" ? (
  // Существующая плашка для Супервизий / Руки помощи
  ...
) : (
  // Существующая плашка для Сообщества
  ...
)}
```

- [ ] **Step 3: Проверить сетку параметров сессии (подход, формат, стоимость)**
Убедиться, что условие `currentPsychologist.group === "Сообщество" || currentPsychologist.group === "Старт практики"` корректно отображает 3 колонки сетки (десктоп/мобайл) и стоимость сессии.

- [ ] **Step 4: Проверить компиляцию TypeScript**
Run: `npx tsc --noEmit`
Expected: 0 errors в проекте.

- [ ] **Step 5: Commit**
```bash
git add src/widgets/HelpHandConfirmStages/ConfirmPsychologistForm.tsx
git commit -m "feat(ui): support Start Praktiki in ConfirmPsychologistForm"
```

---

### Task 4: n8n — Добавление ветки регистрации `registration-psyco-start-practice`

**Files:**
- Modify: `n8n/workflows/Регистрация психолога.json`

**Interfaces:**
- Consumes: Webhook POST `/webhook/registration-psyco-start-practice` с телом `{"telegram id": string|number, "psycologist"?: string}`
- Produces: Созданная запись в `public.hraniteli_psychologists` с `group: "Старт практики"`, `clients_rp: 1`, `allow_assignment: false`, `subscribtion_payment_amount: 0`, `send_payment_link: false`, и ответ `{ "short_link": "https://..." }` на анкету `https://hrani.live/psy-info?psychologist_id={{ $json.telegram_id }}`.

- [ ] **Step 1: Изучить существующую структуру веток в `Регистрация психолога.json`**
Посмотреть узел `registration-psyco-rp` (webhook -> get psychologist -> Supabase insert -> short link -> response).

- [ ] **Step 2: Добавить узел Webhook `registration-psyco-start-practice`**
Параметры ноды:
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "registration-psyco-start-practice",
    "responseMode": "responseNode",
    "options": {}
  },
  "name": "Регистрация психолога Старт практики",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2
}
```

- [ ] **Step 3: Добавить ноды проверки существования, создания в Supabase и генерации короткой ссылки**
Установить поля в ноде Supabase:
- `group`: `"Старт практики"`
- `clients_rp`: `"1"`
- `allow_assignment`: `"false"`
- `subscribtion_payment_amount`: `"0"`
- `send_payment_link`: false
- `is_onboarding_finished`: false
- `body` для короткой ссылки: `=https://hrani.live/psy-info?psychologist_id={{ $json.telegram_id }}`

- [ ] **Step 4: Проверить валидность JSON**
Run: `python3 -m json.tool "n8n/workflows/Регистрация психолога.json" > /dev/null`
Expected: 0 errors.

- [ ] **Step 5: Commit**
```bash
git add "n8n/workflows/Регистрация психолога.json"
git commit -m "feat(n8n): add registration-psyco-start-practice webhook branch"
```

---

### Task 5: n8n — Фильтрация ленты заявок для «Старт практики» (`Получить все заявки из руки помощи.json`)

**Files:**
- Modify: `n8n/workflows/Получить все заявки из руки помощи.json`

**Interfaces:**
- Consumes: Запрос в чат-боте на получение заявок для психолога с `group = 'Старт практики'`
- Produces: Выдача ленты только бесплатных заявок (`psychologist_price = 'Бесплатно'`), проверка `clients_rp > 0` перед формированием ссылки бронирования.

- [ ] **Step 1: Найти ноду выборки заявок из Supabase / REST API**
В `n8n/workflows/Получить все заявки из руки помощи.json` проверить `filterString`:
```javascript
$('Получаем психолога4').first().json.group == 'Сообщество'
  ? ''
  : '&or=(psychologist_price.eq.Бесплатно,psychologist_price.eq.300 руб,psychologist_price.eq.500 руб)'
```

- [ ] **Step 2: Обновить фильтрацию для «Старт практики»**
Если `group == 'Старт практики'` -> добавлять фильтр строго `&psychologist_price.eq.Бесплатно`:
```javascript
{{
  $('Получаем психолога4').first().json.group == 'Сообщество'
    ? ''
    : $('Получаем психолога4').first().json.group == 'Старт практики'
      ? '&psychologist_price.eq.Бесплатно'
      : '&or=(psychologist_price.eq.Бесплатно,psychologist_price.eq.300 руб,psychologist_price.eq.500 руб)'
}}
```

- [ ] **Step 3: Обновить логику `get_book_link()` и проверку лимита**
В JS Code нодах формирования сообщения (ноды `Получаем ссылку на бронирование` / `Формируем сообщение`):
Добавить проверку:
```javascript
const is_start_praktiki = $('Получаем психолога').first().json.group == "Старт практики";
if (is_start_praktiki) {
  if ($('Получаем психолога').first().json.clients_rp <= 0) {
    return "К сожалению, у вас закончился ежемесячный лимит откликов (1 клиент). Новый отклик будет начислен 1-го числа следующего месяца 🙏";
  }
  if ($('Получить заявку').item.json.psychologist_price != "Бесплатно") {
    return "Для психологов проекта «Старт практики» доступны только бесплатные заявки 🙏";
  }
  return `<a href="${$input.item.json.short_link}">Ссылка для бронирования клиента</a>`;
}
```

- [ ] **Step 4: Проверить валидность JSON**
Run: `python3 -m json.tool "n8n/workflows/Получить все заявки из руки помощи.json" > /dev/null`
Expected: 0 errors.

- [ ] **Step 5: Commit**
```bash
git add "n8n/workflows/Получить все заявки из руки помощи.json"
git commit -m "feat(n8n): restrict ticket feed to free tickets for Start Praktiki"
```

---

### Task 6: n8n — Генерация ссылки на профиль и уведомления клиента (`Бронируем заявку руки помощи психологом.json`)

**Files:**
- Modify: `n8n/workflows/Бронируем заявку руки помощи психологом.json`

**Interfaces:**
- Consumes: Выбор заявки психологом из группы «Старт практики»
- Produces: Ссылка на профиль `https://psy.hrani.live/?selected_psychologist=${name}`, текст уведомления клиенту «из проекта «Старт практики»», декремент `clients_rp = clients_rp - 1`.

- [ ] **Step 1: Обновить формирование ссылки на профиль психолога**
В ноде генерации ссылки (строка 842):
```javascript
body: {{ ($('Получаем психолога').first().json.group == 'Сообщество' || $('Получаем психолога').first().json.group == 'Старт практики') ? `https://psy.hrani.live/?selected_psychologist=${$('Получаем психолога').first().json.name}` : `https://psy.hrani.live/groups/?selected_psychologist=${$('Получаем психолога').first().json.name}` }}
```

- [ ] **Step 2: Обновить текст уведомления клиенту**
В ноде отправки сообщения клиенту (строка 1241):
```javascript
Вашу заявку выбрал психолог ${
  $('Получаем психолога').first().json.group == 'Сообщество' 
    ? 'из нашего сообщества' 
    : $('Получаем психолога').first().json.group == 'Супервизии' 
      ? 'из нашей супервизионной группы' 
      : $('Получаем психолога').first().json.group == 'Старт практики'
        ? 'из проекта «Старт практики»'
        : 'из проекта Рука помощи'
} - <b>${$('Получаем психолога').first().json.name}</b>.
```

- [ ] **Step 3: Проверить валидность JSON**
Run: `python3 -m json.tool "n8n/workflows/Бронируем заявку руки помощи психологом.json" > /dev/null`
Expected: 0 errors.

- [ ] **Step 4: Commit**
```bash
git add "n8n/workflows/Бронируем заявку руки помощи психологом.json"
git commit -m "feat(n8n): update profile link and client notification for Start Praktiki"
```

---

### Task 7: n8n — Cron-воркфлоу ежемесячного пополнения лимитов

**Files:**
- Create: `n8n/workflows/Пополнение лимитов Старт практики.json`

**Interfaces:**
- Consumes: Cron-триггер `0 0 1 * *` (1-е число месяца в 00:00)
- Produces: SQL Update в Supabase: `UPDATE hraniteli_psychologists SET clients_rp = 1 WHERE group = 'Старт практики'`.

- [ ] **Step 1: Создать файл воркфлоу `Пополнение лимитов Старт практики.json`**
Содержит Schedule Trigger (`0 0 1 * *`) и Postgres / Supabase node:
```sql
UPDATE hraniteli_psychologists
SET clients_rp = 1
WHERE "group" = 'Старт практики';
```

- [ ] **Step 2: Проверить валидность JSON**
Run: `python3 -m json.tool "n8n/workflows/Пополнение лимитов Старт практики.json" > /dev/null`
Expected: 0 errors.

- [ ] **Step 3: Commit**
```bash
git add "n8n/workflows/Пополнение лимитов Старт практики.json"
git commit -m "feat(n8n): add monthly replenishment cron workflow for Start Praktiki"
```

---

### Task 8: Комплексная верификация, Memora & Graphify

**Files:**
- Modify: `docs/superpowers/plans/2026-10-15-start-praktiki.md`

- [ ] **Step 1: Запустить агентную верификацию**
Run: `node /Users/jiil/.gemini/antigravity/brain/516ffa8c-0fd6-4980-bce9-52e31bf2d06b/scratch/agent-verification-loop.mjs`
Expected: 0 critical errors.

- [ ] **Step 2: Зафиксировать архитектурные решения в Memora**
Вызвать MCP-инструмент `memory_create`:
- Секция: `architecture` / `n8n`
- Содержание: Описание группы «Старт практики», контракта вебхука `registration-psyco-start-practice` и правил отклика на бесплатные заявки.

- [ ] **Step 3: Обновить граф знаний Graphify**
Run: `graphify update .`
Expected: Graph updated.

- [ ] **Step 4: Финальный Commit**
```bash
git commit -m "chore: complete Start Praktiki integration and documentation"
```
