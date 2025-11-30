import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import buildingIcon from '@/assets/icons/ic-building.svg';
import callIcon from '@/assets/icons/ic-call.svg';
import clockIcon from '@/assets/icons/ic-clock.svg';
import infoIcon from '@/assets/icons/ic-info.svg';
import leftIcon from '@/assets/icons/ic-left.svg';
import quizIcon from '@/assets/icons/ic-quiz.svg';
import saveIcon from '@/assets/icons/ic-save.svg';
import phoneIcon from '@/assets/icons/ic-scall.svg';
import shareIcon from '@/assets/icons/ic-share.svg';
import { courseSpots } from '@/components/course/courseSpots';
import { fontFamily, textStyle } from '@/theme/designSystem';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const spot = courseSpots.find((item) => item.id === id);

  if (!spot) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-white text-gray-800"
        style={{ fontFamily }}
      >
        <div className="w-full max-w-[420px] px-6 text-center">
          <h1
            className="text-gray-900"
            style={{ ...textStyle('h2'), fontWeight: 700 }}
          >
            코스 정보를 찾을 수 없어요
          </h1>
          <p className="mt-2 text-gray-600" style={textStyle('body2')}>
            다시 시도하거나 코스 목록으로 돌아가 주세요.
          </p>
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-brand-blue px-4 py-3 text-white"
            style={{ ...textStyle('body2'), fontWeight: 700 }}
            onClick={() => void navigate('/course')}
          >
            코스 목록으로
          </button>
        </div>
      </div>
    );
  }

  const operatingHours = spot.operatingHours ?? [];
  const hasOperatingHours = operatingHours.length > 0;
  const inquiryOnly =
    hasOperatingHours &&
    operatingHours.every(
      (hours) => hours.times.length === 1 && hours.times[0].includes('문의'),
    );

  return (
    <div
      className="flex min-h-screen justify-center bg-white text-gray-900"
      style={{ fontFamily }}
    >
      <div className="flex w-full max-w-[420px] flex-col pb-12">
        <header className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            aria-label="뒤로가기"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-700 shadow-[0_2px_6px_rgba(17,24,39,0.08)]"
            onClick={() => void navigate(-1)}
          >
            <img src={leftIcon} alt="" className="h-5 w-5" />
          </button>
          <span />
        </header>

        <div className="px-0">
          <div className="relative overflow-hidden">
            <img
              src={spot.image}
              alt={spot.title}
              className="h-[220px] w-full object-cover"
            />
          </div>

          <div className="mt-5 flex flex-col gap-2 px-5 pb-3 border-b border-gray-100">
            <h1
              className="text-gray-900"
              style={{ ...textStyle('h3'), fontSize: '18px', fontWeight: 600 }}
            >
              {spot.title}
            </h1>
            <p className="text-gray-700" style={textStyle('body2')}>
              {spot.description}
            </p>
          </div>

          <div className="mt-4 px-5">
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: callIcon, label: '전화' },
                { icon: saveIcon, label: '저장' },
                { icon: quizIcon, label: '퀴즈' },
                { icon: shareIcon, label: '공유' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex flex-col items-center gap-2 rounded-lg bg-white px-2 py-3 text-gray-700 transition-transform duration-150 active:scale-[0.98]"
                  style={{ fontFamily }}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="h-6 w-6 object-contain"
                    aria-hidden
                  />
                  <span style={textStyle('body3')}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 h-3 w-full bg-gray-50" />

        <section
          className="flex flex-col gap-5 px-5 py-5"
          aria-label={`${spot.title} 상세 정보`}
        >
          <div className="flex items-start gap-3">
            <img src={clockIcon} alt="" className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <div className="flex flex-col gap-2 text-gray-700">
                {inquiryOnly ? (
                  <span
                    className="mt-0.5 text-gray-700"
                    style={textStyle('body2')}
                  >
                    문의
                  </span>
                ) : hasOperatingHours ? (
                  operatingHours.map((hours) => (
                    <div
                      key={`${spot.id}-${hours.label}`}
                      className="flex gap-4"
                      style={textStyle('body2')}
                    >
                      <span className="w-12 shrink-0 text-gray-700">
                        {hours.label}
                      </span>
                      <div className="flex flex-col gap-1">
                        {hours.times.map((time) => (
                          <span key={time}>{time}</span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : spot.contact ? (
                  <span
                    className="mt-0.5 text-gray-700"
                    style={textStyle('body2')}
                  >
                    문의
                  </span>
                ) : (
                  <span className="text-gray-500" style={textStyle('body3')}>
                    운영시간 정보가 없습니다.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src={infoIcon} alt="" className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <div className="flex flex-col gap-2">
                {spot.floors?.length ? (
                  spot.floors.map((floor) => (
                    <div key={`${spot.id}-${floor.title}`}>
                      <div className="text-gray-700" style={textStyle('body2')}>
                        {floor.title}
                      </div>
                      {floor.description ? (
                        <div
                          className="text-gray-700"
                          style={textStyle('body2')}
                        >
                          {floor.description}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500" style={textStyle('body3')}>
                    층별 정보가 없습니다.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src={buildingIcon} alt="" className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-gray-700" style={textStyle('body2')}>
                {spot.buildingNumber
                  ? `건물번호: ${spot.buildingNumber}`
                  : '건물번호 정보 없음'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src={phoneIcon} alt="" className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-gray-700" style={textStyle('body2')}>
                {spot.contact
                  ? `문의 사항: ${spot.contact}`
                  : '문의처 정보가 없습니다.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseDetailPage;
