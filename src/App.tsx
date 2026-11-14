import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronLeft,
  Download,
  ImagePlus,
  Menu,
  Music2,
  Pause,
  Play,
  Square,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { audio } from "./audio";
import { downloadArt, shareAlbum } from "./art";
import { defaultCover, normalizeCover, renderCover } from "./cover";
import {
  breedRu,
  readSettings,
  recommend,
  tracks,
  writeSettings,
  type Track,
} from "./data";
import { collection } from "./db";
import { prepareImage, validateImage } from "./image";
import { classifyBreed, detectCats, warmDetector } from "./recognition";
import type { Album, AnalysisPhase, CatBox, CoverFilter, CoverLayout, Settings } from "./types";

const copy = {
  ru: {
    navHome: "Главная",
    navCollection: "Коллекция",
    navAbout: "О проекте",
    navSettings: "Настройки",
    heroEyebrow: "CAT RECOGNITION × VINYL EXPERIENCE",
    heroTitle: "У каждого кота свой грув.",
    heroText:
      "Загрузи фотографию котика, узнай его предполагаемую породу и открой пластинку, которая звучит именно для него.",
    create: "Создать пластинку",
    heroNote: "Локальный AI. Настоящая музыка. Только твой кот.",
    step: "01 / ТВОРЧЕСКАЯ МАСТЕРСКАЯ",
    uploadTitle: "Начнём с котика",
    uploadText: "Выбери фото, сделай снимок или загляни в демогалерею.",
    upload: "Загрузить фото",
    camera: "Сделать снимок",
    demo: "Примеры",
    drop: "Перетащи фото сюда",
    formats: "JPEG, PNG или WebP · до 10 МБ",
    choose: "Выбрать файл",
    replace: "Заменить",
    remove: "Удалить",
    capture: "Снять",
    retake: "Переснять",
    cameraClose: "Закрыть камеру",
    name: "Как зовут котика? (необязательно)",
    namePlaceholder: "Например, Мурзик",
    analyse: "Распознать котика",
    demoBadge: "ДЕМО · без AI-анализа",
    demoNote: "Фотографии и результаты примеров подготовлены заранее.",
    demoCredits: "Фото: Wikimedia Commons · CC BY",
    model: "Загружаем AI-модель…",
    detect: "Ищем котика…",
    select: "Найдено несколько котиков. Выбери одного.",
    classify: "Изучаем внешние признаки…",
    generate: "Подбираем музыкальный грув…",
    notFound:
      "Кажется, котик спрятался. Мы не смогли обнаружить кошку на фотографии.",
    retry: "Попробуй другое фото.",
    modelError:
      "Не удалось загрузить модель. Проверь подключение и попробуй ещё раз.",
    partial:
      "Кот найден, но модель породы сейчас недоступна. Пластинка создана без предположения о породе.",
    errorFormat: "Этот формат пока не поддерживается.",
    errorLarge: "Файл больше 10 МБ. Выбери фото поменьше.",
    errorRead: "Не удалось прочитать изображение. Попробуй другое фото.",
    errorCamera: "Разреши доступ к камере и попробуй снова.",
    resultEyebrow: "ТВОЙ МУЗЫКАЛЬНЫЙ ПОРТРЕТ",
    resultTitle: "Пластинка готова",
    breed: "Предположительная порода",
    unknown: "Порода не определена",
    breedNote:
      "AI определяет породу приблизительно по внешним признакам. Результат может быть неточным.",
    track: "ТВОЯ КОМПОЗИЦИЯ",
    save: "Сохранить пластинку",
    saved: "Сохранено",
    saveError: "Не удалось сохранить изменения. Проверь свободное место.",
    download: "Скачать обложку",
    share: "Поделиться",
    again: "Другого котика",
    volume: "Громкость",
    mute: "Отключить звук",
    unmute: "Включить звук",
    anotherTrack: "Другой трек",
    play: "Воспроизвести",
    audioLoading: "Загружаем звук",
    pause: "Пауза",
    stop: "Остановить",
    vinylNoise: "Шум винила",
    needle: "Тонарм: перетащи иглу на пластинку для запуска",
    coverEditor: "Редактор обложки",
    coverHint: "Перетаскивай фото мышью или пальцем. Положение также можно настроить ползунками.",
    coverFit: "Вписать",
    coverCrop: "Заполнить",
    coverZoom: "Масштаб",
    coverHorizontal: "По горизонтали",
    coverVertical: "По вертикали",
    coverFilter: "Фильтр",
    coverReset: "Сбросить композицию",
    musicError: "Не удалось запустить звук. Попробуй ещё раз.",
    howTitle: "Как рождается грув",
    howOne: "Загрузи котика",
    howOneText: "Фото остаётся в твоём браузере.",
    howTwo: "Найди его ритм",
    howTwoText: "AI находит кота и осторожно предполагает породу.",
    howThree: "Опусти иглу",
    howThreeText: "Оригинальный луп звучит специально для этой пластинки.",
    recent: "Последние пластинки",
    seeAll: "Вся коллекция",
    emptyShort: "Пока здесь тихо. Создай первую пластинку.",
    collectionTitle: "Твоя коллекция",
    collectionText:
      "Каждый котик заслуживает собственного места на музыкальной полке.",
    search: "Поиск по имени или породе",
    allGenres: "Все жанры",
    newest: "Сначала новые",
    oldest: "Сначала старые",
    empty: "На этой полке пока тихо. Создай свою первую пластинку.",
    delete: "Удалить",
    deleteConfirm: "Удалить эту пластинку?",
    deleteAllConfirm: "Удалить всю коллекцию без возможности восстановления?",
    yesDelete: "Да, удалить",
    cancel: "Отмена",
    back: "К коллекции",
    missing: "Пластинка не найдена",
    aboutTitle: "Коты. Музыка. Немного магии.",
    aboutLead:
      "MEOWAX объединяет две вещи, которые делают жизнь уютнее: котов и музыку.",
    aboutIdea:
      "Каждый музыкальный портрет начинается с изображения. COCO-SSD ищет кошку, а CLIP предлагает осторожное предположение о породе. При нескольких котах выбор остаётся за тобой.",
    aboutMusic:
      "Шесть оригинальных аранжировок синтезируются в браузере с помощью Tone.js. Соответствие породы и жанра — творческая интерпретация, а не характеристика животного.",
    aboutPrivacy:
      "Фото обрабатывается локально. На сервер приложения оно не отправляется. Веса AI-моделей загружаются при первом анализе из внешних источников; сохранение в коллекцию происходит только по твоей команде.",
    settingsTitle: "Настрой свой звук",
    language: "Язык",
    music: "Музыка",
    defaultVolume: "Громкость по умолчанию",
    animation: "Анимация",
    reduceMotion: "Уменьшить анимацию",
    data: "Локальные данные",
    savedCount: "Сохранённых пластинок",
    clear: "Очистить коллекцию",
    notFoundTitle: "Этой дорожки нет",
    notFoundText: "Кажется, игла перескочила. Вернёмся к музыке?",
    home: "На главную",
    footer: "Музыкальная мастерская для котов и людей.",
    noteTitle: "Фото превращается в музыку.",
    demoOne: "Рыжик",
    demoTwo: "Луна",
    demoThree: "Плюш",
    selected: "Выбран котик",
  },
  en: {
    navHome: "Home",
    navCollection: "Collection",
    navAbout: "About",
    navSettings: "Settings",
    heroEyebrow: "CAT RECOGNITION × VINYL EXPERIENCE",
    heroTitle: "Every cat has a groove.",
    heroText:
      "Upload a cat photo, discover a possible breed and open a record made just for them.",
    create: "Make a record",
    heroNote: "Local AI. Real music. Your cat.",
    step: "01 / THE RECORD STUDIO",
    uploadTitle: "Start with a cat",
    uploadText: "Choose a photo, take a picture or try our demo gallery.",
    upload: "Upload photo",
    camera: "Take a picture",
    demo: "Examples",
    drop: "Drop a photo here",
    formats: "JPEG, PNG or WebP · up to 10 MB",
    choose: "Choose a file",
    replace: "Replace",
    remove: "Remove",
    capture: "Capture",
    retake: "Retake",
    cameraClose: "Close camera",
    name: "Your cat’s name (optional)",
    namePlaceholder: "For example, Felix",
    analyse: "Recognize cat",
    demoBadge: "DEMO · no AI analysis",
    demoNote: "Example photos and results were prepared in advance.",
    demoCredits: "Photos: Wikimedia Commons · CC BY",
    model: "Loading AI model…",
    detect: "Looking for a cat…",
    select: "We found several cats. Choose one.",
    classify: "Studying visual features…",
    generate: "Finding a musical groove…",
    notFound:
      "Looks like the cat is hiding. We could not find a cat in this picture.",
    retry: "Try another photo.",
    modelError:
      "Could not load the model. Check your connection and try again.",
    partial:
      "A cat was found, but breed classification is unavailable. Your record has no breed guess.",
    errorFormat: "This format is not supported yet.",
    errorLarge: "The file is over 10 MB. Choose a smaller photo.",
    errorRead: "Could not read the image. Try another photo.",
    errorCamera: "Allow camera access and try again.",
    resultEyebrow: "YOUR MUSICAL PORTRAIT",
    resultTitle: "Your record is ready",
    breed: "Possible breed",
    unknown: "Breed unknown",
    breedNote: "AI guesses breed from visual features. It can be inaccurate.",
    track: "YOUR COMPOSITION",
    save: "Save record",
    saved: "Saved",
    saveError: "Could not save changes. Check available storage.",
    download: "Download cover",
    share: "Share",
    again: "Try another cat",
    volume: "Volume",
    mute: "Mute",
    unmute: "Unmute",
    anotherTrack: "Another track",
    play: "Play",
    audioLoading: "Loading audio",
    pause: "Pause",
    stop: "Stop",
    vinylNoise: "Vinyl noise",
    needle: "Tonearm: drag the needle onto the record to play",
    coverEditor: "Cover editor",
    coverHint: "Drag the photo with a mouse or finger. You can also use the position sliders.",
    coverFit: "Fit",
    coverCrop: "Fill",
    coverZoom: "Zoom",
    coverHorizontal: "Horizontal position",
    coverVertical: "Vertical position",
    coverFilter: "Filter",
    coverReset: "Reset composition",
    musicError: "Could not start audio. Try again.",
    howTitle: "How a groove is born",
    howOne: "Upload a cat",
    howOneText: "The photo stays in your browser.",
    howTwo: "Find the rhythm",
    howTwoText: "AI finds the cat and cautiously guesses a breed.",
    howThree: "Drop the needle",
    howThreeText: "An original loop plays for this record.",
    recent: "Recent records",
    seeAll: "Full collection",
    emptyShort: "Quiet here for now. Make the first record.",
    collectionTitle: "Your collection",
    collectionText: "Every cat deserves a place on the record shelf.",
    search: "Search by name or breed",
    allGenres: "All genres",
    newest: "Newest first",
    oldest: "Oldest first",
    empty: "This shelf is quiet. Make your first record.",
    delete: "Delete",
    deleteConfirm: "Delete this record?",
    deleteAllConfirm: "Delete the entire collection permanently?",
    yesDelete: "Yes, delete",
    cancel: "Cancel",
    back: "Back to collection",
    missing: "Record not found",
    aboutTitle: "Cats. Music. A little magic.",
    aboutLead:
      "MEOWAX combines two things that make life cozier: cats and music.",
    aboutIdea:
      "Every musical portrait starts with an image. COCO-SSD finds the cat and CLIP makes a cautious breed guess. When several cats appear, you choose which one to feature.",
    aboutMusic:
      "Six original arrangements are synthesized in your browser with Tone.js. Breed to genre matching is a creative interpretation, not a description of the animal.",
    aboutPrivacy:
      "Photos are processed locally and never sent to the app server. AI model files are fetched on first use from external sources; a record is saved only when you ask.",
    settingsTitle: "Tune your sound",
    language: "Language",
    music: "Music",
    defaultVolume: "Default volume",
    animation: "Animation",
    reduceMotion: "Reduce motion",
    data: "Local data",
    savedCount: "Saved records",
    clear: "Clear collection",
    notFoundTitle: "No track here",
    notFoundText: "Looks like the needle skipped. Back to the music?",
    home: "Go home",
    footer: "A music studio for cats and humans.",
    noteTitle: "A photo becomes music.",
    demoOne: "Ginger",
    demoTwo: "Luna",
    demoThree: "Plush",
    selected: "Selected cat",
  },
} as const;
type Key = keyof typeof copy.ru;
type AppContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  t: (key: Key) => string;
};
const AppContext = createContext<AppContextValue | null>(null);
function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("Missing context");
  return value;
}
function useAlbumUrl(blob?: Blob) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!blob) return;
    const next = URL.createObjectURL(blob);
    // The object URL belongs to this effect and is revoked in its cleanup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url;
}
function Logo() {
  return (
    <Link className="brand" to="/" aria-label="MEOWAX home">
      <span className="brand-icon">
        <span>⌁</span>
      </span>
      <span>
        MEOWAX<small>CAT RECORD CLUB</small>
      </span>
    </Link>
  );
}
function Layout({ children }: { children: ReactNode }) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <button
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            className={open ? "site-nav open" : "site-nav"}
            aria-label="Main navigation"
          >
            {(
              [
                ["/", t("navHome")],
                ["/collection", t("navCollection")],
                ["/about", t("navAbout")],
                ["/settings", t("navSettings")],
              ] as const
            ).map(([path, label]) => (
              <NavLink
                onClick={() => setOpen(false)}
                key={path}
                end={path === "/"}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Logo />
          <span>{t("footer")}</span>
          <span>© {new Date().getFullYear()} MEOWAX</span>
        </div>
      </footer>
    </div>
  );
}
function Turntable({ track, image }: { track: Track; image?: Blob }) {
  const { settings, t, update } = useApp();
  const [phase, setPhase] = useState(audio.getState());
  const [error, setError] = useState("");
  const [needle, setNeedle] = useState<number | null>(null);
  const needlePosition = needle ?? (phase === "playing" || phase === "paused" ? 1 : 0);
  const dragNeedle = useRef<{ id: number; startY: number; start: number } | null>(null);
  const previousTrackId = useRef(track.id);
  const url = useAlbumUrl(image);
  useEffect(() => audio.subscribe(value => { setPhase(value); setNeedle(null); }), []);
  useEffect(() => {
    audio.setVolume(settings.volume / 100);
    audio.setMuted(settings.muted);
    audio.setVinylNoise(settings.vinylNoise);
  }, [settings.volume, settings.muted, settings.vinylNoise]);
  useEffect(() => {
    if (previousTrackId.current !== track.id) { audio.stop(); previousTrackId.current = track.id; }
  }, [track.id]);
  useEffect(() => () => audio.dispose(), []);
  async function toggle() {
    if (phase === "loading") return;
    try {
      setError("");
      if (phase === "playing") audio.pause();
      else await audio.play(track);
    } catch {
      audio.stop();
      setError(t("musicError"));
    }
  }
  function onNeedleDown(event: React.PointerEvent<HTMLButtonElement>) {
    dragNeedle.current = { id: event.pointerId, startY: event.clientY, start: needlePosition };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function onNeedleMove(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragNeedle.current;
    if (!drag || drag.id !== event.pointerId) return;
    setNeedle(Math.min(1, Math.max(0, drag.start + (event.clientY - drag.startY) / 90)));
  }
  function onNeedleUp(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragNeedle.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragNeedle.current = null;
    const dropped = Math.min(1, Math.max(0, drag.start + (event.clientY - drag.startY) / 90));
    if (dropped > 0.55) { void audio.play(track).catch(() => setError(t("musicError"))); }
    else { audio.stop(); setNeedle(null); }
  }
  function onNeedleCancel() { dragNeedle.current = null; setNeedle(null); }
  return (
    <div className="player-card">
      <div className="turntable" data-playing={phase === "playing"}>
        <div className="deck-top">
          <div className="deck-label">
            MEOWAX <span>STEREO / 33⅓ RPM</span>
          </div>
          <div className="platter">
            <div className="vinyl">
              <div
                className="record-label"
                style={{ backgroundColor: track.color }}
              >
                {url ? (
                  <img src={url} alt="" />
                ) : (
                  <span className="cat-symbol">◉</span>
                )}
                <span className="record-type">MEOWAX</span>
                <strong>{track.title}</strong>
                <small>{track.genre}</small>
              </div>
            </div>
          </div>
          <button className="tonearm" type="button" aria-label={t("needle")}
            style={{ "--needle-angle": `${-28 + needlePosition * 26}deg` } as CSSProperties}
            onPointerDown={onNeedleDown} onPointerMove={onNeedleMove} onPointerUp={onNeedleUp}
            onPointerCancel={onNeedleCancel} onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); void toggle(); }
            }}>
            <div className="tonearm-bar" />
            <div className="tonearm-head" />
          </button>
          <div className="deck-light">
            <i />
            {phase === "playing" ? "ON AIR" : "STANDBY"}
          </div>
        </div>
      </div>
      <div className="deck-controls">
        <button
          className="play-button"
          onClick={toggle}
          disabled={phase === "loading"}
          aria-label={phase === "loading" ? t("audioLoading") : phase === "playing" ? t("pause") : t("play")}
        >
          {phase === "loading" ? <span className="button-spinner" /> : phase === "playing" ? (
            <Pause fill="currentColor" />
          ) : (
            <Play fill="currentColor" />
          )}
        </button>
        <button className="icon-button" onClick={() => audio.stop()} aria-label={t("stop")}><Square size={19} /></button>
        <div className="track-meta">
          <span>
            {t("track")} · {track.genre} · {track.bpm} BPM
          </span>
          <strong>{track.title}</strong>
        </div>
        <button
          className="icon-button"
          onClick={() => update({ muted: !settings.muted })}
          aria-label={settings.muted ? t("unmute") : t("mute")}
        >
          {settings.muted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>
      <label className="volume-row">
        {t("volume")}
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(event) => update({ volume: Number(event.target.value) })}
        />
        <span>{settings.volume}%</span>
      </label>
      <label className="noise-row"><input type="checkbox" checked={settings.vinylNoise}
        onChange={event => update({ vinylNoise: event.target.checked })} />{t("vinylNoise")}</label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
function AlbumCover({ album }: { album: Album }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    if (canvas.current) void renderCover(canvas.current, album, 600, controller.signal).catch(() => {});
    return () => controller.abort();
  }, [album]);
  return <canvas ref={canvas} className="album-cover" role="img" aria-label={`${album.name}: ${tracks.find(t => t.id === album.trackId)?.title ?? ''}`} />;
}
function CoverEditor({ album, onChange }: { album: Album; onChange: (cover: CoverLayout) => void }) {
  const { t } = useApp();
  const layout = normalizeCover(album.cover);
  const drag = useRef<{ id: number; x: number; y: number; cover: CoverLayout } | null>(null);
  function patch(value: Partial<CoverLayout>) { onChange(normalizeCover({ ...layout, ...value })); }
  function down(event: React.PointerEvent<HTMLDivElement>) {
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, cover: layout };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: React.PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    onChange(normalizeCover({ ...start.cover, x: start.cover.x + (event.clientX - start.x) / 120,
      y: start.cover.y + (event.clientY - start.y) / 120 }));
  }
  function cancel() { if (drag.current) onChange(drag.current.cover); drag.current = null; }
  return <div className="cover-editor">
    <h3>{t("coverEditor")}</h3><p>{t("coverHint")}</p>
    <div className="cover-drag" onPointerDown={down} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={cancel}>
      <AlbumCover album={album} />
    </div>
    <div className="segmented cover-fit" role="group" aria-label={t("coverEditor")}>
      <button type="button" className={layout.fit === "contain" ? "active" : ""} onClick={() => patch({ fit: "contain" })}>{t("coverFit")}</button>
      <button type="button" className={layout.fit === "cover" ? "active" : ""} onClick={() => patch({ fit: "cover" })}>{t("coverCrop")}</button>
    </div>
    <label>{t("coverZoom")}<input type="range" min="1" max="2.4" step="0.01" value={layout.zoom} onChange={e => patch({ zoom: Number(e.target.value) })}/></label>
    <label>{t("coverHorizontal")}<input type="range" min="-1" max="1" step="0.01" value={layout.x} onChange={e => patch({ x: Number(e.target.value) })}/></label>
    <label>{t("coverVertical")}<input type="range" min="-1" max="1" step="0.01" value={layout.y} onChange={e => patch({ y: Number(e.target.value) })}/></label>
    <label>{t("coverFilter")}<select value={layout.filter} onChange={e => patch({ filter: e.target.value as CoverFilter })}>
      <option value="original">Original</option><option value="warm">Warm</option><option value="mono">Mono</option><option value="film">Film</option>
    </select></label>
    <button className="text-button" type="button" onClick={() => onChange(defaultCover)}><RotateCcw size={16}/>{t("coverReset")}</button>
  </div>;
}
function PhotoCredit({ album }: { album: Album }) {
  const { settings } = useApp();
  if (!album.imageCredit) return null;
  return <p className="photo-credit">{settings.language === "ru" ? "Фото" : "Photo"}: <a href={album.imageSource} target="_blank" rel="noreferrer">{album.imageCredit}</a></p>;
}
function Confirmation({
  text,
  onConfirm,
  onCancel,
}: {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useApp();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog ref={ref} className="confirm-dialog" aria-label={text} onCancel={onCancel}>
      <p>{text}</p>
      <div className="dialog-actions">
        <button className="button subtle" onClick={onCancel}>
          {t("cancel")}
        </button>
        <button
          className="button danger"
          onClick={() => {
            onConfirm();
            onCancel();
          }}
        >
          {t("yesDelete")}
        </button>
      </div>
    </dialog>
  );
}
const demos = [
  {
    id: "one",
    name: "Рыжик",
    nameEn: "Ginger",
    breed: "Bengal",
    trackId: "tiger-steps",
    photo: "/samples/ginger.jpg",
    source: "https://commons.wikimedia.org/wiki/File:An_orange_cat.jpg",
    credit: "BrithnyBiong · CC BY 4.0",
  },
  {
    id: "two",
    name: "Луна",
    nameEn: "Luna",
    breed: "Russian Blue",
    trackId: "blue-whiskers",
    photo: "/samples/luna.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Grey_Cat_in_Mykolaiv.jpg",
    credit: "Serhio Magpie · CC BY 4.0",
  },
  {
    id: "three",
    name: "Плюш",
    nameEn: "Plush",
    breed: "British Shorthair",
    trackId: "moonlight-paws",
    photo: "/samples/plush.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Portrait_of_a_nice_gray_and_white_cat_(54076273538).jpg",
    credit: "WDnet Studio Creation · CC BY 4.0",
  },
];
function DemoCat({ index }: { index: number }) {
  const d = demos[index];
  return <img src={d.photo} alt="" />;
}
function HomePage() {
  const { t, settings } = useApp();
  const [mode, setMode] = useState<"upload" | "camera" | "demo">("upload");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [demoIndex, setDemoIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [error, setError] = useState("");
  const [boxes, setBoxes] = useState<CatBox[]>([]);
  const [dims, setDims] = useState<[number, number]>([1, 1]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [saved, setSaved] = useState(false);
  const [drag, setDrag] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const runId = useRef(0);
  const imageUrl = useAlbumUrl(blob ?? undefined);
  const [recent, setRecent] = useState<Album[]>([]);
  useEffect(() => {
    collection
      .all()
      .then((items) => setRecent(items.slice(0, 3)))
      .catch(() => {});
  }, [saved]);
  useEffect(() => {
    if (video.current) video.current.srcObject = stream;
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);
  useEffect(
    () => () => {
      runId.current++;
      audio.stop();
    },
    [],
  );
  function reset() {
    runId.current++;
    audio.stop();
    setBlob(null);
    setDemoIndex(null);
    setAlbum(null);
    setSaved(false);
    setBoxes([]);
    setError("");
    setPhase("idle");
  }
  async function chooseFile(file?: File) {
    if (!file) return;
    reset();
    try {
      await validateImage(file);
      const prepared = await prepareImage(file);
      setBlob(prepared);
      setPhase("image-selected");
    } catch (err) {
      setError(
        err instanceof Error && err.message === "too-large"
          ? t("errorLarge")
          : err instanceof Error && err.message === "unsupported-format"
            ? t("errorFormat")
            : t("errorRead"),
      );
      setPhase("error");
    }
  }
  async function startCamera() {
    setMode("camera");
    reset();
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(media);
    } catch {
      setError(t("errorCamera"));
    }
  }
  function closeCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setMode("upload");
  }
  async function capture() {
    if (!video.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.current.videoWidth;
    canvas.height = video.current.videoHeight;
    canvas.getContext("2d")?.drawImage(video.current, 0, 0);
    const captured = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    if (captured) {
      setBlob(await prepareImage(captured));
      setPhase("image-selected");
      closeCamera();
    }
  }
  async function chooseDemo(index: number) {
    reset();
    setMode("demo");
    try {
      const response = await fetch(demos[index].photo);
      if (!response.ok) throw new Error("demo-image");
      setBlob(await response.blob());
      setDemoIndex(index);
      setPhase("image-selected");
    } catch {
      setError(t("errorRead"));
      setPhase("error");
    }
  }
  async function finish(
    breed: string | null,
    partial: boolean,
    source: Blob,
    usedDemo = false,
  ) {
    setPhase("generating-result");
    const track = usedDemo
      ? tracks.find((x) => x.id === demos[demoIndex!].trackId)!
      : recommend(breed);
    const record: Album = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      name:
        name.trim() ||
        (usedDemo
          ? settings.language === "ru"
            ? demos[demoIndex!].name
            : demos[demoIndex!].nameEn
          : settings.language === "ru"
            ? "Мистер Мур"
            : "Mister Purr"),
      breed,
      uncertain: partial || !breed,
      trackId: track.id,
      image: source,
      demo: usedDemo,
      imageCredit: usedDemo ? demos[demoIndex!].credit : undefined,
      imageSource: usedDemo ? demos[demoIndex!].source : undefined,
    };
    setAlbum(record);
    setPhase(partial ? "partial-success" : "success");
    setTimeout(
      () =>
        document
          .getElementById("result")
          ?.scrollIntoView({
            behavior: settings.reducedMotion ? "instant" : "smooth",
          }),
      20,
    );
  }
  async function analyse() {
    if (!blob) return;
    const id = ++runId.current;
    setError("");
    if (demoIndex !== null) {
      await finish(demos[demoIndex].breed, false, blob, true);
      return;
    }
    try {
      setPhase("loading-model");
      await warmDetector();
      if (id !== runId.current) return;
      setPhase("detecting");
      const found = await detectCats(blob);
      if (id !== runId.current) return;
      if (!found.length) {
        setError(t("notFound"));
        setPhase("error");
        return;
      }
      setBoxes(found);
      if (found.length > 1) {
        setPhase("selecting-cat");
        return;
      }
      await classify(found[0], id);
    } catch {
      if (id !== runId.current) return;
      setError(t("modelError"));
      setPhase("error");
    }
  }
  async function classify(box: CatBox, id = runId.current) {
    if (!blob) return;
    setPhase("classifying");
    try {
      const breed = await classifyBreed(blob, box);
      if (id === runId.current) await finish(breed, !breed, blob);
    } catch {
      if (id === runId.current) {
        setError(t("partial"));
        await finish(null, true, blob);
      }
    }
  }
  async function save() {
    if (!album || saved) return;
    try {
      await collection.save(album);
      setSaved(true);
    } catch {
      setError(
        settings.language === "ru"
          ? "Не удалось сохранить. Проверь свободное место."
          : "Could not save. Check available storage.",
      );
    }
  }
  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDrag(false);
    void chooseFile(event.dataTransfer.files[0]);
  }
  function onFile(event: ChangeEvent<HTMLInputElement>) {
    void chooseFile(event.target.files?.[0]);
    event.target.value = "";
  }
  const busy = [
    "loading-model",
    "detecting",
    "classifying",
    "generating-result",
  ].includes(phase);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              {t("heroEyebrow")}
            </div>
            <h1>{t("heroTitle")}</h1>
            <p>{t("heroText")}</p>
            <a href="#studio" className="button primary">
              {t("create")}
              <ArrowRight size={19} />
            </a>
            <div className="hero-footnote">
              <span className="tiny-record" />
              {t("heroNote")}
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-sun" />
            <div className="hero-disc">
              <span className="hero-disc-inner">
                <span>MEOWAX</span>
                <span className="hero-cat">⌁</span>
                <small>CAT GROOVE / VOL. 01</small>
              </span>
            </div>
            <div className="hero-arm" />
            <div className="hero-caption">SIDE A · PLAY IT PURR</div>
          </div>
        </div>
      </section>
      <section className="how-section">
        <div className="container">
          <div className="section-heading center">
            <span className="kicker">THE PROCESS</span>
            <h2>{t("howTitle")}</h2>
          </div>
          <div className="how-grid">
            {(["howOne", "howTwo", "howThree"] as const).map((key, index) => (
              <div className="how-item" key={key}>
                <span className="how-num">0{index + 1}</span>
                <h3>{t(key)}</h3>
                <p>{t(`${key}Text` as Key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="studio" className="studio-section">
        <div className="container">
          <div className="section-heading">
            <span className="kicker">{t("step")}</span>
            <h2>{t("uploadTitle")}</h2>
            <p>{t("uploadText")}</p>
          </div>
          <div className="studio-layout">
            <div className="upload-panel">
              <div className="tab-list" role="tablist">
                <button
                  className={mode === "upload" ? "active" : ""}
                  onClick={() => {
                    closeCamera();
                    setMode("upload");
                  }}
                >
                  <ImagePlus size={18} />
                  {t("upload")}
                </button>
                <button
                  className={mode === "camera" ? "active" : ""}
                  onClick={() => void startCamera()}
                >
                  <Camera size={18} />
                  {t("camera")}
                </button>
                <button
                  className={mode === "demo" ? "active" : ""}
                  onClick={() => {
                    closeCamera();
                    setMode("demo");
                  }}
                >
                  <Music2 size={18} />
                  {t("demo")}
                </button>
              </div>
              {mode === "upload" && (
                <div
                  className={drag ? "drop-zone dragging" : "drop-zone"}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                >
                  {blob && demoIndex === null && imageUrl ? (
                    <div className="preview">
                      <img src={imageUrl} alt="Selected cat" />
                      <div className="preview-actions">
                        <button
                          className="button light"
                          onClick={() => input.current?.click()}
                        >
                          {t("replace")}
                        </button>
                        <button
                          className="icon-button light"
                          onClick={reset}
                          aria-label={t("remove")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">
                        <UploadCloud size={32} />
                      </div>
                      <h3>{t("drop")}</h3>
                      <p>{t("formats")}</p>
                      <button
                        className="button light"
                        onClick={() => input.current?.click()}
                      >
                        {t("choose")}
                      </button>
                    </>
                  )}
                  <input
                    ref={input}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={onFile}
                    aria-label={t("choose")}
                  />
                </div>
              )}
              {mode === "camera" && (
                <div className="camera-zone">
                  {stream ? (
                    <>
                      <video
                        ref={video}
                        autoPlay
                        muted
                        playsInline
                        aria-label="Camera preview"
                      />
                      <button
                        className="button light"
                        onClick={() => void capture()}
                      >
                        {t("capture")}
                      </button>
                      <button className="text-button" onClick={closeCamera}>
                        {t("cameraClose")}
                      </button>
                    </>
                  ) : (
                    <>
                      <Camera size={35} />
                      <p>{error || t("errorCamera")}</p>
                      <button
                        className="button light"
                        onClick={() => void startCamera()}
                      >
                        {t("retry")}
                      </button>
                    </>
                  )}
                </div>
              )}
              {mode === "demo" && (
                <div className="demo-zone">
                  <p className="demo-disclaimer">{t("demoNote")}</p>
                  <div className="demo-grid">
                    {demos.map((d, index) => (
                      <button
                        className={
                          demoIndex === index ? "demo-cat active" : "demo-cat"
                        }
                        key={d.id}
                        onClick={() => void chooseDemo(index)}
                      >
                        <DemoCat index={index} />
                        <span>
                          {settings.language === "ru" ? d.name : d.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="demo-credits">
                    {t("demoCredits")}: {demos.map((d, index) => (
                      <a key={d.id} href={d.source} target="_blank" rel="noreferrer">
                        {index > 0 ? " · " : ""}{d.credit}
                      </a>
                    ))}
                  </div>
                  {demoIndex !== null && (
                    <span className="demo-tag">{t("demoBadge")}</span>
                  )}
                </div>
              )}
              <div className="upload-footer">
                <label>
                  {t("name")}
                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value.slice(0, 40))
                    }
                    placeholder={t("namePlaceholder")}
                    maxLength={40}
                  />
                </label>
                <button
                  className="button primary wide"
                  disabled={!blob || busy || phase === "selecting-cat"}
                  onClick={() => void analyse()}
                >
                  {busy ? (
                    <span className="button-spinner" />
                  ) : (
                    <span className="button-star">✳</span>
                  )}
                  {busy
                    ? phase === "classifying"
                      ? t("classify")
                      : phase === "detecting"
                        ? t("detect")
                        : t("model")
                    : t("analyse")}
                </button>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <p className="sr-only" role="status" aria-live="polite">
                {busy
                  ? phase === "classifying"
                    ? t("classify")
                    : phase === "detecting"
                      ? t("detect")
                      : t("model")
                  : phase === "selecting-cat"
                    ? t("select")
                    : ""}
              </p>
              {phase === "selecting-cat" && imageUrl && (
                <div className="cat-picker">
                  <p>{t("select")}</p>
                  <div className="box-image">
                    <img
                      src={imageUrl}
                      alt="Cats found"
                      onLoad={(event) =>
                        setDims([
                          event.currentTarget.naturalWidth,
                          event.currentTarget.naturalHeight,
                        ])
                      }
                    />
                    {boxes.map((box, index) => (
                      <button
                        key={index}
                        className="cat-box"
                        style={{
                          left: `${(box.bbox[0] / dims[0]) * 100}%`,
                          top: `${(box.bbox[1] / dims[1]) * 100}%`,
                          width: `${(box.bbox[2] / dims[0]) * 100}%`,
                          height: `${(box.bbox[3] / dims[1]) * 100}%`,
                        }}
                        onClick={() => void classify(box)}
                        aria-label={`${t("selected")} ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <aside className="studio-note">
              <div className="note-record">
                <span>MEOWAX</span>
              </div>
              <span className="kicker">THE SOUND OF CATS</span>
              <h3>{t("noteTitle")}</h3>
              <p>{t("howTwoText")}</p>
              <div className="note-rule" />
              <span>ANALOG SOUL · DIGITAL HEART</span>
            </aside>
          </div>
        </div>
      </section>
      {album && (
        <section id="result" className="result-section">
          <div className="container">
            <div className="section-heading center">
              <span className="kicker">{t("resultEyebrow")}</span>
              <h2>{t("resultTitle")}</h2>
            </div>
            <div className="result-grid">
              <div className="result-info">
                <CoverEditor album={album} onChange={cover => {
                  const next = { ...album, cover }; setAlbum(next);
                  if (saved) void collection.save(next).catch(() => setError(t("saveError")));
                }} />
                <PhotoCredit album={album} />
                <div className="breed-card">
                  <span className="kicker">{t("breed")}</span>
                  <h3>
                    {album.breed
                      ? settings.language === "ru"
                        ? breedRu[album.breed]
                        : album.breed
                      : t("unknown")}
                  </h3>
                  <p>{t("breedNote")}</p>
                  {album.demo && (
                    <span className="demo-tag">{t("demoBadge")}</span>
                  )}
                </div>
              </div>
              <div>
                <Turntable
                  track={
                    tracks.find((x) => x.id === album.trackId) ?? tracks[0]
                  }
                  image={album.image}
                />
                <div className="result-actions">
                  <button
                    className="button primary"
                    onClick={() => void save()}
                    disabled={saved}
                  >
                    {saved ? <Check size={18} /> : <Music2 size={18} />}{" "}
                    {saved ? t("saved") : t("save")}
                  </button>
                  <button
                    className="button outline"
                    onClick={() => void downloadArt(album)}
                  >
                    <Download size={18} />
                    {t("download")}
                  </button>
                  <button
                    className="button outline"
                    onClick={() => void shareAlbum(album, settings.language)}
                  >
                    <Share2 size={18} />
                    {t("share")}
                  </button>
                  <button
                    className="button outline"
                    onClick={() => {
                      const i = tracks.findIndex((x) => x.id === album.trackId);
                      audio.stop();
                      setAlbum({
                        ...album,
                        trackId: tracks[(i + 1) % tracks.length].id,
                      });
                      setSaved(false);
                    }}
                  >
                    <RotateCcw size={18} />
                    {t("anotherTrack")}
                  </button>
                </div>
                <button
                  className="text-button again"
                  onClick={() => {
                    reset();
                    document
                      .getElementById("studio")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t("again")} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="recent-section">
        <div className="container">
          <div className="section-row">
            <div>
              <span className="kicker">YOUR SHELF</span>
              <h2>{t("recent")}</h2>
            </div>
            <Link className="text-button" to="/collection">
              {t("seeAll")} <ArrowRight size={17} />
            </Link>
          </div>
          {recent.length ? (
            <div className="album-grid">
              {recent.map((item) => (
                <Link to={`/collection/${item.id}`} key={item.id}>
                  <AlbumCover album={item} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-mini">
              <span className="tiny-record" />
              {t("emptyShort")}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function CollectionPage() {
  const { t, settings } = useApp();
  const [items, setItems] = useState<Album[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("newest");
  const [deleting, setDeleting] = useState<string | null>(null);
  useEffect(() => {
    collection
      .all()
      .then(setItems)
      .catch(() => {});
  }, []);
  const filtered = items
    .filter((item) => {
      const track = tracks.find((x) => x.id === item.trackId);
      return (
        (!genre || track?.genre === genre) &&
        `${item.name} ${item.breed} ${breedRu[item.breed ?? ""] ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    })
    .sort((a, b) =>
      sort === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
    );
  async function remove(id: string) {
    await collection.remove(id);
    setItems(await collection.all());
  }
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-intro">
          <span className="kicker">THE RECORD SHELF</span>
          <h1>{t("collectionTitle")}</h1>
          <p>{t("collectionText")}</p>
        </div>
        {items.length ? (
          <>
            <div className="collection-tools">
              <input
                aria-label={t("search")}
                placeholder={t("search")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                aria-label={t("allGenres")}
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              >
                <option value="">{t("allGenres")}</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.genre}>
                    {track.genre}
                  </option>
                ))}
              </select>
              <select
                aria-label="Sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="newest">{t("newest")}</option>
                <option value="oldest">{t("oldest")}</option>
              </select>
            </div>
            <div className="album-grid">
              {filtered.map((item) => (
                <div className="collection-item" key={item.id}>
                  <Link to={`/collection/${item.id}`}>
                    <AlbumCover album={item} />
                  </Link>
                  <div className="collection-caption">
                    <div><strong>{item.name}</strong><span>
                      {item.breed
                        ? settings.language === "ru"
                          ? breedRu[item.breed]
                          : item.breed
                        : t("unknown")}
                    </span></div>
                    <button
                      className="icon-button"
                      onClick={() => setDeleting(item.id)}
                      aria-label={`${t("delete")} ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {!filtered.length && <p className="empty-mini">{t("empty")}</p>}
          </>
        ) : (
          <div className="empty-collection">
            <div className="empty-vinyl" />
            <h2>{t("empty")}</h2>
            <Link to="/" className="button primary">
              {t("create")} <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
      {deleting && (
        <Confirmation
          text={t("deleteConfirm")}
          onConfirm={() => void remove(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </section>
  );
}
function AlbumPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, settings } = useApp();
  const [album, setAlbum] = useState<Album | null>();
  const [confirm, setConfirm] = useState(false);
  const [coverError, setCoverError] = useState("");
  useEffect(() => {
    if (id)
      collection
        .get(id)
        .then(setAlbum)
        .catch(() => setAlbum(null));
  }, [id]);
  if (album === undefined)
    return (
      <section className="page-section">
        <div className="container">…</div>
      </section>
    );
  if (!album) return <NotFoundPage title={t("missing")} />;
  const track = tracks.find((x) => x.id === album.trackId) ?? tracks[0];
  return (
    <section className="page-section">
      <div className="container">
        <Link className="text-button" to="/collection">
          <ChevronLeft size={18} />
          {t("back")}
        </Link>
        <div className="detail-grid">
          <div>
            <CoverEditor album={album} onChange={cover => {
              const next = { ...album, cover }; setAlbum(next);
              void collection.save(next).then(() => setCoverError("")).catch(() => setCoverError(t("saveError")));
            }} />
            {coverError && <p className="form-error" role="alert">{coverError}</p>}
            <PhotoCredit album={album} />
            <div className="breed-card">
              <span className="kicker">{t("breed")}</span>
              <h3>
                {album.breed
                  ? settings.language === "ru"
                    ? breedRu[album.breed]
                    : album.breed
                  : t("unknown")}
              </h3>
              <p>{t("breedNote")}</p>
              {album.demo && <span className="demo-tag">{t("demoBadge")}</span>}
            </div>
          </div>
          <div>
            <div className="page-intro compact">
              <span className="kicker">
                MEOWAX RECORD NO. {album.id.slice(0, 4).toUpperCase()}
              </span>
              <h1>{album.name}</h1>
              <p>
                {track.genre} · {track.bpm} BPM · {track.title}
              </p>
            </div>
            <Turntable track={track} image={album.image} />
            <div className="result-actions">
              <button
                className="button outline"
                onClick={() => void downloadArt(album)}
              >
                <Download size={17} />
                {t("download")}
              </button>
              <button
                className="button outline"
                onClick={() => void shareAlbum(album, settings.language)}
              >
                <Share2 size={17} />
                {t("share")}
              </button>
              <button
                className="button danger"
                onClick={() => setConfirm(true)}
              >
                <Trash2 size={17} />
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {confirm && (
        <Confirmation
          text={t("deleteConfirm")}
          onCancel={() => setConfirm(false)}
          onConfirm={() => {
            void collection
              .remove(album.id)
              .then(() => navigate("/collection"));
          }}
        />
      )}
    </section>
  );
}
function AboutPage() {
  const { t } = useApp();
  return (
    <section className="page-section about-page">
      <div className="container">
        <div className="page-intro">
          <span className="kicker">THE STORY BEHIND THE SOUND</span>
          <h1>{t("aboutTitle")}</h1>
          <p>{t("aboutLead")}</p>
        </div>
        <div className="editorial-grid">
          <div className="editorial-graphic">
            <div className="hero-disc">
              <span className="hero-disc-inner">
                <span>MEOWAX</span>
                <span className="hero-cat">⌁</span>
                <small>CAT GROOVE / VOL. 01</small>
              </span>
            </div>
          </div>
          <div className="editorial-copy">
            <span className="kicker">01 / THE IDEA</span>
            <p>{t("aboutIdea")}</p>
            <span className="kicker">02 / THE MUSIC</span>
            <p>{t("aboutMusic")}</p>
            <span className="kicker">03 / PRIVACY</span>
            <p>{t("aboutPrivacy")}</p>
            <Link className="button primary" to="/">
              {t("create")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
function SettingsPage() {
  const { t, settings, update } = useApp();
  const [count, setCount] = useState(0);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    collection
      .count()
      .then(setCount)
      .catch(() => {});
  }, []);
  return (
    <section className="page-section settings-page">
      <div className="container narrow">
        <div className="page-intro">
          <span className="kicker">YOUR TURNTABLE</span>
          <h1>{t("settingsTitle")}</h1>
        </div>
        <div className="settings-group">
          <h2>
            <SlidersHorizontal size={20} />
            {t("language")}
          </h2>
          <div className="segmented">
            <button
              className={settings.language === "ru" ? "active" : ""}
              onClick={() => update({ language: "ru" })}
            >
              Русский
            </button>
            <button
              className={settings.language === "en" ? "active" : ""}
              onClick={() => update({ language: "en" })}
            >
              English
            </button>
          </div>
        </div>
        <div className="settings-group">
          <h2>
            <Music2 size={20} />
            {t("music")}
          </h2>
          <label className="setting-row">
            {t("defaultVolume")}
            <span>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(event) =>
                  update({ volume: Number(event.target.value) })
                }
              />{" "}
              {settings.volume}%
            </span>
          </label>
          <label className="setting-row">
            {t("mute")}
            <input
              type="checkbox"
              checked={settings.muted}
              onChange={(event) => update({ muted: event.target.checked })}
            />
          </label>
          <label className="setting-row">{t("vinylNoise")}
            <input type="checkbox" checked={settings.vinylNoise} onChange={event => update({ vinylNoise: event.target.checked })} />
          </label>
        </div>
        <div className="settings-group">
          <h2>{t("animation")}</h2>
          <label className="setting-row">
            {t("reduceMotion")}
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(event) =>
                update({ reducedMotion: event.target.checked })
              }
            />
          </label>
        </div>
        <div className="settings-group">
          <h2>{t("data")}</h2>
          <div className="setting-row">
            {t("savedCount")}
            <strong>{count}</strong>
          </div>
          <button
            className="button danger"
            disabled={!count}
            onClick={() => setConfirm(true)}
          >
            <Trash2 size={17} />
            {t("clear")}
          </button>
        </div>
      </div>
      {confirm && (
        <Confirmation
          text={t("deleteAllConfirm")}
          onCancel={() => setConfirm(false)}
          onConfirm={() => {
            void collection.clear().then(() => setCount(0));
          }}
        />
      )}
    </section>
  );
}
function NotFoundPage({ title }: { title?: string }) {
  const { t } = useApp();
  return (
    <section className="page-section notfound-page">
      <div className="container">
        <span className="big-404">404</span>
        <h1>{title ?? t("notFoundTitle")}</h1>
        <p>{t("notFoundText")}</p>
        <Link className="button primary" to="/">
          {t("home")}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export default function App() {
  const [settings, setSettings] = useState(readSettings);
  function update(patch: Partial<Settings>) {
    setSettings((current) => {
      const next = { ...current, ...patch };
      writeSettings(next);
      return next;
    });
  }
  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dataset.reduceMotion = settings.reducedMotion
      ? "true"
      : "false";
  }, [settings.language, settings.reducedMotion]);
  const t = (key: Key) => copy[settings.language][key];
  return (
    <AppContext.Provider value={{ settings, update, t }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/collection/:id" element={<AlbumPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
