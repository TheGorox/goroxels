# Goroxels
## Что? Куда я попал?
Это репозиторий лучших пикселей, когда-либо деланных - горокселей!!
Почти всё слизано у других сайтов, и оставлено только лучшее - по мнению гороха!
## Я просто спросить
В любом случае, тебе понадобится установить [node.js](https://nodejs.org/en/), лучше LTS.
Скачай этот реп, выполни в папке с ним (на винде shift+пкм на свободном месте в папке - "запустить PowerShell(или cmd)"), `npm install`, а затем `npm start`, и всё! 
Гороксели будут доступны по http://localhost:8000
## Хочу перемен
### Требования:
- [Node.js](https://nodejs.org/en/) с NPM
- [pm2](https://github.com/Unitech/pm2) (`npm install pm2 -g`) (опционально, но текущая инструкция без него не будет работать)
- [Mysql](https://www.mysql.com/downloads/) (опционально)


Клиент и сервер лежат в одном репозитории. Для быстрой разработки достаточно одной команды из корня репозитория — HMR и проксирование API/websocket настраиваются автоматически, вручную билдить клиент и копировать его в `server/public` больше не надо:

```
npm install --prefix server
npm install --prefix client
npm run dev
```

`npm run dev` поднимает сразу два процесса:
- **server** — `node src/index.js dev` (режим разработки: конфиг `config.test`, sqlite, порт `8000`);
- **client** — vite-dev-сервер на http://localhost:5173 с HMR.

Открывать в браузере нужно **vite** (http://localhost:5173): он раздаёт клиент прямо из `src` и проксирует на бэкенд `/api`, `/uploads`, `/config.json`, `/robots.txt`, `/changelog` и websocket-каналы канвасов (`/<canvasName>`).

Если сервер уже запущен отдельно на другом порту, укажи клиенту его адрес через `GOROXELS_API`:

```
cd client
GOROXELS_API=http://localhost:8000 npm run dev
```

Адрес можно также прописать в файле `client/.env`.

Собрать клиент в `server/public` (для деплоя) можно как и раньше — `npm run build` в папке `client`.

Запускать научились. Теперь взглянем на эти прекрасные переменные окружения.
Ниже приведены обязательные переменные(без них запуск через node не сработает):
| ИМЯ        | ЗНАЧЕНИЕ                                                             |
| ---------- | -------------------------------------------------------------------- |
| DB_ISLOCAL | Использование sqlite вместо mysql (1-е не требует настройки). 1/0    |
| DB_LOG     | Логгировать ли транзакции. 1/0                                       |


И необязательные:

| ИМЯ                   | ЗНАЧЕНИЕ                         | ПРИМЕР       |
| --------------------- | -------------------------------- | ------------ |
| DB_USER               | Имя пользователя бд (mysql)      | postgres     |
| DB_PASS               | Пароль к выше описанному         | 12345        |
| DB_HOST               | Адрес базы данных                | localhost    |
| DB_PORT               | Порт бд, указанный при установке | 5432         |
| DB_DATABASE           | Название бд                      | goroxels     |
| DB_LOG_PATH           | Путь к логу бд (если DB_LOG=1)   | db.log       |
| SESSION_SECRET        | Уникальный код сессий аккаунтов  | trapsaregays |
| AUTH_FB_CLIENT_ID     | ID приложения в facebook         | shitbook     |
| AUTH_FB_CLIENT_SECRET | Ключ доступа приложения FB       | ayybravo     |
| AUTH_DC_CLIENT_ID     | ID приложения Discord            | 123456       |
| AUTH_DC_CLIENT_SECRET | Ключ доступа прилы Discord       | discock      |
| AUTH_VK_CLIENT_ID     | ID приложения Vkontakte          | leavevk      |
| AUTH_VK_CLIENT_SECRET | Ключ доступа прилы VK            | durov123     |

Выставляем их в *ecosystem.config.js* сервера, либо опциональным модулем *env* (`npm i env`) в файле .env сервера

ps если используется nginx конфиг - папка с сервером должна быть по пути /usr/goroxels