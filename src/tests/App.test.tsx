import { render, screen } from '@testing-library/react';

import { MagicalText } from '@/components/magical-text';

describe('Table', () => {
  it('renders magic', () => {
    render(<MagicalText text="text" />);

    screen.debug();
  });
});
