import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import leftIcon from '@/assets/icons/ic-left.svg';
import { courseSpots } from '@/components/course/courseSpots';
import {
  fontFamily,
  grayColors,
  spacing,
  textStyle,
} from '@/theme/designSystem';

const STORAGE_KEY = 'pnu-course-recent-searches';
const MAX_RECENT = 8;

const popularSearches = [
  '새벽벌도서관',
  '넉넉한 터',
  '경암체육관',
  '박물관',
  '인문관',
  '대학본부',
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

const CourseSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // ignore storage write errors
    }
  }, [recentSearches]);

  const trimmedQuery = normalizeTerm(query);
  const hasQuery = trimmedQuery.length > 0;

  const filteredSpots = useMemo(() => {
    if (!hasQuery) return [];
    const normalized = normalizeForSearch(trimmedQuery);
    return courseSpots.filter((spot) => {
      const target = `${spot.title} ${spot.description} ${spot.buildingNumber}`;
      return normalizeForSearch(target).includes(normalized);
    });
  }, [hasQuery, trimmedQuery]);

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

  const handleClearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
    updateRecentSearches(term);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    updateRecentSearches(term);
  };

  const handleResultClick = (term: string, id: string) => {
    updateRecentSearches(term);
    void navigate(`/course/${id}`);
  };

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const clearAllRecent = () => setRecentSearches([]);

  return (
    <div
      className="flex min-h-screen justify-center bg-white text-gray-900"
      style={{ fontFamily }}
    >
      <div
        className="flex w-full max-w-[420px] flex-col"
        style={{ paddingBottom: spacing(8) }}
      >
        <header
          className="flex flex-col"
          style={{
            gap: spacing(3),
            paddingInline: spacing(5),
            paddingTop: spacing(4),
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="뒤로가기"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-700 shadow-[0_2px_8px_rgba(17,24,39,0.08)]"
              onClick={() => void navigate(-1)}
            >
              <img src={leftIcon} alt="" className="h-5 w-5" />
            </button>
            <form
              className="flex flex-1 items-center rounded-full border border-gray-200 bg-gray-50 shadow-[0_2px_10px_rgba(17,24,39,0.06)]"
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
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="장소를 검색해보세요."
                className="flex-1 bg-transparent text-gray-700 placeholder:text-text-placeholder focus:outline-none"
                style={textStyle('body2')}
                aria-label="코스 검색"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="입력 삭제"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300"
                  onClick={handleClearQuery}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3L9 9"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 3L3 9"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : null}
            </form>
          </div>
          <p className="text-gray-500" style={textStyle('body3')}>
            코스에서 찾고 싶은 장소를 입력해보세요.
          </p>
        </header>

        <main
          className="flex flex-col"
          style={{
            gap: spacing(8),
            paddingInline: spacing(5),
            paddingTop: spacing(4),
          }}
        >
          {hasQuery ? (
            <section className="flex flex-col" style={{ gap: spacing(4) }}>
              <div className="flex items-center justify-between">
                <span
                  className="text-gray-700"
                  style={{ ...textStyle('body1'), fontWeight: 600 }}
                >
                  검색 결과
                </span>
                <span className="text-gray-400" style={textStyle('body3')}>
                  {filteredSpots.length}곳
                </span>
              </div>
              {filteredSpots.length > 0 ? (
                <div className="flex flex-col" style={{ gap: spacing(3) }}>
                  {filteredSpots.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      className="flex w-full cursor-pointer rounded-none border border-gray-100 bg-white text-left shadow-[0_12px_30px_rgba(17,24,39,0.06)] transition-shadow duration-150 hover:shadow-[0_16px_36px_rgba(17,24,39,0.08)] focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                      aria-label={`${spot.title} 상세 보기`}
                      onClick={() => handleResultClick(spot.title, spot.id)}
                    >
                      <div className="shrink-0">
                        <img
                          src={spot.image}
                          alt={spot.title}
                          className="h-[116px] w-[116px] object-cover"
                        />
                      </div>
                      <div
                        className="flex flex-1 flex-col gap-2"
                        style={{
                          padding: `${spacing(2)} ${spacing(3)} ${spacing(2.5)}`,
                        }}
                      >
                        {spot.badge ? (
                          <span
                            className="inline-flex w-fit items-center rounded bg-brand-sky text-white shadow-[0_6px_14px_rgba(2,117,201,0.18)]"
                            style={{
                              ...textStyle('caption'),
                              fontWeight: 700,
                              paddingInline: spacing(2),
                              paddingBlock: spacing(0.5),
                            }}
                          >
                            {spot.badge}
                          </span>
                        ) : null}
                        <h3
                          className="text-left text-gray-700"
                          style={{ ...textStyle('body1'), fontWeight: 500 }}
                        >
                          {spot.title}
                        </h3>
                        <p
                          className="text-left text-gray-600"
                          style={{
                            ...textStyle('body3'),
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {spot.description}
                        </p>
                        <span
                          className="text-left text-gray-400"
                          style={textStyle('body3')}
                        >
                          건물번호: {spot.buildingNumber}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center rounded-none border border-gray-100 bg-gray-50 text-center"
                  style={{
                    gap: spacing(3),
                    paddingInline: spacing(4),
                    paddingBlock: spacing(4),
                  }}
                >
                  <p className="text-gray-500" style={textStyle('body3')}>
                    검색 결과가 없습니다. 다른 키워드를 입력해보세요.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={`popular-empty-${term}`}
                        type="button"
                        className="inline-flex items-center rounded bg-gray-100 text-gray-600 shadow-[0_6px_14px_rgba(17,24,39,0.06)] transition-colors hover:bg-gray-200"
                        style={{
                          ...textStyle('body3'),
                          fontWeight: 600,
                          paddingInline: spacing(2),
                          paddingBlock: spacing(0.5),
                        }}
                        onClick={() => handlePopularClick(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ) : (
            <>
              <section className="flex flex-col" style={{ gap: spacing(3) }}>
                <span
                  className="text-gray-700"
                  style={{ ...textStyle('body1'), fontWeight: 600 }}
                >
                  인기 검색
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="inline-flex items-center rounded bg-gray-100 text-gray-600 shadow-[0_6px_14px_rgba(17,24,39,0.06)] transition-colors hover:bg-gray-200"
                      style={{
                        ...textStyle('body3'),
                        fontWeight: 400,
                        paddingInline: spacing(2),
                        paddingBlock: spacing(0.5),
                      }}
                      onClick={() => handlePopularClick(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>

              <section className="flex flex-col" style={{ gap: spacing(3) }}>
                <div className="flex items-center justify-between">
                  <span
                    className="text-gray-700"
                    style={{ ...textStyle('body1'), fontWeight: 600 }}
                  >
                    최근 검색
                  </span>
                  <button
                    type="button"
                    className="text-gray-400 transition-colors hover:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                    style={textStyle('caption')}
                    onClick={clearAllRecent}
                    disabled={recentSearches.length === 0}
                  >
                    모두 삭제
                  </button>
                </div>
                {recentSearches.length > 0 ? (
                  <div className="flex flex-col divide-y divide-gray-100">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className="flex items-center justify-between"
                        style={{
                          paddingInline: spacing(1),
                          paddingBlock: spacing(2),
                        }}
                      >
                        <button
                          type="button"
                          className="flex-1 text-left text-gray-700"
                          style={textStyle('body2')}
                          onClick={() => handleRecentClick(term)}
                        >
                          {term}
                        </button>
                        <button
                          type="button"
                          aria-label={`${term} 삭제`}
                          className="ml-3 flex h-6 w-6 items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
                          onClick={() => removeRecent(term)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 3L9 9"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9 3L3 9"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-none border border-gray-100 bg-gray-50 text-center"
                    style={{
                      paddingInline: spacing(4),
                      paddingBlock: spacing(4),
                    }}
                  >
                    <p className="text-gray-400" style={textStyle('body3')}>
                      최근 검색어가 없습니다.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseSearchPage;
