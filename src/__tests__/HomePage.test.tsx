import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import HomePage from '@/pages/HomePage';
import theme from '@/theme/theme';

const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );

describe('HomePage 화면', () => {
  test('히어로 영역의 메인 타이틀이 노출된다', () => {
    renderWithTheme(<HomePage />);

    expect(
      screen.getByText(/홍보대사가 추천하는 부산대 코스 TOP8은\?/i),
    ).toBeInTheDocument();
  });

  test('카테고리 버튼 4개가 모두 렌더링된다', () => {
    renderWithTheme(<HomePage />);

    const labels = [
      /캠퍼스\s*가이드/i,
      /인기\s*코스/i,
      /캠퍼스\s*투어/i,
      /부산대\s*유튜브/i,
    ];

    labels.forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  test('가을맞이 단풍 명소 섹션 타이틀이 보인다', () => {
    renderWithTheme(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /가을맞이 단풍 명소 추천/i }),
    ).toBeInTheDocument();
  });

  test('투어 사진 섹션이 렌더링되고 첫 번째 카드가 보인다', () => {
    renderWithTheme(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /해운대여자고등학교 1학년/i }),
    ).toBeInTheDocument();
  });

  test('하단 내비게이션에 홈 탭이 활성 상태로 표시된다', () => {
    renderWithTheme(<HomePage />);

    const homeButton = screen.getByRole('button', { name: /홈/i });
    expect(homeButton).toBeInTheDocument();
  });
});
