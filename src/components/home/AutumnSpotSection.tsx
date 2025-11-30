import React from 'react';
import styled from 'styled-components';

import { courseSpots } from '@/components/course/courseSpots';
import { typographyMixin } from '@/theme/theme';

const ScrollRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1.5)};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing(0)} ${({ theme }) => theme.spacing(0)}
    ${({ theme }) => theme.spacing(1.5)};
  margin: 0 0 ${({ theme }) => theme.spacing(1.5)};
  background-color: transparent;
  border-radius: 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0;
  }

  scrollbar-width: none;
`;

const Card = styled.article`
  flex: 0 0 78%;
  max-width: 78%;
  background-color: ${({ theme }) => theme.palette.surface.card};
  border-radius: ${({ theme }) => theme.shape.borderRadiusLg};
  overflow: hidden;
  box-shadow: none;
  scroll-snap-align: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-basis: 48%;
    max-width: 48%;
  }
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  padding-top: 72%;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
  }
`;

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing(0)} ${({ theme }) => theme.spacing(2)}
    ${({ theme }) => theme.spacing(1.25)};
`;

const SpotTitle = styled.h3`
  ${typographyMixin('subtitle1')};
  margin: ${({ theme }) => theme.spacing(0.5)} 0
    ${({ theme }) => theme.spacing(0.5)};
  text-align: left;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const BuildingInfo = styled.p`
  ${typographyMixin('caption')};
  margin: 0;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const featuredSpots = courseSpots.filter((spot) =>
  ['humanities', 'saebyeok-library'].includes(spot.id),
);

const AutumnSpotSection: React.FC = () => {
  return (
    <ScrollRow aria-label="가을 캠퍼스 명소 리스트">
      {featuredSpots.map((spot) => (
        <Card key={spot.id}>
          <Thumbnail>
            <img src={spot.image} alt={`${spot.title} 사진`} />
          </Thumbnail>
          <CardBody>
            <SpotTitle>{spot.title}</SpotTitle>
            <BuildingInfo>건물번호: {spot.buildingNumber}</BuildingInfo>
          </CardBody>
        </Card>
      ))}
    </ScrollRow>
  );
};

export default AutumnSpotSection;
