import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { vi } from 'vitest';

import BottomNavigation from '@/components/navigation/BottomNavigation';
import theme from '@/theme/theme';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

const renderNav = (active: 'home' | 'course' | 'map' | 'spot' | 'my') =>
  render(
    <ThemeProvider theme={theme}>
      <BottomNavigation active={active} />
    </ThemeProvider>,
  );

describe('BottomNavigation', () => {
  beforeEach(() => mockedNavigate.mockClear());

  test('홈 탭을 누르면 / 경로로 이동한다', () => {
    renderNav('course');

    fireEvent.click(screen.getByRole('button', { name: '홈' }));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('코스 탭을 누르면 /course 경로로 이동한다', () => {
    renderNav('home');

    fireEvent.click(screen.getByRole('button', { name: '코스' }));
    expect(mockedNavigate).toHaveBeenCalledWith('/course');
  });

  test('현재 활성 탭을 누르면 이동하지 않는다', () => {
    renderNav('home');

    fireEvent.click(screen.getByRole('button', { name: '홈' }));
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
