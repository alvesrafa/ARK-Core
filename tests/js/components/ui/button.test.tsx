import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
    it('renders with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        await userEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies variant classes', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-red');
    });
});
