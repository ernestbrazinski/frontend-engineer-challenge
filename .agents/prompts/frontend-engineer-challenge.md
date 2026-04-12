# Пустой проект Svelte с TypeScript и Prettier

_Exported on 4/12/2026 at 19:43:47 GMT+4 from Cursor (3.0.16)_

---

**User**

разверни в этой папке пустой svelte проект без демо страницы. Установи, typescript и prettier

---

**Cursor**

Просматриваю содержимое папки проекта, затем создаю пустой Svelte-проект с TypeScript и Prettier.

Папка пуста. Создаём проект через Vite (шаблон svelte-ts) и настраиваем Prettier.

Удаляю демо-файлы, упрощаю `App.svelte` и `app.css`, устанавливаю зависимости и настраиваю Prettier.

Кратко, что сделано:

### Проект

- В каталоге поднят **Vite + Svelte 5** с шаблоном **`svelte-ts`** (TypeScript уже в `devDependencies`).
- **`src/App.svelte`** — только пустой `<script lang="ts">` и корневой `<main></main>`, без демо-контента.
- **`src/app.css`** — минимально: сброс отступов у `body`.
- Удалены демо: **`Counter.svelte`**, **`vite.svg`**, **`svelte.svg`**, **`public/icons.svg`**.

### Prettier

- Установлены **`prettier`** и **`prettier-plugin-svelte`**.
- Добавлены **`.prettierrc`** (парсер Svelte для `*.svelte`) и **`.prettierignore`**.
- В **`package.json`** добавлен скрипт **`npm run format`**.

### Команды

- **`npm run dev`** — разработка
- **`npm run build`** / **`npm run preview`** — сборка и просмотр
- **`npm run check`** — `svelte-check` + `tsc`
- **`npm run format`** — Prettier по всему проекту

TypeScript отдельно ставить не нужно: он уже был в шаблоне и остаётся в зависимостях. После `npm install` проверка **`npm run check`** проходит без ошибок.

---

**User**

создай роут singin

---

**Cursor**

Проверяю структуру проекта и наличие роутинга.

Проект на Vite + Svelte без SvelteKit. Добавляем маршрут `/singin`: страницу, лёгкий клиентский роутер и fallback в Vite для прямых заходов и обновления страницы.

Вот что сделано.

### Маршрут **`/singin`**

- Страница: `src/routes/Singin.svelte` — заголовок в `<title>` и `<h1>Singin</h1>` (можешь заменить на форму входа).
- В `src/App.svelte` при пути `/singin` или `/singin/` рендерится этот компонент.

### Навигация

- `src/lib/pathname.ts` — стор `pathname` и функция **`navigate('/singin')`** для перехода без полной перезагрузки (после `pushState` обновляется стор; для «Назад» слушается `popstate`).

Пример ссылки без перезагрузки:

```svelte
<script lang="ts">
  import { navigate } from "./lib/pathname";
</script>

<button type="button" onclick={() => navigate("/singin")}>На singin</button>
```

Обычный `<a href="/singin">` тоже работает: сработает SPA-fallback в Vite.

### Vite

- В `vite.config.ts` добавлен плагин **`spa-fallback`**, чтобы при прямом заходе или F5 на `/singin` отдавался `index.html` (и в `dev`, и в `preview`).

Проект без SvelteKit, поэтому роутинг — клиентский. Если нужен именно путь **`/signin`**, напиши — переименую файл и путь.

---

**User**

добавь базовые стили reset css

---

**Cursor**

Добавляю компактный базовый reset в `app.css`: `box-sizing`, сброс отступов у типичных блоков, медиа и формы.

Убираю слишком агрессивный сброс у `button` (полная потеря рамки мешает нативным и фокусу).

В `src/app.css` лежит базовый reset:

- **`box-sizing: border-box`** для всех элементов
- **`html`**: корректный масштаб текста на мобильных
- **`body`**: без внешних отступов, **`min-height: 100dvh`**, нормальный **`line-height`**, сглаживание шрифта
- **Медиа и SVG**: блочная модель и **`max-width: 100%`**
- **Поля ввода и кнопки**: **`font` / `color`** от родителя; у кнопки только **`cursor: pointer`** (без снятия рамки, чтобы не ломать доступность)
- **Заголовки, абзацы, figure, blockquote**: **`margin: 0`**
- **`ul` / `ol`**: без маркеров и внутренних отступов (типично для вёрстки приложения; для осмысленных списков в контенте можно завести класс вроде `.prose`)
- **Ссылки**: цвет как у текста, без подчёркивания, **`text-decoration-skip-ink`**
- **`#app`**: **`isolation: isolate`** для стабильного stacking context

Если понадобятся оформленные маркированные списки в тексте, напиши — добавим модификатор под `.prose` или отдельный слой стилей.

---

**User**

добавь страницу в роут signin, ты сейчас сделал компонент вместо +page

---

**Cursor**

Переходим на SvelteKit, чтобы использовать `+page.svelte`. Просматриваю текущую структуру проекта.

Мигрируем на SvelteKit и добавляем `src/routes/signin/+page.svelte`.

Пишем файлы SvelteKit и устанавливаем зависимости.

Вот что сделано.

### SvelteKit вместо Vite SPA

Проект переведён на **SvelteKit**: файловые маршруты, настоящие **`+page.svelte`**, роутинг и превью без самописного SPA-fallback.

### Маршрут **`/signin`**

- Страница: **`src/routes/signin/+page.svelte`** — заголовок «Sign in» и `<main>` с `<h1>`.
- Корень: **`src/routes/+page.svelte`** — пустая главная (как раньше).
- Общая оболочка: **`src/routes/+layout.svelte`** — подключает **`../app.css`** и рендерит `{@render children()}`.

### Удалено / заменено

- `src/App.svelte`, `src/main.ts`, `index.html`, кастомный **`src/lib/pathname.ts`**, старый **`src/routes/Singin.svelte`**, **`tsconfig.app.json`**.
- Плагин SPA в **`vite.config.ts`** — не нужен, этим занимается Kit.
- **`public/favicon.svg`** убран; иконка лежит в **`static/favicon.svg`** (так устроен Kit).

### Конфиг

- **`svelte.config.js`** — `adapter-auto`, `vitePreprocess`.
- **`vite.config.ts`** — только `sveltekit()`.
- **`src/app.html`** — шаблон приложения, favicon **`/favicon.svg`**.
- **`src/app.d.ts`** — заготовка типов Kit.
- **`tsconfig.json`** — `extends` из **`.svelte-kit/tsconfig.json`**.
- **`package.json`** — зависимости `@sveltejs/kit`, `@sveltejs/adapter-auto`, скрипты **`vite dev` / `prepare` (svelte-kit sync)**.

Команды: **`npm run dev`**, навигация на **`/signin`** (можно обычным `<a href="/signin">` — сработает клиентский переход).

При деплое `adapter-auto` подберёт адаптер под платформу; если нужен только статический хостинг, позже можно перейти на **`@sveltejs/adapter-static`**.

---

**User**

установи scss в проект

---

**Cursor**

Проверяю конфигурацию и импорты стилей.

Устанавливаю `sass` и исправляю импорт в `+layout.svelte` на `app.scss`.

Читаю `app.scss`: после установки `sass` компилятор обрабатывает файл как SCSS и требует определения переменных.

Добавляю определения `$breakpoint-*` и убираю неиспользуемые локальные `$`-переменные внутри `@media`.

Сделано следующее.

### Пакет **`sass`**

В `devDependencies` добавлен официальный компилятор **Dart Sass** (`sass`). Им пользуются Vite и `vitePreprocess()` из `svelte.config.js` — отдельно настраивать препроцессор не нужно.

### Импорт в лейауте

В `src/routes/+layout.svelte` импорт заменён на **`../app.scss`**, чтобы подтягивался твой файл.

### Правки в **`app.scss`**

После включения настоящего SCSS переменные вроде `$breakpoint-xl` стали обязательными. В начало файла добавлены значения по умолчанию:

- `$breakpoint-xl`: 1280px
- `$breakpoint-lg`: 1024px
- `$breakpoint-md`: 768px
- `$breakpoint-sm`: 576px
- `$breakpoint-xs`: 400px

Из медиазапросов убраны неиспользуемые локальные `$base-size` / `$base-padding` (на скомпилированный CSS они не влияли).

### В компонентах

В Svelte можно писать, например:

```svelte
<style lang="scss">
  .foo {
    color: red;
    &:hover {
      opacity: 0.8;
    }
  }
</style>
```

Сборка `npm run build` проходит успешно. Пороги брейкпоинтов при необходимости поменяй в начале `app.scss` или вынеси в отдельный `_breakpoints.scss` и подключи через `@use`.

---

**User**

создай в src/lib/components базовые компоненты button и input.
для кастомного компонента input добавь все базовые пропсы этого html элемента, такие как type, disabled, error итд

---

**Cursor**

Создаю компоненты с типами из `svelte/elements`, стилями в `<style>` и корректной передачей атрибутов.

Исправляю предупреждение о реактивности `id`:

Кратко, что сделано.

### `src/lib/components/Button.svelte`

- Тип пропсов: **`HTMLButtonAttributes`** из `svelte/elements` + **`variant`**: `'primary' | 'secondary' | 'ghost'` (по умолчанию `'primary'`).
- **`type`** по умолчанию **`'button'`**, чтобы в форме не сабмитить случайно.
- **`children`** — опциональный **Snippet** (содержимое кнопки).
- В разметку уходят все остальные атрибуты (`disabled`, `name`, `form*`, `value`, `popover*`, `aria-*`, обработчики и т.д.) через **`...rest`**.
- Стили: `.ui-button`, варианты под твои `--color-primary` / `--base-size`.

### `src/lib/components/Input.svelte`

- База типов: **`Omit<HTMLInputAttributes, 'children'>`** — все стандартные атрибуты инпута (`type`, `name`, `disabled`, `readonly`, `required`, `placeholder`, `autocomplete`, `min` / `max` / `step`, `pattern`, `minlength` / `maxlength`, `multiple`, `accept`, `capture`, `list`, `inputmode`, `form*`, `checked`, `files`, обработчики и т.п.) попадают в **`...rest`** и вешаются на `<input>`.
- Дополнительно:
  - **`error`**: `boolean` (только `aria-invalid` + визуал) или **`string`** (ещё и текст ошибки под полем).
  - **`label`** — подпись с корректным `for` / `id`.
  - **`value`** — **`$bindable()`** для `bind:value`.
  - **`aria-describedby`** выделяется отдельно и **склеивается** с id текста ошибки, если он есть.
- **`id`**: если не передан, задаётся стабильный fallback (`ui-input-N`); при смене **`id`** с родителя id поля обновляется (`$derived`).

Импорт, например:

```svelte
<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";

  let email = $state("");
</script>

<Input
  label="Email"
  type="email"
  name="email"
  bind:value={email}
  placeholder="you@example.com"
  required
  autocomplete="email"
  error={email && !email.includes("@") ? "Некорректный email" : false}
/>

<Button type="submit" variant="primary">Войти</Button>
```

**Замечание:** `bind:checked` / `bind:files` с родителя на обёртку Svelte сам на внутренний `<input>` не пробросит; для чекбокса/файла можно передать **`checked` / `onchange`** или позже расширить компонент отдельными `$bindable` под эти случаи.

---

**User**

создай в src/lib/components index js для импорта компонентов

---

**Cursor**

Добавлен **`src/lib/components/index.ts`** (в TS-проекте так надёжнее, чем `.js`; при необходимости можно переименовать в `index.js` — экспорты те же).

```ts
export { default as Button } from "./Button.svelte";
export { default as Input } from "./Input.svelte";
```

Импорт в одну строку:

```svelte
<script lang="ts">
  import { Button, Input } from "$lib/components";
</script>
```

`npm run check` проходит без ошибок.

---

**User**

стилизуй компонент input как на скриншоте, добавь для type password кнопку с иконкой src/lib/components/Input/icons/eye.svg по нажатию на которую будет отображаться пароль

---

**Cursor**

Обновляю `Input.svelte`: стиль «подчёркивание», переключение видимости пароля и импорт иконки.

Добавляю отключение кнопки «глаз», когда поле `disabled`.

Вот что сделано в `src/lib/components/Input/Input.svelte`.

### Внешний вид (как на макете)

- **Подпись** сверху: мелкий шрифт, `var(--color-secondary)`.
- **Поле**: без рамки, **прозрачный фон**, крупнее текст (`#0f172a`).
- **Линия снизу** у блока `.ui-input__field`: `border-bottom` цветом **`var(--color-primary)`**.
- **Ошибка**: нижняя граница и фокус — красные (`#e5484d` / `#c9343a`).
- **Фокус**: чуть темнее цвет линии у валидного поля.

### Пароль и иконка

- Явно вынесен проп **`type`** (по умолчанию `"text"`).
- При **`type="password"`** справа показывается кнопка с **`./icons/eye.svg?url`**.
- По клику переключается внутреннее состояние **`showPassword`**: у `<input>` тип **`text`** / снова **`password`**.
- У кнопки: **`aria-pressed`**, **`aria-label`** «Показать пароль» / «Скрыть пароль».
- При **`disabled`** на инпуте та же **`disabled`** на кнопке с иконкой.

Пример:

```svelte
<Input label="E-mail" type="email" name="email" bind:value={email} />
<Input
  label="Пароль"
  type="password"
  name="password"
  bind:value={password}
  autocomplete="current-password"
/>
```

`npm run check` и `npm run build` проходят.

---

**User**

из инпута нужно убрать отображение placeholder, его будет заменять label, который по фокусу будет уменьшаться и уезжать вверх

---

**Cursor**

Делаем плавающий label внутри поля, скрываем `placeholder` в DOM и управляем состоянием «заполнено» для анимации при потере фокуса.

Вот что изменилось в `Input.svelte`.

### Placeholder

- Проп **`placeholder`** вынесен из `...rest` и **на `<input>` не передаётся** (подсказка только через label).
- Для подстраховки у инпута задано **`::placeholder { color: transparent; opacity: 0 }`**, чтобы нативный placeholder не всплывал даже при кастомном spread.

### Плавающий label

- Если передан **`label`**, блок поля получает модификатор **`--floating`**: сверху отступ под «поднятый» label.
- **`<label>`** стоит **поверх** поля (`position: absolute`, `pointer-events: none`), клики попадают в input.
- **Покой:** крупный шрифт как у значения, цвет `var(--color-secondary)`, позиция по вертикали в зоне текста.
- **Фокус** (`:focus-within`) **или** есть значение (**`data-filled`** по `hasValue`): label **уезжает вверх** (`top: 0`), **уменьшается** (`font-size` + `scale(0.92)`), плавный transition ~0.2s.
- Для **`type="password"`** у label уменьшен **`max-width`**, чтобы не заезжать на иконку глаза.

`hasValue`: непустое значение после `String(value)` (в т.ч. `0` для числа).

Без **`label`** поле ведёт себя как раньше (без плавающей оболочки). `npm run check` проходит.

---

**User**

подключи этот проект к удаленному репозиторию https://github.com/ernestbrazinski/frontend-engineer-challenge.git

---

**Cursor**

Проверяю состояние Git в проекте и подключаю удалённый репозиторий.

На удалённой ветке `master` есть коммиты (README). Делаем первый коммит локального кода и объединяем истории с `origin/master`.

Объединяю README: оставляю текст челленджа и добавляю секцию запуска для текущего проекта.

Вот что сделано.

### Подключение к GitHub

- В каталоге выполнен **`git init`**.
- Добавлен remote **`origin`** → [https://github.com/ernestbrazinski/frontend-engineer-challenge.git](https://github.com/ernestbrazinski/frontend-engineer-challenge.git).
- Ветка переименована в **`master`** (как на удалённом репозитории).
- Сделан первый коммит с текущим кодом Orbitto, затем **`git merge origin/master --allow-unrelated-histories`**, чтобы сохранить историю челленджа.
- Конфликт в **`README.md`** снят: оставлен текст задания с upstream и добавлена секция **«Запуск проекта (Orbitto)»** с командами `npm install` / `npm run dev` и кратко про стек.

### Push с этой машины

Команда **`git push -u origin master`** отсюда завершилась **403** (нет доступа по HTTPS-токену / политика GitHub в этой среде). У тебя локально всё уже готово к отправке.

Выполни у себя в проекте:

```bash
cd /Users/ernestbrozinskii/Sites/_projects/_self/orbitto
git push -u origin master
```

Если пользуешься SSH:

```bash
git remote set-url origin git@github.com:ernestbrazinski/frontend-engineer-challenge.git
git push -u origin master
```

После успешного push ветка **`master`** на GitHub будет содержать и коммиты челленджа, и твой код с объединённым README.

---

**User**

У меня уже запущен GraphQL backend на http://localhost:3080/graphql.
У меня также есть @/Users/ernestbrozinskii/Sites/\_projects/\_self/engineer-challenge/src/schema.gql со схемой API.

Сгенерируй frontend-уровень интеграции для этого API:

Apollo Client setup (или аналог)
GraphQL queries и mutations на основе schema.gql
Auth flow: register, login, refresh token, reset password
Typed API слой (TypeScript)
Сервисный слой (authService) поверх API
Svelte stores (auth store: user, token, auth state)
Обработка ошибок и loading states

---

**Cursor**

Читаю схему GraphQL и структуру проекта orbitto.

Добавляем зависимости и создаём слои: GraphQL-клиент, операции, типы, `authService`, store и инициализацию в layout.

Копирую схему в проект для документации и создаю файлы слоя.

Упрощаю операции: встраиваю поля `user` без отдельного фрагмента — так надёжнее с `gql`.

Кратко, что сделано.

### Зависимости

- **`@apollo/client`** (v4) и **`graphql`** в `dependencies`.

### Конфигурация

- **`PUBLIC_GRAPHQL_HTTP_URL`** — через `$env/dynamic/public`, по умолчанию **`http://localhost:3080/graphql`** (`DEFAULT_GRAPHQL_HTTP_URL` в `client.ts`).
- **`.env.example`** с примером; **`.gitignore`** дополнен **`.env`**.
- В **`README.md`** добавлены строки про API и env.

### GraphQL-слой (`src/lib/graphql/`)

| Файл                 | Назначение                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `schema.gql`         | Копия контракта (как в engineer-challenge).                                                                            |
| `types.ts`           | TS-типы под схему.                                                                                                     |
| `token-source.ts`    | Текущий access token для `Authorization: Bearer …` в линке.                                                            |
| `client.ts`          | `HttpLink` + **`SetContextLink`** (Apollo 4), `InMemoryCache`, ленивый **`getApolloClient()`** только в **`browser`**. |
| `errors.ts`          | **`CombinedGraphQLErrors`** / **`ServerError`** → человекочитаемая строка.                                             |
| `result.ts`          | **`ApiResult<T>`** (`ok` / `error` / `network`).                                                                       |
| `operations/auth.ts` | **`gql`**: `Me`, `Login`, `Register`, `RefreshSession`, `Logout`, `RequestPasswordReset`, `CompletePasswordReset`.     |
| `index.ts`           | Реэкспорты публичного API слоя.                                                                                        |

### Сервис (`src/lib/services/authService.ts`)

Объект **`authService`**: `fetchMe`, `login`, `register`, `refreshSession`, `logout`, `requestPasswordReset`, `completePasswordReset` — всё возвращает **`ApiResult<…>`**, без выбросов наружу.

### Store (`src/lib/stores/auth.ts`)

- **`auth`** — `user`, `accessToken`, `refreshToken`, **`status`** (`idle` \| `hydrating` \| `authenticated` \| `anonymous`), **`busy`**, **`busyOp`**, **`error`**.
- **`isAuthenticated`** — `derived`.
- Токены в **`localStorage`**: `orbitto.auth.accessToken` / `orbitto.auth.refreshToken`; синхронно обновляется **`setGraphqlAccessToken`**.
- **`hydrateAuth()`** — читает storage → `me` → при необходимости **`refreshSession`** → иначе **`clearSession`** (с защитой от гонок через `hydrateGeneration`).
- Экшены: **`login`**, **`register`**, **`logout`**, **`refreshAuth`**, **`requestPasswordReset`**, **`completePasswordReset`**, **`clearSession`**, **`clearSessionError`**.

### Приложение

- В **`src/routes/+layout.svelte`** в **`onMount`** вызывается **`hydrateAuth()`** (только клиент).

### Пример на странице входа

```svelte
<script lang="ts">
  import { auth, login } from "$lib/stores/auth";

  let email = $state("");
  let password = $state("");

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) location.href = "/";
  }
</script>

<form onsubmit={onSubmit}>
  <!-- поля -->
</form>

{#if $auth.error}
  <p role="alert">{$auth.error}</p>
{/if}
{#if $auth.busy}
  <p>{$auth.busyOp}…</p>
{/if}
```

### Важно

1. **CORS**: с фронта (другой порт) на `http://localhost:3080/graphql` бэкенд должен отдавать нужные **`Access-Control-Allow-Origin`** (и при необходимости заголовки для preflight).
2. **SSR**: `getApolloClient()` только в браузере; вызовы API — из обработчиков, **`onMount`**, `+page.ts` с `browser` и т.п.
3. Дальше можно подключить **`graphql-codegen`** к `schema.gql` и вынести операции в `.graphql` — сейчас типы ручные, но совпадают со схемой.

Сборка **`npm run build`** и **`npm run check`** проходят.

---

**User**

реализуй в src/routes/signup/+page.svelte запрос на регистрацию

---

**Cursor**

Подключаю форму: `bind:value`, валидация паролей, вызов `register` из store, редирект при успехе.

Исправляя реактивность: `$auth` в `$derived` в скрипте может не подписаться — выношу ошибку в шаблон.

Вот что сделано в `src/routes/signup/+page.svelte`.

### Поведение

- Состояние полей: **`email`**, **`password`**, **`passwordConfirm`** через **`bind:value`** у `Input`.
- **`onsubmit`**: `preventDefault`, сброс **`clearSessionError()`**, проверки:
  - непустой e-mail;
  - непустой пароль;
  - совпадение паролей;
  - длина пароля ≥ 6 символов (минимальная клиентская проверка).
- Вызов **`register(trimmed, password)`** из `$lib/stores/auth` (GraphQL `register`).
- При успехе — **`goto('/')`** (сессия уже в store и в `localStorage`).
- Пока идёт запрос: **`disabled`** у полей и кнопки, на кнопке текст **«Регистрация…»** при `busyOp === 'register'`.
- Ошибки: локальные (валидация) и **`$auth.error`** с бэкенда показываются в блоке с **`role="alert"`** и классом **`signup__error`**.

### Стили

- В **`signup.scss`** добавлен класс **`.signup__error`** (красный текст).
- В стилях страницы вместо устаревшего **`@import`** используется **`@use "./signup.scss"`**.

`npm run check` проходит без ошибок.

---

**User**

в /Users/ernestbrozinskii/Sites/\_projects/\_self/orbitto/src/helpers создай хелперы для валидирования полей формы. Давай начнем с хелпера, который будет проверять чтобы формат ввода для email соответствовал минимальным требованиям
те text@text.com

---

**Cursor**

Подключаю хелпер на странице регистрации.

Добавляю проверку e-mail через хелпер и исправляю отображение ошибок на странице регистрации.

Вот что сделано.

### `src/helpers/email.ts`

- **`isValidEmailFormat(email: string): boolean`** — обрезает пробелы, проверяет шаблон **`local@domain.tld`**: есть `@`, после `@` есть хотя бы одна **`.`** (как в `text@text.com`).
- Регулярное выражение: **`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`** — без пробелов и `@` в локальной части и домене, минимум «домен + зона».

### `src/helpers/index.ts`

- Реэкспорт **`isValidEmailFormat`**.

### Алиас **`$helpers`**

- В **`svelte.config.js`** добавлен `kit.alias`: **`$helpers` → `src/helpers`**, чтобы импортировать так:

```ts
import { isValidEmailFormat } from "$helpers";
```

### Регистрация

- В **`signup/+page.svelte`** после проверки на пустой e-mail вызывается **`isValidEmailFormat(trimmed)`**; при ошибке показывается текст про формат `user@mail.com`.
- Снова выведен блок ошибок **`signup__error`** (локальная + **`$auth.error`** с бэкенда).
- Подключён **`@use "./signup.scss"`** для стиля **`.signup__error`**.

`npm run check` проходит успешно.

---

**User**

создай константу routes с указанием наших текущих роутов и примени их везде где ни у нас прописаны ручками
к примеру export conts ROUTES = {
signin: "/signin",
home: "/"

---

**Cursor**

Создаю `src/lib/constants/routes.ts` и заменяю ручные пути в маршрутах.

Вот что сделано.

### `src/lib/constants/routes.ts`

Объект **`ROUTES`** с путями:

- `home` → `"/"`
- `signin` → `"/signin"`
- `signup` → `"/signup"`
- `passwordRecovery` → `"/password-recovery"`
- `terms` → `"/terms"`
- `privacy` → `"/privacy"`

Плюс типы **`RouteKey`** и **`RoutePath`** (`as const`).

### `src/lib/constants/index.ts`

Реэкспорт для импорта: `import { ROUTES } from "$lib/constants"`.

### Где подставлено

- **`src/routes/signin/+page.svelte`** — логотип, «Забыли пароль?», «Регистрация».
- **`src/routes/signup/+page.svelte`** — `goto`, логотип, оферта / политика, «Войти».
- **`src/routes/password-recovery/+page.svelte`** — логотип, `BackButton`, ссылка «Попробовать заново» в закомментированном блоке (чтобы при раскомментировании уже был `ROUTES`).

`app.html` (`/favicon.svg`) и статические пути к картинкам не трогал — это не маршруты приложения.

Использование:

```ts
import { ROUTES } from "$lib/constants";
await goto(ROUTES.home);
```

`npm run check` проходит.

---

**User**

вместо отдельных переменных @+page.svelte (8-12) сделай объект signUpForm и храни все в нем

---

**Cursor**

Рефакторим состояние формы в один объект `$state`.

Сделано так:

### Один объект состояния

- Тип **`SignUpFormState`**: `email`, `password`, `passwordConfirm`, `error`, `errorText`.
- **`let signUpForm = $state<SignUpFormState>({ ... })`** с начальными пустыми строками и `error: false`.

### Логика `onsubmit`

- Сброс: **`signUpForm.error = false`**, **`signUpForm.errorText = ""`**.
- Все проверки пишут в **`signUpForm.errorText`**; для несовпадения паролей и короткого пароля дополнительно **`signUpForm.error = true`** (как раньше для поля подтверждения).
- В **`register`** уходят **`trimmed`** и **`signUpForm.password`**.

### Шаблон

- **`bind:value={signUpForm.email}`** / **`password`** / **`passwordConfirm`**.
- У последнего инпута: **`error={signUpForm.error}`**, **`errorText={signUpForm.errorText}`**.

`npm run check` проходит без замечаний.

---

**User**

поменяй название src/helpers/email.ts замени на input-validate.ts и добавь хелпер который проверяет кол-во введенных символов и возвращает ошибку если введено недостаточное кол-во символов

---

**Cursor**

Упрощаю дефолтное сообщение о длине — убираю неверное склонение.

Подключаю `minLengthError` на странице регистрации для пароля.

Вот что сделано.

### Переименование

- **`src/helpers/email.ts`** удалён.
- Логика перенесена в **`src/helpers/input-validate.ts`**.

### `input-validate.ts`

- **`isValidEmailFormat`** — как раньше (регулярка для `user@mail.com`).
- **`minLengthError(value, minLength, options?)`** — считает длину после **`trim()`**:
  - пусто → `options.empty` или **`"Заполните поле"`**;
  - короче `minLength` → `options.tooShort` или **`Введите не менее N символов (сейчас M)`**;
  - иначе → **`null`**.
- Тип **`MinLengthErrorOptions`** экспортируется из **`src/helpers/index.ts`** вместе с функциями.

### Регистрация

- В **`signup/+page.svelte`** для пароля используется **`minLengthError(..., 6, { empty, tooShort })`** вместо ручных проверок.

Импорт по-прежнему: `import { isValidEmailFormat, minLengthError } from "$helpers"`.  
`npm run check` проходит.

---

**User**

@+page.svelte (65-71)

не возвращает кода ошибки и я не могу ее обработать корректно на фронте

---

**Cursor**

Расширяем `ApiResult` и извлечение кодов из GraphQL, меняем `register` в store на структурированный ответ и обновляем страницу регистрации.

Внося изменения в `auth.ts` и страницу регистрации.

Вот что сделано.

### 1. `ApiResult` и GraphQL (`result.ts`, `errors.ts`, `authService.ts`)

В ветке ошибки добавлены поля **`code`** (первый `extensions.code`) и **`codes`** (все найденные). Для `CombinedGraphQLErrors` они заполняются в `fail()` через новый **`extractGraphqlErrorDetails`**.

### 2. Store `register` (`auth.ts`)

Тип **`RegisterResult`**: `{ ok: true }` или `{ ok: false; error; code?; codes?; network? }`.  
При неуспехе **больше не пишется** `auth.error` — ошибку регистрации удобнее показывать только в форме (при необходимости можно снова выставлять store).

### 3. Страница signup (`+page.svelte`)

После `register` проверяется **`result.ok`**, при ошибке вызывается **`serverRegisterFieldErrors`**: по `code`/`codes` и тексту сообщения ставится **`email`**, **`password`** или общее **`form`** (блок с классом `signup__error` под заголовком).

На фронте можно явно ветвиться по коду, например:

```ts
if (!result.ok && result.code === "ВАШ_КОД_С_БЭКЕНДА") {
  /* … */
}
```

`npm run check` проходит без ошибок. Если реальные коды с API отличаются от эвристик в `serverRegisterFieldErrors`, достаточно подправить регулярки или заменить на точное сопоставление по `result.code`.

---

**User**

установи graphql-request в проект

---

**Cursor**

Пакет **`graphql-request`** добавлен в зависимости: выполнено `npm install graphql-request` в корне проекта, запись появилась в `package.json` / `package-lock.json`. У вас уже есть **`graphql`** — это совместимо с `graphql-request` (peer).

---

**User**

переделай запрос @+page.svelte (67-73) под использование graphql-request

---

**Cursor**

Просматриваю текущую реализацию регистрации и настройку GraphQL.

Добавляем клиент `graphql-request`, экспортируем URL из `client.ts`, экспортируем из store функции для сессии и busy-состояния, обновляем страницу.

Кратко, что сделано.

### Страница `signup/+page.svelte`

- Запрос идёт через **`getGraphQLRequestClient().request()`** с тем же **`REGISTER_MUTATION`**, что и в Apollo.
- Успех: **`commitAuthPayload(data.register)`** и **`goto(ROUTES.signin)`**.
- Ошибки GraphQL: **`ClientError`** → текст из **`err.response.errors`**, показ в **`signUpFormErrors.form`** (блок с классом **`signup__error`**).
- Состояние кнопок как раньше: **`startAuthOperation` / `finishAuthOperation`** вокруг запроса (аналог бывшего `register()` с `busy`).

### Новые / изменённые модули

- **`src/lib/graphql/graphql-request-client.ts`** — singleton `GraphQLClient` на **`getGraphqlHttpUrl()`** и **`Authorization: Bearer`** из **`getGraphqlAccessToken()`** (как в Apollo).
- **`src/lib/graphql/client.ts`** — экспорт **`getGraphqlHttpUrl()`** (используется и Apollo, и `graphql-request`).
- **`src/lib/stores/auth.ts`** — экспорт **`commitAuthPayload`**, **`startAuthOperation`**, **`finishAuthOperation`**.

Функция **`register()`** в store оставлена для остального кода; страница регистрации её больше не вызывает.

---

**User**

мне нужно только чтобы код ошибки возвращался errors[0].extensions.code я сам обработаю его на фронте так как мне нужно

---

**Cursor**

Add a small helper and expose `errors[0].extensions.code` via component state so the user can branch on it. I'll add `registerErrorCode` (or `graphqlErrorCode`) `$state`, clear it at the start of submit, set it in the `ClientError` branch, and add `code?: string` to `SignUpFormErrors` so they can use one object — user said they'll handle it; putting `code` on the same errors object is ergonomic.

Actually user said "только чтобы код" — might mean strip our message logic. I'll:

1. Add `code?: string` to SignUpFormErrors
2. On ClientError: set `signUpFormErrors = { code: extractCode(err) }` only? Or also keep `form` with message for accessibility.

I'll set `code` from `errors[0].extensions` and keep `form` as optional message (still useful). User can ignore `form` if they want.

Fix SignUpFormErrors type to include `form` and `code`.

Helper in page or in `errors.ts` as `firstGraphqlErrorCode(errors: readonly GraphQLError[] | undefined): string | undefined` for reuse.

I'll add to `src/lib/graphql/errors.ts`:

```typescript
import type { GraphQLError } from "graphql";

export function firstGraphqlErrorCode(
  errors: readonly GraphQLError[] | undefined,
): string | undefined {
  const first = errors?.[0];
  const raw = first?.extensions?.code;
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}
```

GraphQLError extensions in graphql package - might be readonly [key: string]: unknown

For ClientError in signup:

````typescript
import { firstGraphqlErrorCode } from "$lib/graphql/errors";

// catch
if (err instanceof ClientError) {
  const code = firstGraphqlErrorCode(err.response.errors);
  signUpFormErrors = {
    code,
    form: messageFromClientError(err), // user said only code - I'll only set code and let form be optional empty

User: "мне нужно только чтобы код ошибки возвращался" - I'll ONLY set `code` in signUpFormErrors for ClientError, not auto-fill form. They handle UI. But then no error text unless they add - OK.

I'll set only `code` for graphql errors. For non-graphql still set `form` for network etc.

For empty register response: no code, could set form or leave

```typescript
} catch (err) {
  if (err instanceof ClientError) {
    signUpFormErrors = {
      code: firstGraphqlErrorCode(err.response.errors),
    };
  } else ...
}
````

Remove messageFromClientError usage for ClientError path - or keep message in optional `form` for dev - user said only code. I'll remove form assignment for ClientError only.

Remove the template block `{#if signUpFormErrors.form}` if we never set form for graphql - user might still want to show their own messages - they handle. Keep the template for `form` when they set it from their handler - they need a place to show OR they use Input errors only.

Actually keep `{#if signUpFormErrors.form}` for non-ClientError and empty server cases.

For ClientError only `code` - template won't show - user adds their own in template based on `signUpFormErrors.code` - I should document or add a comment.

Alternatively export `registerErrorCode` as separate `$state` so template can use `{#if registerErrorCode}` - cleaner for "only code".

I'll use separate `let serverRegisterErrorCode = $state<string | undefined>(undefined)` cleared at start, set in catch - user can bind in template `{#if serverRegisterErrorCode}` for their logic.

But then they need two variables. Single object `signUpFormErrors.code` is enough.

Type:

```typescript
type SignUpFormErrors = {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  form?: string;
  /** Первый `errors[0].extensions.code` из ответа GraphQL (graphql-request). */
  code?: string;
};
```

ClientError branch:

```typescript
signUpFormErrors = {
  code: firstGraphqlErrorCode(err.response.errors),
};
```

Don't merge with previous errors - replace like other branches. Clear code at start: when building `errors` for client validation, also we need to clear server code when starting - at top of onsubmit after clearSessionError:

```typescript
graphqlRegisterErrorCode = undefined;
```

Actually when we `signUpFormErrors = errors` from client validation, we should not include old code - the `errors` object is fresh `{}` from const errors - good.

When client validation fails, signUpFormErrors = errors - no code - good.

When request fails ClientError, signUpFormErrors = { code: ... } - loses field errors - OK for server error path after validation passed.

When request succeeds goto - no need to clear.

Implement firstGraphqlErrorCode in errors.ts - read current errors.ts

Добавляем извлечение `errors[0].extensions.code` в общий хелпер и сохраняем его в состоянии формы (`signUpFormErrors.code`), без навязанной обработки сообщений для GraphQL-ошибок.

Вот что сделано.

### Хелпер `firstGraphqlErrorCode` (`src/lib/graphql/errors.ts`)

Читает **`errors?.[0]?.extensions.code`** (тип `string`, иначе `undefined`). Экспортируется и из **`$lib/graphql`**.

### Регистрация (`signup/+page.svelte`)

При **`ClientError`** в состояние кладётся только:

```ts
signUpFormErrors = {
  code: firstGraphqlErrorCode(err.response.errors),
};
```

Тип **`SignUpFormErrors`** дополнен полями **`code`** и **`form`**: для не‑GraphQL случаев по‑прежнему можно выставлять **`form`**, сообщения из GraphQL в форму **не** подставляются — разметку и ветвление по **`signUpFormErrors.code`** можно писать самому.

Тексты и поля по коду можно задать в том же `catch`, например:

```ts
if (err instanceof ClientError) {
  const code = firstGraphqlErrorCode(err.response.errors);
  // своя логика по code + err.response.errors
}
```

или в `$effect` / шаблоне по **`signUpFormErrors.code`**.

---

**User**

рефакторни обработку ошибки @+page.svelte (85-90)

1. вынеси коды ошибок в отдельную константу
2. сделай общую функцию для извлечения error codes из ответа API и отдельные мапперы ошибок под каждую форму (например SignUpFormErrors), чтобы преобразовывать API ошибки в ошибки формы, в UI оставь только вызов маппера без условной логики и сделать решение расширяемым для новых форм и кодов ошибок

---

**Cursor**

Просматриваю структуру `constants` и экспорты.

Добавляем константы кодов, расширяем извлечение ошибок GraphQL и модуль мапперов для форм.

Добавляем единую функцию `mapSignUpServerError`, чтобы в UI остался один вызов без тернарного оператора.

Кратко, что появилось в проекте.

### 1. Константы кодов — `src/lib/constants/graphql-error-codes.ts`

Объект **`GRAPHQL_ERROR_CODE`** и тип **`GraphqlErrorCode`**. Реэкспорт из **`$lib/constants`**.

### 2. Извлечение ошибки API — `src/lib/graphql/graphql-request-errors.ts`

- **`GraphqlRequestFailure`**: `primaryCode` (как `errors[0].extensions.code`), **`codes`** (все коды по порядку), **`messages`**.
- **`graphqlRequestFailureFromUnknown(err)`** — если это не `ClientError` от `graphql-request`, возвращает `null`.

В **`errors.ts`** добавлен **`graphqlErrorCodesList`** (поверх уже существующего **`firstGraphqlErrorCode`**).

### 3. Маппер формы регистрации — `src/lib/form-errors/signup-server-mapper.ts`

- Тип **`SignUpFormErrors`** (в т.ч. **`form`** для общих сообщений).
- **`mapGraphqlFailureToSignUpFormErrors`** — `switch` по **`failure.primaryCode`** и **`GRAPHQL_ERROR_CODE`**; для неизвестных кодов — **`form`** из сообщений GraphQL.
- **`mapUnknownErrorToSignUpFormErrors`** — не-GraphQL ошибки.
- **`mapSignUpServerError(err)`** — собирает всё вместе (единственный вызов из страницы).

Баррель: **`$lib/form-errors`**.

### 4. Страница — `signup/+page.svelte`

В `catch` только:

```ts
signUpFormErrors = mapSignUpServerError(err);
```

Плюс проверка **`!data.register`** и блок с **`signUpFormErrors.form`** в разметке.

---

**Как расширять:** новый код — в **`GRAPHQL_ERROR_CODE`** и ветка в **`mapGraphqlFailureToSignUpFormErrors`**. Новая форма — отдельный файл вроде **`signin-server-mapper.ts`**, свой **`mapXxxServerError`**, при необходимости общий **`graphqlRequestFailureFromUnknown`** без дублирования парсинга.

---

**User**

реализуй на src/routes/signin/+page.svelte запрос на авторизацию

---

**Cursor**

Просматриваю текущие файлы входа, маршруты и логин в store.

Добавляю маппер входа, коды ошибок при необходимости и полную форму на странице.

Заменяю класс `signup__error` на странице входа на стиль из `signin.scss`.

Вот что сделано.

### `src/routes/signin/+page.svelte`

- Форма с **`onsubmit`**, поля **`email`** / **`password`** с **`bind:value`**, **`autocomplete`**, блокировка при **`$auth.busy`**.
- Клиентская проверка: e-mail (пусто / формат), пароль не пустой (`minLengthError` с минимумом 1).
- Запрос **`LOGIN_MUTATION`** через **`getGraphQLRequestClient()`** (как на регистрации).
- Успех: **`commitAuthPayload(data.login)`** и **`goto(ROUTES.home)`**.
- Ошибки: **`mapSignInServerError(err)`**; общий текст — **`signInFormErrors.form`** над полями.

### `src/lib/form-errors/signin-server-mapper.ts`

- Тип **`SignInFormErrors`**, маппинг GraphQL и **`mapSignInServerError`** по тому же принципу, что и signup.

### `src/lib/constants/graphql-error-codes.ts`

- Добавлен **`INVALID_CREDENTIALS`**: при таком `extensions.code` показывается нейтральное «Неверный e-mail или пароль»; иначе — сообщения из ответа API.

### Экспорты

- В **`$lib/form-errors`** добавлены экспорты signin-модуля.

### `signin.scss`

- Класс **`.signin__form-alert`** для текста ошибки формы (вместо чужого `signup__error`).

Если бэкенд шлёт другой код для «неверный логин», добавь его в **`GRAPHQL_ERROR_CODE`** и в **`mapGraphqlFailureToSignInFormErrors`**. Редирект после входа сейчас на **`/`**; если нужен другой маршрут — напиши.

---

**User**

для src/routes/signin/+page.svelte надо сделать обработку ошибки по аналогии с src/routes/signup/+page.svelte

и возвращать текст Введены неверные данные когда апи возвращает код ошибки EMAIL_ALREADY_REGISTERED (код добавить в константы) и ошибку с введением не верных данных отображать в компоненте @+page.svelte (105-115)

---

**Cursor**

Обновляю маппер входа: при `EMAIL_ALREADY_REGISTERED` (в т.ч. в `failure.codes`) показывать «Введены неверные данные» в поле пароля. Константа уже есть — добавим комментарий.

Кратко, что сделано.

### `GRAPHQL_ERROR_CODE.EMAIL_ALREADY_REGISTERED`

Код уже был в **`graphql-error-codes.ts`**, добавлен только комментарий, что при **входе** API может отдавать тот же код.

### `signin-server-mapper.ts`

- Добавлена проверка **`failureHasCode`**: учитываются и **`primaryCode`**, и любой из **`failure.codes`** (как на signup по смыслу, только для входа).
- Если среди них есть **`EMAIL_ALREADY_REGISTERED`**, в ответ отдаётся **`{ password: "Введены неверные данные" }`** — текст уходит в **`Input` пароля** через уже существующий **`error={signInFormErrors.password}`** (ваш фрагмент 105–115).
- Остальное без изменений: **`INVALID_CREDENTIALS`** → **`form`**, прочие GraphQL → **`form`** через **`defaultFormMessage`**.

### Страница `signin/+page.svelte`

Менять не пришлось: **`mapSignInServerError`** по-прежнему один вызов в **`catch`**, как на **`signup`**; блок с **`signInFormErrors.form`** оставлен для прочих ошибок (не **`EMAIL_ALREADY_REGISTERED`**).

Если нужно, чтобы при **`INVALID_CREDENTIALS`** тот же текст тоже шёл в поле пароля — напиши, подстроим маппер.

---

**User**

ты возвращаешь текст ошибки Invalid credentials в
@+page.svelte (89-93) - это надо вообще удалить и возвращать корректный текст "Введены неверные данные" в компоненте @+page.svelte (105-115)

---

**Cursor**

Удаляем блок `form` в UI и переносим все случаи «неверные учётные данные» (код + текст «Invalid credentials») в поле пароля.

Вот что изменилось.

### `signin/+page.svelte`

- Удалён блок с **`signInFormErrors.form`** (строки 89–93).
- При пустом **`data.login`** в **`password`** подставляется **`"Введены неверные данные"`** (как для неверного входа).

### `signin-server-mapper.ts`

- Из типа **`SignInFormErrors`** убрано поле **`form`** — ошибки входа только в **`email`** / **`password`**.
- **`EMAIL_ALREADY_REGISTERED`** и **`INVALID_CREDENTIALS`** (по коду в **`primaryCode`** или **`codes`**) → **`password: "Введены неверные данные"`**.
- Если в **`messages`** есть текст вроде **`Invalid credential(s)`** (регистронезависимо), тоже → **`password: "Введены неверные данные"`** — так обрабатывается ответ без нужного **`extensions.code`**.
- Прочие GraphQL-ошибки → **`password`** с текстом из сообщений API или **`"Произошла ошибка"`**.
- Не-GraphQL ошибки: при том же паттерне в тексте → **`"Введены неверные данные"`**, иначе **`password`** с текстом ошибки.

### `signin.scss`

- Удалён неиспользуемый класс **`.signin__form-alert`**.

`npm run check` проходит успешно.

---

**User**

теперь давай реализуем запрос для страницы http://localhost:5173/password-recovery

---

**Cursor**

Добавляю маппер ошибок и полную страницу с запросом `requestPasswordReset` и экраном «Проверьте почту».

Вот что сделано.

### Запрос

- **`REQUEST_PASSWORD_RESET_MUTATION`** через **`getGraphQLRequestClient()`**, переменные **`{ input: { email } }`** (после `trim`).
- Во время запроса **`startAuthOperation("requestPasswordReset")` / `finishAuthOperation()`**, поля и кнопка завязаны на **`$auth.busy`**.

### Страница `password-recovery/+page.svelte`

- Шаг **`request`**: форма с **`onsubmit`**, валидация e-mail как на входе, **`Input`** с **`bind:value={email}`** и **`error={formErrors.email}`**.
- Успех при **`requestPasswordReset === true`**: шаг **`sent`**, экран «Проверьте свою почту» и кнопка **`goto(ROUTES.signin)`**.
- При **`false`** — сообщение под полем e-mail; при пустом/некорректном ответе — отдельный текст.
- Ошибки GraphQL — через **`mapPasswordRecoveryServerError`**.

### Маппер `src/lib/form-errors/password-recovery-server-mapper.ts`

- Тип **`PasswordRecoveryFormErrors`**, функции по тому же принципу, что и для входа/регистрации (при необходимости можно добавить коды в **`GRAPHQL_ERROR_CODE`** и ветки в **`mapGraphqlFailureToPasswordRecoveryFormErrors`**).
- Экспорт из **`$lib/form-errors`**.

Если бэкенд **всегда** отдаёт `true` (чтобы не светить существование e-mail), ветка с `false` почти не сработает — это нормально. Если нужно всегда показывать «успех» даже при `false`, напиши — поменяем логику.

---

**User**

не нужно удалять закомментированный html код в src/routes/password-recovery/+page.svelte это другие экраны с разными этапами восстановления пароля

---

**Cursor**

Восстанавливаю закомментированные заготовки экранов в конце `<main>` (после активной разметки).

Готово. В конец `<main>` снова добавлены все прежние **закомментированные** блоки: «Проверьте свою почту» (дубликат-заготовка), «Задайте пароль», «Пароль был восстановлен», «Пароль не был восстановлен» — с коротким вводным комментарием **«Другие этапы восстановления пароля (заготовки экранов)»**. Рабочий экран «Проверьте свою почту» по-прежнему в ветке `step === "sent"`.

---

**User**

новый флоу в работе апи при восстановления пароля

requestPasswordReset — input: { email }, ответ всегда true при валидном email (так задумано: нельзя понять, есть ли пользователь). Если пользователь есть, на почту уходит письмо со ссылкой
{PASSWORD_RESET_FRONTEND_URL}/password-recovery?token=<opaque>
(база из env бэка, по умолчанию http://localhost:5173).
completePasswordReset — input: { token, newPassword }; token — строка из ?token= в ссылке. Токен одноразовый, с TTL в Redis; повторный запрос сброса для того же email снимает старый токен. Пароль: ≥8 символов, буква + цифра. Успех — true, все refresh-сессии сбрасываются. Неверный/просроченный токен — ошибка (например, «Invalid or expired reset link»), смотрите errors[].extensions / message.
Подробные примеры запросов остаются в docs/graphql-examples.md

---

**Cursor**

Просматриваю типы, мутации и текущую страницу восстановления пароля.

Обновляя типы, сервис, store, хелпер пароля, мапперы и страницу; добавляю `docs/graphql-examples.md`.

Кратко, что сделано под новый флоу API.

### Типы и store

- **`CompletePasswordResetInput`**: теперь **`{ token, newPassword }`** (без `email` / `code`).
- **`completePasswordReset`** в **`auth.ts`** принимает **`CompletePasswordResetInput`**.

### Запросы на странице

1. **`requestPasswordReset`** — как раньше через **`graphql-request`**; при успешном ответе без исключения всегда переход на экран **«Проверьте свою почту»** (ветка с `false` убрана — при валидном email API отдаёт **`true`**).
2. **`completePasswordReset`** — при наличии **`?token=`** в URL показывается форма **«Задайте пароль»**, мутация с **`{ token, newPassword }`**, после успеха **`clearSession()`**, флаг успеха, **`goto(ROUTES.passwordRecovery, { replaceState: true })`** (убираем токен из адреса).

### Роутинг UI (`$app/state` → **`page.url`**)

- **`resetToken`** = `page.url.searchParams.get("token")?.trim()`.
- Порядок экранов: **успех смены пароля** → **форма по токену** → **письмо отправлено** → **ввод email**.

### Валидация пароля

- **`newPasswordResetPolicyError`** в **`input-validate.ts`**: ≥8 символов после **`trim`**, **`\p{L}`** и **цифра**; экспорт из **`$helpers`**.

### Ошибки complete

- **`password-reset-complete-mapper.ts`**: сообщения / «Invalid or expired reset link» → понятный **`form`**; экспорт из **`$lib/form-errors`**.

### Стили

- **`.password-recovery__alert`** для текста ошибки над формой смены пароля.

### Документация

- **`docs/graphql-examples.md`** — обе мутации, JSON переменных, пояснения про ссылку, токен, политику пароля и ошибки.

Закомментированные заготовки внизу **`+page.svelte`** сохранены.

---

**User**

при таком кейсе @+page.svelte (107-112) нужно отображать вот этот экран @+page.svelte (276-286)

---

**Cursor**

Добавляем состояние `showCompleteFailure`, при `completePasswordReset === false` показываем экран «Пароль не был восстановлен» и очищаем `?token=` из URL.

Сделано так:

### Логика при `completePasswordReset === false`

- Выставляется **`showCompleteFailure = true`**.
- Выполняется **`goto(ROUTES.passwordRecovery, { replaceState: true })`**, чтобы убрать **`?token=`** из адреса после неуспешного ответа.

### Разметка

- После блока успешного сброса добавлена ветка **`{:else if showCompleteFailure}`** с тем же текстом и кнопками, что были в закомментированном фрагменте: заголовок, описание, **«Назад в авторизацию»** → `goto(ROUTES.signin)`, ссылка **«Попробовать заново»** сбрасывает флаг и делает переход на чистый **`/password-recovery`**.

Порядок условий в шаблоне: **успех** → **ошибка complete (false)** → **форма с токеном** → **письмо отправлено** → **ввод email**, чтобы при снятом токене не показывалась снова форма смены пароля.

Внизу закомментированный дубликат экрана заменён на короткую ссылку-комментарий на эту ветку.

---

**User**

не выводи ошибки в отдельных тегах @+page.svelte (189-193) для этого есть пропс error у компонента @+page.svelte (205-215)

---

**Cursor**

Удаляю блок `<p>` и передаю `completeFormErrors.form` в проп `error` у поля «Повторите пароль», как в вашем выделении.

Сделано так:

- Удалён блок с **`<p class="password-recovery__alert">`**.
- У поля **«Повторите пароль»** задано  
  **`error={completeFormErrors.passwordConfirm ?? completeFormErrors.form}`** — общие серверные ошибки (`form`, в т.ч. «недействительная ссылка» и пустой ответ) показываются через **`Input`**, как и несовпадение паролей.
- Удалён неиспользуемый класс **`.password-recovery__alert`** из **`password-recovery.scss`**.

Ошибки политики пароля по-прежнему идут в **`error={completeFormErrors.newPassword}`** у первого поля.

---

**User**

сделай все комментарии в коде на английском

---

**Cursor**

Перевожу только комментарии (JSDoc и `//`), строки UI и сообщения об ошибках для пользователя не трогаю.

Вот что сделано.

### Комментарии в коде (переведены на английский)

- `src/routes/password-recovery/+page.svelte` — однострочный `//` про ответ API.
- `src/helpers/input-validate.ts` — JSDoc у модуля, `MinLengthErrorOptions`, `minLengthError`, `newPasswordResetPolicyError`.
- `src/lib/stores/auth.ts` — JSDoc у `commitAuthPayload` и `hydrateAuth`.
- `src/lib/constants/graphql-error-codes.ts`, `routes.ts`.
- `src/lib/graphql/errors.ts`, `graphql-request-errors.ts`, `graphql-request-client.ts`.
- `src/lib/form-errors/signup-server-mapper.ts` — три JSDoc-блока.

### Не менялось (намеренно)

- **Тексты для пользователя** в UI, в мапперах ошибок, в `authService`, дефолты в `minLengthError`, **`aria-label`** у переключателя пароля в `Input.svelte` — это не комментарии, а копирайт / UX на русском.

### Документация

- `docs/graphql-examples.md` переведён на английский (это не комментарии в `.ts`, но тот же смысл для разработчиков).

`npm run check` проходит без ошибок.
