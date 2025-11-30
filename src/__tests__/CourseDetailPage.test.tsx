import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import CourseDetailPage from '@/pages/CourseDetailPage';
import theme from '@/theme/theme';

const renderDetail = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/course/:id" element={<CourseDetailPage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );

describe('코스 상세 화면', () => {
  test('인기 코스의 상세 정보가 노출된다', () => {
    renderDetail('/course/saebyeok-library');

    expect(screen.getByRole('heading', { name: '새벽벌도서관' })).toBeVisible();
    expect(screen.getByText(/24시간 운영하는/)).toBeVisible();
    expect(screen.getByText(/건물번호: 420/)).toBeVisible();
    expect(screen.getByText(/문의/)).toBeVisible();
  });

  test('없는 코스 아이디는 안내 메시지를 보여준다', () => {
    renderDetail('/course/unknown-course');

    expect(
      screen.getByRole('heading', { name: '코스 정보를 찾을 수 없어요' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '코스 목록으로' })).toBeVisible();
  });
});
