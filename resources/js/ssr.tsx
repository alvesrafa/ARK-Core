import { createInertiaApp } from '@inertiajs/react';
import ReactDOMServer from 'react-dom/server';

export default function render(page: Parameters<typeof createInertiaApp>[0] extends { page?: infer P } ? P : never) {
    return createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
            return pages[`./pages/${name}.tsx`];
        },
        // @ts-expect-error SSR setup receives null element
        setup: ({ App, props }) => <App {...props} />,
    });
}
