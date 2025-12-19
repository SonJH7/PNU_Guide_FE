import React from 'react';
import styled from 'styled-components';

import bellIcon from '@/assets/icons/ic-blackbell.svg';
import completeBadge from '@/assets/images/complete.png';
import stampImage from '@/assets/images/stamp.png';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import { typographyMixin } from '@/theme/theme';

const stampItems = [
  { id: 'saebyeok-library', label: '새벽별도서관' },
  { id: 'central-library', label: '중앙도서관' },
  { id: 'humanities', label: '인문관' },
  { id: 'social', label: '사회관' },
  { id: 'geumjeong', label: '금정회관' },
  { id: 'munchang', label: '문창회관' },
  { id: 'business', label: '경제통상관' },
  { id: 'mechanical', label: '기계관' },
  { id: 'neokneok', label: '넉넉한터' },
];

const stampCount = 30;
const progressValue = 30;

const Root = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #e7f2fb;
`;

const Content = styled.div`
  position: relative;
  min-height: 100vh;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(4)}
    ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h1`
  margin: 0;
  ${typographyMixin('h2')};
  font-weight: 700;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const SummaryCard = styled.div`
  background: #ffffff;
  border-radius: ${({ theme }) => theme.shape.borderRadiusMd};
  padding: ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
`;

const SummaryMeta = styled.span`
  ${typographyMixin('body3')};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const SummaryCount = styled.span`
  ${typographyMixin('h1')};
  font-weight: 700;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const ProgressTrack = styled.div`
  height: 8px;
  background-color: #dbe7f4;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $value: number }>`
  width: ${({ $value }) => `${$value}%`};
  height: 100%;
  background-color: ${({ theme }) => theme.palette.primary.light};
  border-radius: 999px;
`;

const SummaryFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  ${typographyMixin('body3')};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const Main = styled.main`
  flex: 1;
  background-color: #ffffff;
  border-radius: 24px 24px 0 0;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(4)}
    ${({ theme }) => theme.spacing(16)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SectionTitle = styled.h2`
  margin: 0;
  ${typographyMixin('subtitle1')};
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const StampGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(2.5)};
`;

const StampCard = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.gray[200]};
  border-radius: ${({ theme }) => theme.shape.borderRadiusMd};
  background: #ffffff;
  padding: ${({ theme }) => theme.spacing(2)}
    ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  text-align: center;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
`;

const StampImageWrap = styled.div`
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StampImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CompleteBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-8deg);
`;

const CompleteBadgeImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CompleteBadgeText = styled.span`
  position: relative;
  z-index: 1;
  font-size: 9px;
  line-height: 1;
  font-weight: 200;
  letter-spacing: -0.3px;
  color: #ffffff;
`;

const StampLabel = styled.span`
  ${typographyMixin('body2')};
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const StampMeta = styled.span`
  ${typographyMixin('caption')};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const StampPage: React.FC = () => {
  return (
    <Root>
      <Content>
        <Header>
          <TitleRow>
            <Title>산지님의 보유 스탬프</Title>
            <IconButton type="button" aria-label="알림">
              <img src={bellIcon} alt="" />
            </IconButton>
          </TitleRow>

          <SummaryCard>
            <SummaryMeta>2025. 10. 1. 기준</SummaryMeta>
            <SummaryCount>{stampCount}개</SummaryCount>
            <ProgressTrack
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressValue}
            >
              <ProgressFill $value={progressValue} />
            </ProgressTrack>
            <SummaryFooter>
              <span>마지막으로 방문한 장소: 새벽별도서관</span>
              <span>진행률 ({progressValue}%)</span>
            </SummaryFooter>
          </SummaryCard>
        </Header>

        <Main>
          <SectionTitle>스탬프 내역</SectionTitle>
          <StampGrid>
            {stampItems.map((item) => (
              <StampCard key={item.id}>
                <StampImageWrap>
                  <StampImage src={stampImage} alt={`${item.label} 스탬프`} />
                  <CompleteBadge>
                    <CompleteBadgeImage src={completeBadge} alt="" />
                    <CompleteBadgeText>완료!</CompleteBadgeText>
                  </CompleteBadge>
                </StampImageWrap>
                <StampLabel>{item.label}</StampLabel>
                <StampMeta>+1개</StampMeta>
              </StampCard>
            ))}
          </StampGrid>
        </Main>
      </Content>

      <BottomNavigation active="stamp" />
    </Root>
  );
};

export default StampPage;
