import React from 'react';
import styled from 'styled-components';

import guideIcon from '@/assets/icons/ic-guide.svg';
import starIcon from '@/assets/icons/ic-star.svg';
import tourIcon from '@/assets/icons/ic-tour.svg';
import youtubeIcon from '@/assets/icons/ic-youtube.svg';
import { typographyMixin } from '@/theme/theme';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin: 0 -${({ theme }) => theme.spacing(2.5)}
    ${({ theme }) => theme.spacing(2)};
  width: auto;
  background-color: ${({ theme }) => theme.palette.surface.card};
  padding: ${({ theme }) => theme.spacing(1.5)}
    ${({ theme }) => theme.spacing(2.5)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing(2)};
    margin: 0 -${({ theme }) => theme.spacing(3)}
      ${({ theme }) => theme.spacing(2)};
    padding: ${({ theme }) => theme.spacing(1.75)}
      ${({ theme }) => theme.spacing(3)};
  }
`;

const ItemButton = styled.button`
  background-color: ${({ theme }) => theme.palette.surface.card};
  border-radius: 0;
  border: none;
  padding: ${({ theme }) => theme.spacing(1.25)} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  cursor: pointer;
  transition: transform 0.12s ease-out;
  touch-action: manipulation;

  &:active {
    transform: translateY(1px) scale(0.99);
  }

  &:hover {
    background-color: transparent;
  }
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const Label = styled.span`
  ${typographyMixin('caption')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.palette.text.primary};
  text-align: center;
  white-space: pre-line;
`;

type CategoryItem = {
  id: string;
  label: string;
  icon: string;
};

const categories: CategoryItem[] = [
  { id: 'guide', label: '캠퍼스\n가이드', icon: guideIcon },
  { id: 'popular', label: '인기\n코스', icon: starIcon },
  { id: 'tour', label: '캠퍼스\n투어', icon: tourIcon },
  { id: 'youtube', label: '부산대\n유튜브', icon: youtubeIcon },
];

const CategoryGrid: React.FC = () => {
  return (
    <Grid>
      {categories.map((item) => (
        <ItemButton key={item.id} type="button">
          <IconWrapper>
            <img src={item.icon} alt="" />
          </IconWrapper>
          <Label>{item.label}</Label>
        </ItemButton>
      ))}
    </Grid>
  );
};

export default CategoryGrid;
