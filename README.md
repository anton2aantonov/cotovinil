# MEOWAX

«У каждого кота свой грув» — статическое React приложение для музыкальных портретов котов. Фото анализируется локально в браузере, а оригинальные лупы синтезируются Tone.js. Демофотографии и их результаты явно помечены как демонстрация.

## Запуск

```bash
npm install
npm run dev
```

В этом рабочем окружении доступен `pnpm` вместо `npm`; эквивалентные команды — `pnpm install` и `pnpm dev`. Проверки: `npm run build`, `npm run lint`, `npm run test`, затем `npm run test:e2e` (E2E запускаются против готового `dist/`; нужен браузер Playwright). На Windows можно использовать установленный Edge: `$env:PLAYWRIGHT_CHANNEL='msedge'; npm run test:e2e`.

Отдельный реальный AI smoke-тест загружает веса моделей: `$env:AI_SMOKE='1'; npm run test:e2e -- e2e/inference.spec.ts --project=desktop`.

## Технологии и данные

- React, TypeScript strict, Vite, Tailwind CSS, React Router, Lucide.
- TensorFlow.js + COCO-SSD (`lite_mobilenet_v2`) для реального обнаружения кошек.
- Transformers.js + ONNX модель [`Xenova/clip-vit-base-patch32`](https://huggingface.co/Xenova/clip-vit-base-patch32) для экспериментальной zero-shot оценки породы.
- Tone.js для шести оригинальных программно синтезируемых лупов.
- Dexie/IndexedDB для сохранённых пластинок и LocalStorage для настроек.

После создания пластинки редактор обложки позволяет вписать или заполнить фото, перетащить его мышью или пальцем, изменить масштаб и положение ползунками и выбрать один из четырёх фильтров. Превью и PNG экспортируются одним Canvas-рендерером. Настройки композиции сохраняются с пластинкой в IndexedDB и доступны при повторном открытии; старые записи открываются с безопасной композицией по умолчанию. Автоматический режим вписывает всё изображение и не определяет положение головы: если нужен крупный план, настройте его вручную.

Проигрыватель поддерживает Play, Pause, Stop, перетаскивание тонарма и управление с клавиатуры. Короткий звук иглы воспроизводится при запуске, тихий виниловый шум — только во время воспроизведения. Шум отключается в проигрывателе или настройках; громкость и Mute общие для музыки и эффектов. При остановке, смене трека или уходе со страницы транспорт и шум останавливаются. Фото для обложки хранится только в локальном браузере пользователя вместе с настройками обложки.

Лицензии моделей: [COCO-SSD / TensorFlow.js Models — Apache-2.0](https://github.com/tensorflow/tfjs-models/blob/master/package.json), [CLIP ONNX — MIT](https://huggingface.co/Xenova/clip-vit-base-patch32). Эти модели не включены в `dist/`; их веса получает браузер при первом анализе.

При первом анализе браузер загружает веса COCO-SSD с хранилища TensorFlow и CLIP с Hugging Face. Для этого нужен интернет. Фотография не отправляется в удалённый inference API. Если CLIP недоступен, результат остаётся частичным без предположения о породе. CLIP scores не являются калиброванной вероятностью, а определение породы не имеет ветеринарной точности. На слабых устройствах загрузка CLIP может быть долгой или не выполниться из-за памяти.

Демофотографии хранятся локально и показывают заранее подготовленные результаты (они не проходят AI-анализ):

- `ginger.jpg` — [BrithnyBiong, «An orange cat»](https://commons.wikimedia.org/wiki/File:An_orange_cat.jpg), CC BY 4.0.
- `luna.jpg` — [Serhio Magpie, «Grey Cat in Mykolaiv»](https://commons.wikimedia.org/wiki/File:Grey_Cat_in_Mykolaiv.jpg), CC BY 4.0.
- `plush.jpg` — [WDnet Studio Creation, «Portrait of a nice gray and white cat»](https://commons.wikimedia.org/wiki/File:Portrait_of_a_nice_gray_and_white_cat_(54076273538).jpg), CC BY 4.0.

Превью уменьшены до 600 px. Лицензия: https://creativecommons.org/licenses/by/4.0/. Атрибуция показана в галерее, в сохранённом альбоме и на экспортируемой демообложке. Интерфейс использует системные шрифты Georgia и Arial без внешнего запроса.

## Деплой

`npm run build` создаёт `dist/`. Разместите папку на Vercel; `vercel.json` перенаправляет маршруты React Router на `index.html`. Для другого статического хостинга настройте аналогичный SPA fallback. Укажите HTTPS для работы камеры. Публичный URL в проекте не задан.
