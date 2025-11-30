import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import App from '@/App';

describe('App ????', () => {
  it('? ?? ??? ???? ?????', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/TOP8/);
  });
});
