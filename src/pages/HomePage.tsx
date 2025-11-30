import React from 'react';
import styled from 'styled-components';

import chatIcon from '@/assets/icons/ic-chat.svg';
import AutumnSpotSection from '@/components/home/AutumnSpotSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import HeroCarousel from '@/components/home/HeroCarousel';
import TourPhotoSection from '@/components/home/TourPhotoSection';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import { typographyMixin } from '@/theme/theme';

const Root = styled.div`
  position: relative;
  min-height: 100vh;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.palette.background.default};
  display: flex;
  flex-direction: column;
`;

const MainScroll = styled.main`
  flex: 1;
  overflow-y: auto;
  padding-top: 0;
  padding-inline: ${({ theme }) => theme.spacing(0)};
  padding-bottom: ${({ theme }) => theme.spacing(12)};
`;

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(3)}
    ${({ theme }) => theme.spacing(2.5)} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-left: ${({ theme }) => theme.spacing(3)};
    padding-right: ${({ theme }) => theme.spacing(3)};
  }
`;

const MutedSection = styled(Section)`
  background-color: ${({ theme }) => theme.palette.background.default};
  padding-bottom: ${({ theme }) => theme.spacing(3.5)};
  border-radius: 0;
`;

const AutumnSectionWrapper = styled(MutedSection)`
  background-color: #f3f4f6;
`;

const TourSectionWrapper = styled(MutedSection)`
  background-color: #f3f4f6;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

const SectionTitle = styled.h2`
  ${typographyMixin('h2')};
  font-size: 17px;
  line-height: 1.35;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.palette.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.75)};
  margin: 0;
`;

const Emoji = styled.span`
  font-size: 17px;
`;

const ChatFab = styled.button`
  position: fixed;
  right: ${({ theme }) => theme.spacing(3)};
  bottom: ${({ theme }) => theme.spacing(14)};
  width: 64px;
  height: 64px;
  border: none;
  border-radius: 999px;
  background: #0275c9;
  box-shadow: 0 12px 30px rgba(2, 117, 201, 0.32);
  padding: 0;
  z-index: 25;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing(0.25)};

  img {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }

  span {
    ${typographyMixin('caption')};
    color: ${({ theme }) => theme.palette.text.onDark};
    line-height: 1.2;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    right: ${({ theme }) => theme.spacing(3.5)};
    bottom: ${({ theme }) => theme.spacing(15)};
  }
`;

const HomePage: React.FC = () => {
  return (
    <Root>
      <MainScroll aria-label="메인 콘텐츠">
        <HeroCarousel />

        <Section aria-label="캠퍼스 길잡이">
          <CategoryGrid />
        </Section>

        <AutumnSectionWrapper aria-labelledby="autumn-section">
          <SectionHeader>
            <SectionTitle id="autumn-section">
              가을맞이 단풍 명소 추천 <Emoji aria-hidden="true">🍁</Emoji>
            </SectionTitle>
          </SectionHeader>
          <AutumnSpotSection />
        </AutumnSectionWrapper>

        <TourSectionWrapper aria-labelledby="tour-photo-section">
          <SectionHeader>
            <SectionTitle id="tour-photo-section">
              투어 사진 <Emoji aria-hidden="true">📸</Emoji>
            </SectionTitle>
          </SectionHeader>
          <TourPhotoSection />
        </TourSectionWrapper>
      </MainScroll>

      <ChatFab type="button" aria-label="챗봇 열기">
        <img src={chatIcon} alt="챗봇" />
        <span>챗봇</span>
      </ChatFab>

      <BottomNavigation active="home" />
    </Root>
  );
};

export default HomePage;
