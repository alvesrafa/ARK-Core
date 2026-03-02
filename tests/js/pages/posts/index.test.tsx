import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock Inertia
vi.mock('@inertiajs/react', () => ({
    Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
        <a href={href} {...props}>{children}</a>
    ),
    router: {
        get: vi.fn(),
        delete: vi.fn(),
    },
    usePage: () => ({
        props: {
            app: { name: 'Test App' },
            flash: {},
        },
    }),
    Head: ({ title }: { title?: string }) => <title>{title}</title>,
}));

import PostsIndex from '@/pages/posts/index';

const mockPosts = {
    current_page: 1,
    data: [
        {
            id: 1,
            title: 'First Post',
            content: 'Content 1',
            status: 'published',
            published_at: '2024-01-01',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
        },
        {
            id: 2,
            title: 'Second Post',
            content: 'Content 2',
            status: 'draft',
            published_at: null,
            created_at: '2024-01-02',
            updated_at: '2024-01-02',
        },
    ],
    first_page_url: '/posts?page=1',
    from: 1,
    last_page: 1,
    last_page_url: '/posts?page=1',
    links: [],
    next_page_url: null,
    path: '/posts',
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
};

describe('Posts Index Page', () => {
    it('renders the page title', () => {
        render(<PostsIndex posts={mockPosts} filters={{}} />);
        expect(screen.getByRole('heading', { name: 'Posts' })).toBeInTheDocument();
    });

    it('renders post titles in the table', () => {
        render(<PostsIndex posts={mockPosts} filters={{}} />);
        expect(screen.getByText('First Post')).toBeInTheDocument();
        expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('renders the new post button', () => {
        render(<PostsIndex posts={mockPosts} filters={{}} />);
        expect(screen.getByText('Novo Post')).toBeInTheDocument();
    });

    it('renders search input', () => {
        render(<PostsIndex posts={mockPosts} filters={{}} />);
        expect(screen.getByPlaceholderText('Buscar posts...')).toBeInTheDocument();
    });

    it('shows status badges', () => {
        render(<PostsIndex posts={mockPosts} filters={{}} />);
        expect(screen.getByText('Publicado')).toBeInTheDocument();
        expect(screen.getByText('Rascunho')).toBeInTheDocument();
    });
});
