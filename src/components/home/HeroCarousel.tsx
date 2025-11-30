import React from 'react';
import styled from 'styled-components';

import bellIcon from '@/assets/icons/ic-bell.svg';
import heroImg from '@/assets/images/hero-campus.jpg';
import { typographyMixin } from '@/theme/theme';

const HeroRoot = styled.section`
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background-color: #000;
  border-radius: 0;
`;

const HeroImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${heroImg});
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.55) 55%,
    rgba(0, 0, 0, 0.85) 100%
  );
`;

const NotificationButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing(3)};
  right: ${({ theme }) => theme.spacing(3)};
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  z-index: 3;

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
  }
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(5.5)}
    ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4.5)};
  color: ${({ theme }) => theme.palette.text.onDark};
  z-index: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-inline: ${({ theme }) => theme.spacing(3)};
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.75)};
`;

const SubTitle = styled.span`
  ${typographyMixin('caption')};
  opacity: 0.8;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const Title = styled.h1`
  ${typographyMixin('h1')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: 700;
  line-height: 1.4;
  color: ${({ theme }) => theme.palette.text.onDark};
  margin: 0 0 ${({ theme }) => theme.spacing(1.5)};
`;

const Subtitle = styled.p`
  ${typographyMixin('body2')};
  opacity: 0.85;
  margin: 0 0 ${({ theme }) => theme.spacing(2.5)};
`;

const Pagination = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing(3)};
  bottom: ${({ theme }) => theme.spacing(3)};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(0.5)}
    ${({ theme }) => theme.spacing(1.5)};
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.4);
  color: ${({ theme }) => theme.palette.text.onDark};
  ${typographyMixin('caption')};
  font-size: 11.5px;
`;

const HeroCarousel: React.FC = () => {
  return (
    <HeroRoot aria-label="메인 추천 코스">
      <HeroImage />
      <HeroOverlay />
      <HeroContent>
        <NotificationButton type="button" aria-label="알림">
          <img src={bellIcon} alt="알림" />
        </NotificationButton>
        <TextWrapper>
          <SubTitle>오직 PNU GUIDE에서만 알 수 있는</SubTitle>
          <Title>홍보대사가 추천하는 부산대 코스 TOP8은?</Title>
          <Subtitle>지금 바로 캠퍼스 투어 코스를 확인해 보세요.</Subtitle>
        </TextWrapper>
        <Pagination>
          <span>&lt;</span>
          <span>1 / 3</span>
          <span>&gt;</span>
        </Pagination>
      </HeroContent>
    </HeroRoot>
  );
};

export default HeroCarousel;
