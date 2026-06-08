import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Modal from './Modal';

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-root"></div>';
  });

  it('renders children inside portal', () => {
    render(
      <Modal isOpen title="Test modal" onClose={vi.fn()}>
        <button type="button">Focusable content</button>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Focusable content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen title="Test modal" onClose={onClose}>
        <button type="button">Focusable content</button>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /close modal/i }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen title="Test modal" onClose={onClose}>
        <button type="button">Focusable content</button>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} title="Test modal" onClose={vi.fn()}>
        <button type="button">Focusable content</button>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
