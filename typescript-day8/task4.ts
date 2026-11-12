interface BaseMedia {
  id: string;
  title: string;
  category: "movie" | "documentary" | "podcast" | "audiobook" | "live";
  durationMinutes: number;
  moderationNote: string | null;
}

interface Movie extends BaseMedia {
  category: "movie";
  director: string;
  releaseYear: number;
}

interface Documentary extends BaseMedia {
  category: "documentary";
  subject: string;
}

interface Podcast extends BaseMedia {
  category: "podcast";
  episodes: number;
}

interface Audiobook extends BaseMedia {
  category: "audiobook";
  narrator: string;
  chapters: number;
}

interface LiveBroadcast extends BaseMedia {
  category: "live";
  streamUrl: string;
  isLive: boolean;
}

type MediaItem = Movie | Documentary | Podcast | Audiobook | LiveBroadcast;

type MediaPartialUpdate<T extends BaseMedia> = Partial<T>;
type MediaReadonly<T extends BaseMedia> = Readonly<T>;
type PublicMediaMetadata<T extends BaseMedia> = Pick<
  T,
  "id" | "title" | "category" | "durationMinutes"
>;
type InternalMedia<T extends BaseMedia> = Omit<T, "moderationNote">;

type PlayerConfiguration<T> = {
  media: T;
  autoplay: boolean;
  quality: "480p" | "720p" | "1080p" | "4K";
};

type MediaStatusMap<T extends BaseMedia> = {
  [K in keyof T]: { value: T[K]; verified: boolean };
};

type MediaCategoryRecord = Record<MediaItem["category"], number>;

type IsMovie<T> = T extends Movie ? true : false;
type IsLive<T> = T extends LiveBroadcast ? true : false;

type CategorySpecificData<T extends MediaItem> = T extends Movie
  ? { director: string }
  : T extends Podcast
    ? { episodes: number }
    : T extends LiveBroadcast
      ? { streamUrl: string }
      : { general: string };

type ExtractPromiseResult<T> = T extends Promise<infer R> ? R : never;
type FetchMediaCallback = (id: string) => Promise<MediaItem>;
type FetchedMedia = ExtractPromiseResult<ReturnType<FetchMediaCallback>>;

type CategoryConfiguration = Record<
  MediaItem["category"],
  { maxQuality: string; region: string }
>;

type MediaEventName<T extends MediaItem["category"]> =
  `${T}.${"started" | "paused" | "ended"}`;
type PropertyEventName<
  T extends BaseMedia,
  K extends keyof T,
> = `${T["category"]}.${K & string}.changed`;

type EventPayloadMap = {
  [C in MediaItem["category"]]: {
    [A in "started" | "paused" | "ended"]: {
      mediaId: string;
      timestamp: number;
    };
  };
};

function emitEvent<
  C extends MediaItem["category"],
  A extends "started" | "paused" | "ended",
>(category: C, action: A, payload: EventPayloadMap[C][A]): void {
  console.log(`Event ${category}.${action}`, payload);
}

function isMediaOfCategory<C extends MediaItem["category"]>(
  media: MediaItem,
  category: C,
): media is Extract<MediaItem, { category: C }> {
  return media.category === category;
}

function processMedia<T extends MediaItem>(media: T): PublicMediaMetadata<T> {
  return {
    id: media.id,
    title: media.title,
    category: media.category,
    durationMinutes: media.durationMinutes,
  };
}

const mediaInput = {
  id: "M-12",
  title: "The Indus Saga",
  category: "documentary",
  durationMinutes: 52,
  moderationNote: "Internal_review",
};

const documentary: Documentary = {
  ...mediaInput,
  category: "documentary",
  subject: "Civilization of the Indus Valley",
};

const movie: Movie = {
  id: "M-13",
  title: "Waar",
  category: "movie",
  durationMinutes: 148,
  moderationNote: null,
  director: "Bilal Lashari",
  releaseYear: 2013,
};

const live: LiveBroadcast = {
  id: "L-1",
  title: "Live from Faisal Mosque",
  category: "live",
  durationMinutes: 120,
  moderationNote: null,
  streamUrl: "https://example.pk/stream/faisal-mosque",
  isLive: true,
};

const partialMovieUpdate: MediaPartialUpdate<Movie> = {
  title: "Waar (Extended Cut)",
};
const readonlyMovie: MediaReadonly<Movie> = movie;
const publicMetadata: PublicMediaMetadata<Movie> = processMedia(movie);
const internalMovie: InternalMedia<Movie> = {
  id: movie.id,
  title: movie.title,
  category: "movie",
  durationMinutes: movie.durationMinutes,
  director: movie.director,
  releaseYear: movie.releaseYear,
};
const playerConfig: PlayerConfiguration<Movie> = {
  media: movie,
  autoplay: true,
  quality: "4K",
};
const mediaStatus: MediaStatusMap<Movie> = {
  id: { value: movie.id, verified: true },
  title: { value: movie.title, verified: true },
  category: { value: movie.category, verified: true },
  durationMinutes: { value: movie.durationMinutes, verified: true },
  moderationNote: { value: movie.moderationNote, verified: false },
  director: { value: movie.director, verified: true },
  releaseYear: { value: movie.releaseYear, verified: true },
};

const categoryRecord: MediaCategoryRecord = {
  movie: 1,
  documentary: 1,
  podcast: 0,
  audiobook: 0,
  live: 1,
};

const categoryConfig: CategoryConfiguration = {
  movie: { maxQuality: "4K", region: "Pakistan" },
  documentary: { maxQuality: "1080p", region: "Pakistan" },
  podcast: { maxQuality: "480p", region: "Urdu" },
  audiobook: { maxQuality: "480p", region: "Urdu" },
  live: { maxQuality: "1080p", region: "Pakistan" },
};

const isMovieType: IsMovie<Movie> = true;
const isLiveMovieType: IsLive<Movie> = false;

type MovieSpecific = CategorySpecificData<Movie>;
const movieSpecificData: MovieSpecific = { director: movie.director };

type LiveSpecific = CategorySpecificData<LiveBroadcast>;
const liveSpecificData: LiveSpecific = { streamUrl: live.streamUrl };

type MovieEvent = MediaEventName<"movie">;
const movieEvent: MovieEvent = "movie.started";

type TitleEvent = PropertyEventName<Movie, "title">;
const titleEvent: TitleEvent = "movie.title.changed";

if (isMediaOfCategory(movie, "movie")) {
  console.log(`Movie director: ${movie.director}`);
}

if (isMediaOfCategory(live, "live")) {
  console.log(`Live stream URL: ${live.streamUrl}`);
}

emitEvent("movie", "started", { mediaId: movie.id, timestamp: Date.now() });
emitEvent("documentary", "paused", {
  mediaId: documentary.id,
  timestamp: Date.now(),
});

// Expected compiler error: Object literal may only specify known properties, and 'episodes' does not exist in type 'Movie'.
const invalidMovie: Movie = {
  id: "M-99",
  title: "Bad Movie",
  category: "movie",
  durationMinutes: 100,
  moderationNote: null,
  director: "Unknown",
  releaseYear: 2024,
  episodes: 10,
};

// Expected compiler error: Type '"invalid.category"' is not assignable to type '"movie" | "documentary" | "podcast" | "audiobook" | "live"'.
const invalidCategory: Documentary = {
  id: "D-99",
  title: "Bad Doc",
  category: "invalid.category",
  durationMinutes: 30,
  moderationNote: null,
  subject: "Unknown",
};

// Expected compiler error: Property 'director' is missing in type '{ id: string; title: string; category: "movie"; durationMinutes: number; moderationNote: null; releaseYear: number; }' but required in type 'Movie'.
const missingRequiredField: Movie = {
  id: "M-100",
  title: "Missing Director",
  category: "movie",
  durationMinutes: 90,
  moderationNote: null,
  releaseYear: 2024,
};

// Expected compiler error: Argument of type '"movie"' is not assignable to parameter of type '"documentary"'.
emitEvent("documentary", "started", {
  mediaId: movie.id,
  timestamp: Date.now(),
});
