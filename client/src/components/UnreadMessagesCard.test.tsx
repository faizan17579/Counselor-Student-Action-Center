import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UnreadMessagesCard } from './UnreadMessagesCard';

const messages = [
  { id: 'm1', studentId: 'stu_001', from: 'Parent', subject: 'Hi', preview: 'Hello', read: false, receivedAt: new Date().toISOString() },
];

describe('UnreadMessagesCard', () => {
  it('renders count and opens modal', () => {
    render(<UnreadMessagesCard count={1} messages={messages} />);

    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText(/new items/i)).toBeTruthy();

    const btn = screen.getByRole('button', { name: /view unread messages/i });
    fireEvent.click(btn);

    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy();
  });
});
