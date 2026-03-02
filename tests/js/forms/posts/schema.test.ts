import { describe, expect, it } from 'vitest';
import { postSchema } from '@/forms/posts/schema';

describe('postSchema', () => {
    it('validates a valid post', () => {
        const result = postSchema.safeParse({
            title: 'Test Post',
            content: 'Test content',
            status: 'draft',
        });

        expect(result.success).toBe(true);
    });

    it('rejects empty title', () => {
        const result = postSchema.safeParse({
            title: '',
            content: 'Content',
            status: 'draft',
        });

        expect(result.success).toBe(false);
    });

    it('rejects empty content', () => {
        const result = postSchema.safeParse({
            title: 'Title',
            content: '',
            status: 'draft',
        });

        expect(result.success).toBe(false);
    });

    it('rejects invalid status', () => {
        const result = postSchema.safeParse({
            title: 'Title',
            content: 'Content',
            status: 'invalid',
        });

        expect(result.success).toBe(false);
    });

    it('accepts all valid statuses', () => {
        for (const status of ['draft', 'published', 'archived']) {
            const result = postSchema.safeParse({
                title: 'Title',
                content: 'Content',
                status,
            });
            expect(result.success).toBe(true);
        }
    });

    it('rejects title over 255 characters', () => {
        const result = postSchema.safeParse({
            title: 'a'.repeat(256),
            content: 'Content',
            status: 'draft',
        });

        expect(result.success).toBe(false);
    });
});
