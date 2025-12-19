import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import buildingIcon from '@/assets/icons/ic-building.svg';
import clockIcon from '@/assets/icons/ic-clock.svg';
import { courseSpots } from '@/components/course/courseSpots';
import type { CourseSpot } from '@/components/course/courseSpots';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import {
  fontFamily,
  grayColors,
  spacing,
  textStyle,
} from '@/theme/designSystem';

type CampusKey = 'busan' | 'yangsan' | 'miryang' | 'ami';
type TabKey = '인기' | '역사·문화' | '공부·휴식';

const campusOptions: { key: CampusKey; label: string }[] = [
  { key: 'busan', label: '부산캠퍼스' },
  { key: 'yangsan', label: '양산캠퍼스' },
  { key: 'miryang', label: '밀양캠퍼스' },
  { key: 'ami', label: '아미캠퍼스' },
];

const tabs: TabKey[] = ['인기', '역사·문화', '공부·휴식'];
const historyCultureIds = new Set([
  'pnu-museum',
  'geo-museum',
  'democracy-hill',
  'memorial-1016',
]);
const studyRestIds = new Set([
  'neokneok-hill',
  'geumjeong-hall-cafeteria',
  'saebyeok-library',
  'yewonjeong',
  'october-square',
  'mirinae-gul',
  'garden-of-truth',
  'unjukjeong',
  'sculpture-park',
]);

const orderWithBadgeFirst = (list: typeof courseSpots) =>
  list
    .map((spot, index) => ({ spot, index }))
    .sort((a, b) => {
      const aBadge = a.spot.badge === '인기' ? 1 : 0;
      const bBadge = b.spot.badge === '인기' ? 1 : 0;
      if (aBadge !== bBadge) return bBadge - aBadge;
      return a.index - b.index;
    })
    .map(({ spot }) => spot);

const CoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('인기');
  const [selectedCampus, setSelectedCampus] = useState<CampusKey>('busan');
  const [campusMenuOpen, setCampusMenuOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<CourseSpot | null>(null);
  const navigate = useNavigate();

  const popularSpots = useMemo(
    () => courseSpots.filter((spot) => spot.badge === '인기'),
    [],
  );

  const visibleSpots = useMemo(() => {
    if (selectedCampus !== 'busan') return [];

    if (activeTab === '인기') return orderWithBadgeFirst(popularSpots);

    if (activeTab === '역사·문화') {
      return orderWithBadgeFirst(
        courseSpots.filter((spot) => historyCultureIds.has(spot.id)),
      );
    }

    if (activeTab === '공부·휴식') {
      return orderWithBadgeFirst(
        courseSpots.filter((spot) => studyRestIds.has(spot.id)),
      );
    }

    return [];
  }, [activeTab, popularSpots, selectedCampus]);

  const handleSpotSelect = (spot: CourseSpot) => {
    setSelectedSpot(spot);
    setCampusMenuOpen(false);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    spot: CourseSpot,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSpotSelect(spot);
    }
  };

  const closeModal = () => setSelectedSpot(null);

  useEffect(() => {
    if (!selectedSpot) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedSpot(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedSpot]);

  const totalCount = visibleSpots.length;

  return (
    <div
      className="flex min-h-screen flex-col items-center bg-white text-gray-900"
      style={{ fontFamily }}
    >
      <div
        className="flex w-full max-w-[420px] flex-col"
        style={{ paddingBottom: spacing(16) }}
      >
        <header
          className="flex flex-col gap-3"
          style={{
            paddingInline: spacing(5),
            paddingTop: spacing(4),
          }}
        >
          <div className="flex items-center gap-5">
            {tabs.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  className="relative pb-2 text-gray-600"
                  aria-current={isActive ? 'page' : undefined}
                  style={textStyle('body2')}
                  onClick={() => setActiveTab(tab)}
                >
                  <span
                    className={isActive ? 'text-brand-blue' : 'text-gray-600'}
                  >
                    {tab}
                  </span>
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 block h-0.5 rounded-full bg-brand-blue"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span style={textStyle('body3')}>총 {totalCount}곳</span>
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white shadow-[0_2px_8px_rgba(17,24,39,0.08)]"
                style={{
                  paddingInline: spacing(3),
                  paddingBlock: spacing(1.25),
                }}
                aria-haspopup="true"
                aria-expanded={campusMenuOpen}
                onClick={() => setCampusMenuOpen((prev) => !prev)}
              >
                <span style={{ ...textStyle('body2'), fontWeight: 600 }}>
                  {campusOptions.find((c) => c.key === selectedCampus)?.label ??
                    '캠퍼스 선택'}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke={grayColors[400] ?? '#9CA3AF'}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {campusMenuOpen ? (
                <div
                  className="absolute right-0 top-12 z-10 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(17,24,39,0.12)]"
                  role="menu"
                >
                  {campusOptions.map((campus) => (
                    <button
                      key={campus.key}
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                      style={textStyle('body2')}
                      onClick={() => {
                        setSelectedCampus(campus.key);
                        setCampusMenuOpen(false);
                      }}
                    >
                      <span>{campus.label}</span>
                      {selectedCampus === campus.key ? (
                        <span className="text-brand-blue" aria-hidden>
                          ●
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                aria-label="검색"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-[0_2px_8px_rgba(17,24,39,0.08)]"
                onClick={() => void navigate('/course/search')}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5 16.5L21 21"
                    stroke={grayColors[500] ?? '#6B7280'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke={grayColors[600] ?? '#4B5563'}
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <section
          className="flex flex-col gap-4"
          style={{
            paddingInline: spacing(5),
            paddingTop: spacing(2),
            paddingBottom: spacing(8),
          }}
        >
          {visibleSpots.map((spot) => (
            <button
              type="button"
              key={spot.id}
              className="flex cursor-pointer rounded-none border border-gray-100 bg-white shadow-[0_12px_30px_rgba(17,24,39,0.06)] transition-shadow duration-150 hover:shadow-[0_16px_36px_rgba(17,24,39,0.08)] focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              aria-label={`${spot.title} 상세 보기`}
              onClick={() => handleSpotSelect(spot)}
              onKeyDown={(event) => handleCardKeyDown(event, spot)}
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
                    className="inline-flex w-fit items-center rounded bg-brand-sky px-2 py-0.5 text-white shadow-[0_6px_14px_rgba(2,117,201,0.18)]"
                    style={{ ...textStyle('caption'), fontWeight: 700 }}
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
                    WebkitLineClamp: spot.badge ? 2 : 4,
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
                  건물번호: {spot.buildingNumber || '정보 없음'}
                </span>
              </div>
            </button>
          ))}
        </section>
      </div>

      <BottomNavigation active="course" />

      {selectedSpot
        ? (() => {
            const operatingHours = selectedSpot.operatingHours ?? [];
            const hasOperatingHours = operatingHours.length > 0;
            const inquiryOnly =
              hasOperatingHours &&
              operatingHours.every(
                (hours) =>
                  hours.times.length === 1 && hours.times[0].includes('문의'),
              );

            return (
              <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 pb-4">
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  onClick={closeModal}
                />
                <div
                  className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-t-3xl bg-white shadow-[0_24px_48px_rgba(17,24,39,0.18)]"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${selectedSpot.title} 정보`}
                >
                  <div className="flex items-start justify-between px-5 pt-5 pb-3">
                    <h2
                      className="text-gray-900"
                      style={{ ...textStyle('h2'), fontWeight: 700 }}
                    >
                      {selectedSpot.title}
                    </h2>
                    <button
                      type="button"
                      aria-label="닫기"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                      onClick={closeModal}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="px-5 pb-6">
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={selectedSpot.image}
                        alt={selectedSpot.title}
                        className="h-[168px] w-full object-cover"
                      />
                    </div>

                    <p
                      className="mt-4 text-gray-700"
                      style={{
                        ...textStyle('body2'),
                      }}
                    >
                      {selectedSpot.description}
                    </p>

                    <div
                      className="mt-4 flex flex-col gap-3 text-gray-700"
                      style={textStyle('body2')}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={clockIcon}
                          alt=""
                          className="h-5 w-5 shrink-0"
                        />
                        <div className="flex flex-col gap-3">
                          {inquiryOnly ? (
                            <span
                              className="text-gray-700"
                              style={textStyle('body2')}
                            >
                              문의
                            </span>
                          ) : hasOperatingHours ? (
                            operatingHours.map((hours) => (
                              <div
                                key={`${selectedSpot.id}-${hours.label}`}
                                className="flex gap-4"
                              >
                                <span className="w-12 shrink-0 text-gray-600">
                                  {hours.label}
                                </span>
                                <div className="flex flex-col gap-1">
                                  {hours.times.map((time) => (
                                    <span key={time}>{time}</span>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : selectedSpot.contact ? (
                            <span
                              className="text-gray-700"
                              style={textStyle('body2')}
                            >
                              문의
                            </span>
                          ) : (
                            <span
                              className="text-gray-500"
                              style={textStyle('body3')}
                            >
                              운영시간 정보가 없습니다.
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <img
                          src={buildingIcon}
                          alt=""
                          className="h-5 w-5 shrink-0"
                        />
                        <span>
                          건물번호: {selectedSpot.buildingNumber || '정보 없음'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="h-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 shadow-[0_4px_10px_rgba(17,24,39,0.06)]"
                        style={{ ...textStyle('body2'), fontWeight: 600 }}
                      >
                        사진 인증
                      </button>
                      <button
                        type="button"
                        className="h-11 rounded-xl bg-brand-blue text-white shadow-[0_8px_18px_rgba(20,63,144,0.3)]"
                        style={{ ...textStyle('body2'), fontWeight: 700 }}
                        onClick={() => {
                          closeModal();
                          void navigate(`/course/${selectedSpot.id}`);
                        }}
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        : null}
    </div>
  );
};

export default CoursePage;
