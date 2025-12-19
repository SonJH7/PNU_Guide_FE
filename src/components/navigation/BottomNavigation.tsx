import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import courseIcon from '@/assets/icons/ic-course.svg';
import homeIcon from '@/assets/icons/ic-home.svg';
import mapIcon from '@/assets/icons/ic-map.svg';
import myIcon from '@/assets/icons/ic-my.svg';
import stampIcon from '@/assets/icons/ic-spot.svg';
import { typographyMixin } from '@/theme/theme';

type BottomNavigationKey = 'home' | 'course' | 'map' | 'stamp' | 'my';

type BottomNavigationProps = {
  active: BottomNavigationKey;
};

const NavRoot = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 420px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.surface.nav};
  box-shadow: ${({ theme }) => theme.elevation.nav};
  padding: ${({ theme }) => theme.spacing(1.25)}
    ${({ theme }) => theme.spacing(3)};
  display: flex;
  justify-content: space-between;
  z-index: 20;
`;

const NavButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.5)};
  color: ${({ $active, theme }) =>
    $active
      ? theme.palette.primary.main
      : (theme.palette.gray?.[400] ?? theme.palette.text.secondary)};
  ${typographyMixin('caption')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  position: relative;
  padding-top: ${({ theme }) => theme.spacing(1)};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 3px;
    border-radius: 999px;
    background-color: ${({ theme, $active }) =>
      $active ? theme.palette.primary.main : 'transparent'};
    transition: background-color 0.2s ease;
  }

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: ${({ $active }) =>
      $active
        ? 'brightness(0) saturate(100%) invert(17%) sepia(95%) saturate(1147%) hue-rotate(186deg) brightness(90%) contrast(96%)'
        : 'brightness(0) saturate(100%) invert(64%) sepia(7%) saturate(300%) hue-rotate(172deg) brightness(92%) contrast(88%)'};
  }
`;

const navItems: {
  key: BottomNavigationKey;
  label: string;
  icon: string;
  path?: string;
}[] = [
  { key: 'home', label: '홈', icon: homeIcon, path: '/' },
  { key: 'course', label: '코스', icon: courseIcon, path: '/course' },
  { key: 'map', label: '지도', icon: mapIcon },
  { key: 'stamp', label: '스탬프', icon: stampIcon, path: '/stamp' },
  { key: 'my', label: 'MY', icon: myIcon },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <NavRoot aria-label="하단 내비게이션">
      {navItems.map((item) => (
        <NavButton
          key={item.key}
          type="button"
          aria-label={item.label}
          aria-current={active === item.key ? 'page' : undefined}
          $active={active === item.key}
          onClick={() => {
            if (item.path && active !== item.key) {
              void navigate(item.path);
            }
          }}
        >
          <img src={item.icon} alt="" />
          <span>{item.label}</span>
        </NavButton>
      ))}
    </NavRoot>
  );
};

export default BottomNavigation;
