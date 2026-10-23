# Воркшоп «Два зелёных теста — и что дальше?»

75 минут практики для студентов, знакомых с JavaScript и основами тестирования.
Цель — самостоятельно находить недостающие сценарии по требованиям и проверять,
может ли тест заметить ошибку.

## Начало работы ведущего

1. Прочитайте [сценарий](instructor/WORKSHOP.md), затем [карту ошибок](instructor/BUGS.md).
2. Установите зависимости и выполните проверки ниже.
3. Раздайте студентам **только каталог `student/`**. В нём самостоятельный проект;
   `instructor/` содержит ответы и остаётся у ведущего.
4. До занятия проверьте Node.js и запуск тестов на студенческих компьютерах.
   Установка зависимостей не входит в 75 минут практики.

## Запуск из корня

Требуются Node.js 20+ и npm. Две установки независимы, npm workspaces не используются.

```sh
npm ci --prefix student
npm ci --prefix instructor
npm test --prefix student
npm test --prefix instructor
npm run test:student --prefix instructor
```

Последняя команда намеренно завершается кодом **1** на исходном проекте:
полный набор тестов обнаруживает ошибки `student/`. Она работает во временной
копии и не меняет исходные файлы. Для занятия откройте отдельный терминал в `student/`
и запустите `npm run test:watch`.

## Структура

```text
.
├── README.md
├── VERIFICATION.md
├── .gitignore
├── student/
│   ├── README.md
│   ├── TASKS.md
│   ├── package.json
│   ├── package-lock.json
│   ├── src/calculateDelivery.js
│   └── test/start.test.js
└── instructor/
    ├── README.md
    ├── BUGS.md
    ├── WORKSHOP.md
    ├── package.json
    ├── package-lock.json
    ├── vitest.config.js
    ├── src/calculateDelivery.js
    ├── scripts/check-student.js
    └── test/
        ├── start.test.js
        ├── regressions.test.js
        └── calculateDelivery.test.js
```

В каждой версии одна функция без классов, сервера, интерфейса и базы данных.
Единственная прямая зависимость для разработки — Vitest 3.2.7.
Транзитивный Vite закреплён на 6.4.5 через `overrides`, чтобы сохранить поддержку
Node.js 20.0+. Lock-файлы фиксируют остальные версии.

Справка: [запуск Vitest 3](https://v3.vitest.dev/guide/),
[параметризованные тесты](https://v3.vitest.dev/api/#test-each).
