import React from 'react';
import { useNavigate } from 'react-router-dom';

import leftIcon from '@/assets/icons/ic-left.svg';
import tourImage from '@/assets/images/tour-hyewon-20250930.jpg';
import { fontFamily, spacing, textStyle } from '@/theme/designSystem';

const groupTourUrl =
  'https://www.pusan.ac.kr/kor/CMS/CampusTour/newGroupTour/groupTourGuid.do?mCode=MN210';
const individualTourUrl =
  'https://www.pusan.ac.kr/kor/CMS/CampusTour/IndivTour/indivTourGuid.do?mCode=MN211';

const infoItems = [
  '부산대학교 캠퍼스 투어는 예약제로 운영됩니다.',
  '신청 후 담당자 확인을 거쳐 일정이 확정됩니다.',
  '공휴일 및 학내 행사 기간에는 투어가 진행되지 않습니다.',
  '세부 일정은 신청 페이지 안내를 참고해주세요.',
];

const CampusTourPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen justify-center bg-background-default text-text-default"
      style={{ fontFamily }}
    >
      <div className="flex min-h-screen w-full max-w-[420px] flex-col">
        <header
          className="flex flex-col"
          style={{
            gap: spacing(3),
            paddingInline: spacing(5),
            paddingTop: spacing(4),
          }}
        >
          <div className="grid grid-cols-[40px_1fr_40px] items-center">
            <button
              type="button"
              aria-label="뒤로가기"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background-fill text-text-sub shadow-[0_6px_16px_rgba(17,24,39,0.12)]"
              onClick={() => void navigate(-1)}
            >
              <img src={leftIcon} alt="" className="h-5 w-5" />
            </button>
            <h1
              className="text-center text-text-default"
              style={{ ...textStyle('body1'), fontWeight: 600 }}
            >
              캠퍼스 투어 신청
            </h1>
            <span aria-hidden className="h-10 w-10" />
          </div>
        </header>

        <main
          className="flex flex-1 flex-col"
          style={{
            gap: spacing(5),
            paddingInline: spacing(5),
            paddingTop: spacing(4),
            paddingBottom: spacing(8),
          }}
        >
          <section className="flex flex-col" style={{ gap: spacing(1.5) }}>
            <span
              className="text-text-default"
              style={{ ...textStyle('subtitle1'), fontWeight: 700 }}
            >
              캠퍼스 투어
            </span>
            <p className="text-text-sub" style={textStyle('body3')}>
              부산대학교의 캠퍼스를 둘러보세요.
            </p>
          </section>

          <section className="grid grid-cols-2" style={{ gap: spacing(3) }}>
            <a
              href={groupTourUrl}
              className="flex flex-col justify-between rounded-2xl border border-border-default bg-background-default shadow-[0_12px_24px_rgba(17,24,39,0.08)] transition-transform active:scale-[0.98]"
              style={{ padding: spacing(3), gap: spacing(3) }}
              aria-label="단체 투어 신청 페이지로 이동"
            >
              <div className="flex flex-col" style={{ gap: spacing(1) }}>
                <span
                  className="text-text-default"
                  style={{ ...textStyle('body1'), fontWeight: 700 }}
                >
                  단체 투어
                </span>
                <p className="text-text-sub" style={textStyle('body3')}>
                  중·고등학생 전용입니다.
                  <br />
                  20명 이상 300명 이하까지 신청할 수 있어요.
                </p>
              </div>
              <div className="flex justify-end text-brand-green">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <circle cx="9" cy="9" r="3.5" stroke="currentColor" />
                  <circle cx="16.5" cy="10" r="2.5" stroke="currentColor" />
                  <path
                    d="M3.5 18.5C4.4 15.9 6.5 14.5 9 14.5C11.5 14.5 13.6 15.9 14.5 18.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14.5 17.5C15 16 16.1 15.1 17.5 15.1C18.9 15.1 20 16 20.5 17.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </a>

            <a
              href={individualTourUrl}
              className="flex flex-col justify-between rounded-2xl border border-border-default bg-background-default shadow-[0_12px_24px_rgba(17,24,39,0.08)] transition-transform active:scale-[0.98]"
              style={{ padding: spacing(3), gap: spacing(3) }}
              aria-label="개인 투어 신청 페이지로 이동"
            >
              <div className="flex flex-col" style={{ gap: spacing(1) }}>
                <span
                  className="text-text-default"
                  style={{ ...textStyle('body1'), fontWeight: 700 }}
                >
                  개인 투어
                </span>
                <p className="text-text-sub" style={textStyle('body3')}>
                  매월 1~2회 진행됩니다.
                  <br />
                  10명 이상, 45일 이전까지 신청하세요.
                </p>
              </div>
              <div className="flex justify-end text-brand-blue">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" />
                  <path
                    d="M5 18.5C6.2 15.6 8.5 14.2 12 14.2C15.5 14.2 17.8 15.6 19 18.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </a>
          </section>

          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue to-brand-sky text-white shadow-[0_16px_32px_rgba(2,117,201,0.3)]"
            style={{ padding: spacing(3) }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col" style={{ gap: spacing(1) }}>
                <span style={{ ...textStyle('body1'), fontWeight: 700 }}>
                  캠퍼스 투어 영상
                  <br />
                  바로 보기
                </span>
                <span style={textStyle('body3')}>
                  투어 분위기를 미리 확인하세요.
                </span>
              </div>
              <div className="relative h-[74px] w-[110px] overflow-hidden rounded-xl bg-white/10">
                <img
                  src={tourImage}
                  alt="캠퍼스 투어"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col" style={{ gap: spacing(2) }}>
            <span
              className="text-text-default"
              style={{ ...textStyle('body2'), fontWeight: 600 }}
            >
              이용 안내
            </span>
            <ul
              className="list-disc pl-4 text-text-sub"
              style={textStyle('body3')}
            >
              {infoItems.map((item) => (
                <li key={item} className="py-1">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CampusTourPage;
