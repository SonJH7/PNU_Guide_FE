import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { courseSpots } from '@/components/course/courseSpots';
import CoursePage from '@/pages/CoursePage';
import theme from '@/theme/theme';

const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );

const popularSpots = courseSpots.filter((spot) => spot.badge === '인기');
const historySpots = courseSpots.filter((spot) =>
  ['pnu-museum', 'geo-museum', 'democracy-hill', 'memorial-1016'].includes(
    spot.id,
  ),
);
const studySpots = courseSpots.filter((spot) =>
  [
    'neokneok-hill',
    'geumjeong-hall-cafeteria',
    'saebyeok-library',
    'yewonjeong',
    'october-square',
    'mirinae-gul',
    'garden-of-truth',
    'unjukjeong',
    'sculpture-park',
  ].includes(spot.id),
);

describe('코스 목록 화면', () => {
  test('카드 개수에 맞춰 총 n곳을 표시한다', () => {
    renderWithTheme(<CoursePage />);

    expect(screen.getByText(`총 ${popularSpots.length}곳`)).toBeInTheDocument();
  });

  test('하단 내비게이션에서 코스가 포커스 상태다', () => {
    renderWithTheme(<CoursePage />);

    const courseTab = screen.getByRole('button', { name: '코스' });
    expect(courseTab).toHaveAttribute('aria-current', 'page');
  });

  test('첫 번째 코스 카드의 제목과 건물번호가 노출된다', () => {
    renderWithTheme(<CoursePage />);

    expect(screen.getByText(popularSpots[0].title)).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`건물번호: ${popularSpots[0].buildingNumber}`),
      ),
    ).toBeInTheDocument();
  });

  test('다른 캠퍼스 선택 시 리스트가 비워진다', async () => {
    renderWithTheme(<CoursePage />);

    fireEvent.click(screen.getByRole('button', { name: '부산캠퍼스' }));
    fireEvent.click(await screen.findByRole('button', { name: '양산캠퍼스' }));

    expect(screen.getByText(/총 0곳/)).toBeInTheDocument();
    expect(screen.queryByText(popularSpots[0].title)).not.toBeInTheDocument();
  });

  test('역사·문화 탭에서는 지정된 4개만 보인다', () => {
    renderWithTheme(<CoursePage />);

    fireEvent.click(screen.getByRole('button', { name: '역사·문화' }));

    expect(screen.getByText(`총 ${historySpots.length}곳`)).toBeInTheDocument();
    historySpots.forEach((spot) => {
      expect(screen.getByText(spot.title)).toBeInTheDocument();
    });
    expect(screen.queryByText(popularSpots[0].title)).not.toBeInTheDocument();
  });

  test('공부·휴식 탭에서는 지정된 목록이 표시되고 인기 배지가 위로 정렬된다', () => {
    renderWithTheme(<CoursePage />);

    fireEvent.click(screen.getByRole('button', { name: '공부·휴식' }));

    expect(screen.getByText(`총 ${studySpots.length}곳`)).toBeInTheDocument();

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('새벽벌도서관');
    studySpots.forEach((spot) => {
      expect(screen.getByText(spot.title)).toBeInTheDocument();
    });
  });
});
