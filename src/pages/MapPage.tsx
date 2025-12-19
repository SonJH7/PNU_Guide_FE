import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { courseSpots, type CourseSpot } from '@/components/course/courseSpots';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import {
  fontFamily,
  grayColors,
  spacing,
  textStyle,
} from '@/theme/designSystem';

type GoogleLatLngLiteral = { lat: number; lng: number };
type GoogleLatLng = { lat: () => number; lng: () => number };
type GoogleMap = {
  setCenter: (center: GoogleLatLngLiteral) => void;
  setZoom: (zoom: number) => void;
};

type GoogleGeocoderResult = {
  geometry: { location: GoogleLatLng };
};

type GoogleGeocoder = {
  geocode: (
    request: { address: string },
    callback: (results: GoogleGeocoderResult[] | null, status: string) => void,
  ) => void;
};

type GoogleMarker = {
  setMap: (map: GoogleMap | null) => void;
  setPosition: (position: GoogleLatLngLiteral) => void;
  setTitle: (title: string) => void;
};

type GoogleMapsNamespace = {
  Map: new (
    container: HTMLElement,
    options: {
      center: GoogleLatLngLiteral;
      zoom?: number;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      keyboardShortcuts?: boolean;
      gestureHandling?: 'greedy' | 'cooperative' | 'none' | 'auto';
    },
  ) => GoogleMap;
  Marker: new (options: {
    map: GoogleMap;
    position: GoogleLatLngLiteral;
    title?: string;
  }) => GoogleMarker;
  Geocoder: new () => GoogleGeocoder;
};

type GoogleSdk = {
  maps: GoogleMapsNamespace;
};

declare global {
  interface Window {
    google?: GoogleSdk;
  }
}

const GOOGLE_SDK_ID = 'google-maps-sdk';
const GOOGLE_MAPS_KEY =
  typeof import.meta.env.VITE_GOOGLE_MAPS_KEY === 'string'
    ? import.meta.env.VITE_GOOGLE_MAPS_KEY
    : '';
const STORAGE_KEY = 'pnu-course-recent-searches';
const MAX_RECENT = 8;

const defaultCenter = { lat: 35.2329, lng: 129.0846 };

const quickFilters = [
  '인문관',
  '사회관',
  '기계관',
  '경영관',
  '넉넉한터',
  '새벽뜰',
  '중앙도서관',
];

const normalizeTerm = (value: string) => value.trim();
const normalizeForSearch = (value: string) =>
  normalizeTerm(value).replace(/\s+/g, '').toLowerCase();

const loadRecentSearches = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const unique = new Set<string>();
    parsed.forEach((item) => {
      if (typeof item === 'string') {
        const cleaned = normalizeTerm(item);
        if (cleaned) unique.add(cleaned);
      }
    });
    return Array.from(unique).slice(0, MAX_RECENT);
  } catch {
    return [];
  }
};

let googleMapsPromise: Promise<GoogleMapsNamespace> | null = null;

const loadGoogleMaps = (apiKey: string) => {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new Error('Google Maps SDK is only available in the browser.'),
    );
  }

  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key.'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise<GoogleMapsNamespace>((resolve, reject) => {
    const handleLoad = () => {
      if (!window.google?.maps) {
        reject(new Error('Google Maps SDK failed to initialize.'));
        return;
      }
      resolve(window.google.maps);
    };

    const handleError = () => {
      reject(new Error('Failed to load Google Maps SDK.'));
    };

    const existingScript = document.getElementById(
      GOOGLE_SDK_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SDK_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    document.head.appendChild(script);
  });

  googleMapsPromise.catch(() => {
    googleMapsPromise = null;
  });

  return googleMapsPromise;
};

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const mapsRef = useRef<GoogleMapsNamespace | null>(null);
  const geocoderRef = useRef<GoogleGeocoder | null>(null);
  const markerRef = useRef<GoogleMarker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<CourseSpot | null>(null);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // Ignore storage write errors.
    }
  }, [recentSearches]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let cancelled = false;

    loadGoogleMaps(GOOGLE_MAPS_KEY)
      .then((maps) => {
        if (cancelled || !mapContainerRef.current) return;
        mapsRef.current = maps;
        if (!geocoderRef.current) {
          geocoderRef.current = new maps.Geocoder();
        }
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 16,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            keyboardShortcuts: true,
            gestureHandling: 'greedy',
          });
        }
        setMapReady(true);
      })
      .catch((error) => {
        if (cancelled) return;
        setMapError(
          error instanceof Error
            ? error.message
            : '지도를 불러오지 못했습니다.',
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const trimmedQuery = normalizeTerm(query);
  const normalizedQuery = normalizeForSearch(trimmedQuery);
  const hasQuery = trimmedQuery.length > 0;

  const filteredSpots = useMemo(() => {
    if (!hasQuery) return [];
    return courseSpots.filter((spot) => {
      const target = `${spot.title} ${spot.description} ${spot.buildingNumber}`;
      return normalizeForSearch(target).includes(normalizedQuery);
    });
  }, [hasQuery, normalizedQuery]);

  const updateRecentSearches = (term: string) => {
    const cleaned = normalizeTerm(term);
    if (!cleaned) return;
    setRecentSearches((prev) => {
      const next = [cleaned, ...prev.filter((item) => item !== cleaned)];
      return next.slice(0, MAX_RECENT);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedQuery) return;
    setQuery(trimmedQuery);
    updateRecentSearches(trimmedQuery);
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    updateRecentSearches(term);
  };

  const handleResultClick = (spot: CourseSpot) => {
    updateRecentSearches(spot.title);
    setSelectedSpot(spot);
  };

  const clearAllRecent = () => setRecentSearches([]);

  const buildCampusQuery = (term: string) =>
    term.includes('부산대학교') ? term : `부산대학교 ${term}`;

  const getNavigationUrl = (term: string) => {
    const destination = encodeURIComponent(buildCampusQuery(term));
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
  };

  const getSearchUrl = (term: string) => {
    const queryTerm = encodeURIComponent(buildCampusQuery(term));
    return `https://www.google.com/maps/search/?api=1&query=${queryTerm}`;
  };

  const handleNavigateClick = (term: string) => {
    updateRecentSearches(term);
  };

  const handleDetailClick = (spot: CourseSpot) => {
    updateRecentSearches(spot.title);
    void navigate(`/course/${spot.id}`);
  };

  useEffect(() => {
    if (
      !mapReady ||
      !selectedSpot ||
      !mapInstanceRef.current ||
      !geocoderRef.current ||
      !mapsRef.current
    ) {
      return;
    }

    let cancelled = false;
    const geocoder = geocoderRef.current;
    const map = mapInstanceRef.current;
    const maps = mapsRef.current;
    const address = selectedSpot.title.includes('부산대학교')
      ? selectedSpot.title
      : `부산대학교 ${selectedSpot.title}`;

    geocoder.geocode({ address }, (results, status) => {
      if (cancelled) return;
      if (!results || results.length === 0 || status !== 'OK') {
        return;
      }

      const location = results[0].geometry.location;
      const position = { lat: location.lat(), lng: location.lng() };

      if (!markerRef.current) {
        markerRef.current = new maps.Marker({
          map,
          position,
          title: selectedSpot.title,
        });
      } else {
        markerRef.current.setPosition(position);
        markerRef.current.setTitle(selectedSpot.title);
        markerRef.current.setMap(map);
      }

      map.setCenter(position);
      map.setZoom(17);
    });

    return () => {
      cancelled = true;
    };
  }, [mapReady, selectedSpot]);

  return (
    <div
      className="flex min-h-screen justify-center bg-background-default text-text-default"
      style={{ fontFamily }}
    >
      <div className="relative min-h-screen w-full max-w-[420px]">
        <div ref={mapContainerRef} className="absolute inset-0" />

        {!mapReady && !mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background-muted/80">
            <span className="text-text-sub" style={textStyle('body3')}>
              지도를 불러오는 중입니다.
            </span>
          </div>
        ) : null}

        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background-muted/90">
            <div
              className="rounded-2xl border border-border-default bg-background-default px-4 py-3 text-center shadow-[0_12px_30px_rgba(17,24,39,0.12)]"
              style={textStyle('body3')}
            >
              {mapError}
            </div>
          </div>
        ) : null}

        <div className="relative z-10 flex min-h-screen flex-col pointer-events-none">
          <header
            className="flex flex-col pointer-events-auto"
            style={{
              gap: spacing(3),
              paddingInline: spacing(5),
              paddingTop: spacing(4),
            }}
          >
            <form
              className="flex items-center rounded-full border border-border-default bg-background-default/95 shadow-[0_8px_20px_rgba(17,24,39,0.12)] backdrop-blur"
              style={{
                gap: spacing(2),
                paddingInline: spacing(3),
                paddingBlock: spacing(1.5),
              }}
              onSubmit={handleSubmit}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke={grayColors[500] ?? '#6B7280'}
                  strokeWidth="1.5"
                />
                <path
                  d="M16.5 16.5L21 21"
                  stroke={grayColors[500] ?? '#6B7280'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="가고 싶은 건물을 검색해보세요."
                className="flex-1 bg-transparent text-text-default placeholder:text-text-placeholder focus:outline-none"
                style={textStyle('body2')}
                aria-label="지도 검색"
              />
              <button
                type="button"
                aria-label="음성 검색"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background-fill text-text-placeholder"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect
                    x="9"
                    y="3"
                    width="6"
                    height="12"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M6 11V12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12V11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 18V21"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickFilters.map((term) => {
                const isActive =
                  normalizedQuery &&
                  normalizeForSearch(term) === normalizedQuery;
                return (
                  <button
                    key={`quick-${term}`}
                    type="button"
                    className={`whitespace-nowrap rounded-full border transition-colors ${
                      isActive
                        ? 'border-brand-blue bg-brand-blue text-white shadow-[0_8px_18px_rgba(20,63,144,0.25)]'
                        : 'border-border-default bg-background-default/90 text-text-sub shadow-[0_6px_14px_rgba(17,24,39,0.08)]'
                    }`}
                    style={{
                      ...textStyle('body3'),
                      fontWeight: 600,
                      paddingInline: spacing(3),
                      paddingBlock: spacing(1),
                    }}
                    onClick={() => handleChipClick(term)}
                  >
                    {term}
                  </button>
                );
              })}
            </div>
          </header>

          <main
            className="mt-auto pointer-events-auto"
            style={{
              paddingInline: spacing(4),
              paddingTop: spacing(2),
              paddingBottom: spacing(16),
            }}
          >
            <section className="max-h-[46vh] overflow-y-auto rounded-3xl border border-border-default bg-background-default/95 shadow-[0_24px_48px_rgba(17,24,39,0.18)] backdrop-blur">
              <div
                className="flex flex-col"
                style={{ gap: spacing(4), padding: spacing(4) }}
              >
                {hasQuery ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-text-default"
                        style={{ ...textStyle('body1'), fontWeight: 600 }}
                      >
                        검색 결과
                      </span>
                      <span
                        className="text-text-placeholder"
                        style={textStyle('body3')}
                      >
                        {filteredSpots.length}곳
                      </span>
                    </div>
                    {filteredSpots.length > 0 ? (
                      <div
                        className="flex flex-col"
                        style={{ gap: spacing(3) }}
                      >
                        {filteredSpots.map((spot) => {
                          const isSelected = selectedSpot?.id === spot.id;
                          return (
                            <div
                              key={spot.id}
                              className={`flex w-full items-center gap-3 rounded-2xl border bg-background-default shadow-[0_12px_24px_rgba(17,24,39,0.08)] transition-shadow duration-150 hover:shadow-[0_16px_30px_rgba(17,24,39,0.12)] ${
                                isSelected
                                  ? 'border-brand-blue shadow-[0_16px_30px_rgba(20,63,144,0.18)]'
                                  : 'border-border-default'
                              }`}
                            >
                              <button
                                type="button"
                                className="flex flex-1 items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                                aria-label={`${spot.title} 지도에 표시`}
                                onClick={() => handleResultClick(spot)}
                              >
                                <img
                                  src={spot.image}
                                  alt={spot.title}
                                  className="h-16 w-16 rounded-xl object-cover"
                                />
                                <div
                                  className="flex flex-1 flex-col"
                                  style={{
                                    gap: spacing(1),
                                    paddingBlock: spacing(1),
                                  }}
                                >
                                  <span
                                    className="text-text-default"
                                    style={{
                                      ...textStyle('body2'),
                                      fontWeight: 600,
                                    }}
                                  >
                                    {spot.title}
                                  </span>
                                  <span
                                    className="text-text-sub"
                                    style={{
                                      ...textStyle('body3'),
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {spot.description}
                                  </span>
                                  <span
                                    className="text-text-placeholder"
                                    style={textStyle('caption')}
                                  >
                                    건물번호: {spot.buildingNumber}
                                  </span>
                                </div>
                              </button>
                              <div className="mr-3 flex flex-col items-center gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-full border border-border-default bg-background-fill text-text-sub shadow-[0_6px_14px_rgba(17,24,39,0.08)] transition-colors hover:bg-background-muted"
                                  style={{
                                    ...textStyle('body3'),
                                    fontWeight: 600,
                                    paddingInline: spacing(2),
                                    paddingBlock: spacing(1),
                                  }}
                                  onClick={() => handleDetailClick(spot)}
                                >
                                  상세
                                </button>
                                <a
                                  href={getNavigationUrl(spot.title)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center rounded-full bg-brand-blue text-white shadow-[0_8px_18px_rgba(20,63,144,0.3)] transition-transform duration-150 active:scale-[0.98]"
                                  style={{
                                    ...textStyle('body3'),
                                    fontWeight: 600,
                                    paddingInline: spacing(2),
                                    paddingBlock: spacing(1),
                                  }}
                                  onClick={() =>
                                    handleNavigateClick(spot.title)
                                  }
                                >
                                  길찾기
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center rounded-2xl bg-background-muted text-center"
                        style={{ gap: spacing(2), padding: spacing(3) }}
                      >
                        <span
                          className="text-text-sub"
                          style={textStyle('body3')}
                        >
                          검색 결과가 없습니다. 인기 검색어를 확인해보세요.
                        </span>
                        <a
                          href={getSearchUrl(trimmedQuery)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-brand-blue text-white shadow-[0_8px_18px_rgba(20,63,144,0.3)] transition-transform duration-150 active:scale-[0.98]"
                          style={{
                            ...textStyle('body3'),
                            fontWeight: 600,
                            paddingInline: spacing(3),
                            paddingBlock: spacing(1),
                          }}
                          onClick={() => handleNavigateClick(trimmedQuery)}
                        >
                          지도에서 찾아보기
                        </a>
                        <div className="flex flex-wrap justify-center gap-2">
                          {quickFilters.map((term) => (
                            <button
                              key={`popular-${term}`}
                              type="button"
                              className="rounded-full border border-border-default bg-background-default text-text-sub shadow-[0_6px_14px_rgba(17,24,39,0.08)]"
                              style={{
                                ...textStyle('body3'),
                                fontWeight: 600,
                                paddingInline: spacing(3),
                                paddingBlock: spacing(1),
                              }}
                              onClick={() => handleChipClick(term)}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col" style={{ gap: spacing(2) }}>
                      <span
                        className="text-text-default"
                        style={{ ...textStyle('body1'), fontWeight: 600 }}
                      >
                        추천 검색
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {quickFilters.map((term) => (
                          <button
                            key={`suggest-${term}`}
                            type="button"
                            className="rounded-full border border-border-default bg-background-default text-text-sub shadow-[0_6px_14px_rgba(17,24,39,0.08)]"
                            style={{
                              ...textStyle('body3'),
                              fontWeight: 500,
                              paddingInline: spacing(3),
                              paddingBlock: spacing(1),
                            }}
                            onClick={() => handleChipClick(term)}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col" style={{ gap: spacing(2) }}>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-text-default"
                          style={{ ...textStyle('body1'), fontWeight: 600 }}
                        >
                          최근 검색
                        </span>
                        <button
                          type="button"
                          className="text-text-placeholder transition-colors hover:text-text-sub disabled:cursor-not-allowed disabled:opacity-50"
                          style={textStyle('caption')}
                          onClick={clearAllRecent}
                          disabled={recentSearches.length === 0}
                        >
                          모두 삭제
                        </button>
                      </div>
                      {recentSearches.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={`recent-${term}`}
                              type="button"
                              className="rounded-full border border-border-default bg-background-default text-text-sub shadow-[0_6px_14px_rgba(17,24,39,0.08)]"
                              style={{
                                ...textStyle('body3'),
                                fontWeight: 500,
                                paddingInline: spacing(3),
                                paddingBlock: spacing(1),
                              }}
                              onClick={() => handleChipClick(term)}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl bg-background-muted text-center"
                          style={{ padding: spacing(3) }}
                        >
                          <span
                            className="text-text-placeholder"
                            style={textStyle('body3')}
                          >
                            최근 검색어가 없습니다.
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>
          </main>
        </div>

        <BottomNavigation active="map" />
      </div>
    </div>
  );
};

export default MapPage;
