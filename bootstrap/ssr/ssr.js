import { Head, Link, createInertiaApp, usePage } from '@inertiajs/react';
import * as Toast from '@radix-ui/react-toast';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle, FileText, Info, LayoutDashboard, X } from 'lucide-react';
import { createContext, forwardRef, useCallback, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { jsx, jsxs } from 'react/jsx-runtime';
import { twMerge } from 'tailwind-merge';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
const Card = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('div', {
        ref,
        className: cn('rounded-lg border border-gray-200 bg-white shadow-sm', className),
        ...props,
    }),
);
Card.displayName = 'Card';
const CardHeader = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('div', { ref, className: cn('flex flex-col gap-1.5 p-6', className), ...props }),
);
CardHeader.displayName = 'CardHeader';
const CardTitle = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('h3', {
        ref,
        className: cn('text-2xl font-semibold leading-none tracking-tight', className),
        ...props,
    }),
);
CardTitle.displayName = 'CardTitle';
const CardDescription = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('p', { ref, className: cn('text-sm text-gray-500', className), ...props }),
);
CardDescription.displayName = 'CardDescription';
const CardContent = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('div', { ref, className: cn('p-6 pt-0', className), ...props }),
);
CardContent.displayName = 'CardContent';
const CardFooter = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('div', { ref, className: cn('flex items-center p-6 pt-0', className), ...props }),
);
CardFooter.displayName = 'CardFooter';
const ToastContext = createContext(void 0);
const ToastProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const notify = useCallback((title, options) => {
        setToast({
            title,
            description: options?.description || '',
            duration: options?.duration || 4e3,
            type: options?.type || 'info',
        });
        setOpen(false);
        requestAnimationFrame(() => setOpen(true));
    }, []);
    const notifySuccess = useCallback(
        (title, description, duration) => {
            notify(title, { description, duration, type: 'success' });
        },
        [notify],
    );
    const notifyInfo = useCallback(
        (title, description, duration) => {
            notify(title, { description, duration, type: 'info' });
        },
        [notify],
    );
    const notifyError = useCallback(
        (title, description, duration) => {
            notify(title, { description, duration, type: 'error' });
        },
        [notify],
    );
    const getIconAndStyles = (type) => {
        switch (type) {
            case 'success':
                return {
                    icon: /* @__PURE__ */ jsx(CheckCircle, { className: 'h-5 w-5 text-green-600' }),
                    className: 'border-green-200 bg-green-50',
                };
            case 'error':
                return {
                    icon: /* @__PURE__ */ jsx(AlertCircle, { className: 'h-5 w-5 text-red-600' }),
                    className: 'border-red-200 bg-red-50',
                };
            case 'info':
            default:
                return {
                    icon: /* @__PURE__ */ jsx(Info, { className: 'h-5 w-5 text-blue-600' }),
                    className: 'border-blue-200 bg-blue-50',
                };
        }
    };
    return /* @__PURE__ */ jsx(ToastContext.Provider, {
        value: { notify, notifySuccess, notifyInfo, notifyError },
        children: /* @__PURE__ */ jsxs(Toast.Provider, {
            swipeDirection: 'right',
            duration: toast?.duration,
            children: [
                children,
                toast &&
                    /* @__PURE__ */ jsxs(Toast.Root, {
                        open,
                        onOpenChange: setOpen,
                        className: cn(
                            'flex w-[32rem] flex-col gap-2 rounded-lg border p-4 shadow-xl',
                            getIconAndStyles(toast.type).className,
                        ),
                        children: [
                            /* @__PURE__ */ jsxs('div', {
                                className: 'flex items-center gap-3',
                                children: [
                                    /* @__PURE__ */ jsx('div', {
                                        className: 'shrink-0',
                                        children: getIconAndStyles(toast.type).icon,
                                    }),
                                    /* @__PURE__ */ jsx(Toast.Title, {
                                        className: 'flex-1 font-bold text-gray-900',
                                        children: toast.title,
                                    }),
                                    /* @__PURE__ */ jsx(Toast.Close, {
                                        className: 'shrink-0 rounded-full p-1 hover:bg-gray-100',
                                        children: /* @__PURE__ */ jsx(X, { className: 'h-4 w-4 text-gray-600' }),
                                    }),
                                ],
                            }),
                            toast.description &&
                                /* @__PURE__ */ jsx(Toast.Description, {
                                    className: 'ml-8 text-sm text-gray-600',
                                    children: toast.description,
                                }),
                        ],
                    }),
                /* @__PURE__ */ jsx(Toast.Viewport, {
                    className: 'fixed top-4 left-1/2 z-50 flex w-[32rem] -translate-x-1/2 flex-col items-center',
                }),
            ],
        }),
    });
};
function AppLayout({ children, title }) {
    const { app } = usePage().props;
    return /* @__PURE__ */ jsxs(ToastProvider, {
        children: [
            /* @__PURE__ */ jsx(Head, { title }),
            /* @__PURE__ */ jsxs('div', {
                className: 'flex min-h-screen bg-gray-50',
                children: [
                    /* @__PURE__ */ jsxs('aside', {
                        className: 'w-64 border-r border-gray-200 bg-white',
                        children: [
                            /* @__PURE__ */ jsx('div', {
                                className: 'p-6',
                                children: /* @__PURE__ */ jsx('h1', {
                                    className: 'text-lg font-bold text-gray-900',
                                    children: app?.name || 'ARK Core',
                                }),
                            }),
                            /* @__PURE__ */ jsxs('nav', {
                                className: 'px-3',
                                children: [
                                    /* @__PURE__ */ jsxs(Link, {
                                        href: '/',
                                        className:
                                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100',
                                        children: [
                                            /* @__PURE__ */ jsx(LayoutDashboard, { className: 'h-4 w-4' }),
                                            'Dashboard',
                                        ],
                                    }),
                                    /* @__PURE__ */ jsxs(Link, {
                                        href: '/posts',
                                        className:
                                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100',
                                        children: [/* @__PURE__ */ jsx(FileText, { className: 'h-4 w-4' }), 'Posts'],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    /* @__PURE__ */ jsx('main', { className: 'flex-1 p-8', children }),
                ],
            }),
        ],
    });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            default: AppLayout,
        },
        Symbol.toStringTag,
        { value: 'Module' },
    ),
);
function Dashboard() {
    return /* @__PURE__ */ jsx(AppLayout, {
        title: 'Dashboard',
        children: /* @__PURE__ */ jsxs('div', {
            className: 'space-y-6',
            children: [
                /* @__PURE__ */ jsxs('div', {
                    children: [
                        /* @__PURE__ */ jsx('h2', {
                            className: 'text-3xl font-bold tracking-tight',
                            children: 'Dashboard',
                        }),
                        /* @__PURE__ */ jsx('p', { className: 'text-gray-500', children: 'Bem-vindo ao ARK Core.' }),
                    ],
                }),
                /* @__PURE__ */ jsxs('div', {
                    className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
                    children: [
                        /* @__PURE__ */ jsxs(Card, {
                            children: [
                                /* @__PURE__ */ jsxs(CardHeader, {
                                    className: 'flex flex-row items-center justify-between pb-2',
                                    children: [
                                        /* @__PURE__ */ jsx(CardTitle, {
                                            className: 'text-sm font-medium',
                                            children: 'Posts',
                                        }),
                                        /* @__PURE__ */ jsx(FileText, { className: 'h-4 w-4 text-gray-500' }),
                                    ],
                                }),
                                /* @__PURE__ */ jsx(CardContent, {
                                    children: /* @__PURE__ */ jsx(CardDescription, {
                                        children: 'Gerencie os posts do sistema.',
                                    }),
                                }),
                            ],
                        }),
                        /* @__PURE__ */ jsxs(Card, {
                            children: [
                                /* @__PURE__ */ jsxs(CardHeader, {
                                    className: 'flex flex-row items-center justify-between pb-2',
                                    children: [
                                        /* @__PURE__ */ jsx(CardTitle, {
                                            className: 'text-sm font-medium',
                                            children: 'Template',
                                        }),
                                        /* @__PURE__ */ jsx(LayoutDashboard, { className: 'h-4 w-4 text-gray-500' }),
                                    ],
                                }),
                                /* @__PURE__ */ jsx(CardContent, {
                                    children: /* @__PURE__ */ jsx(CardDescription, {
                                        children: 'Este é o template padrão ARK Core.',
                                    }),
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            default: Dashboard,
        },
        Symbol.toStringTag,
        { value: 'Module' },
    ),
);
function render(page) {
    return createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = /* @__PURE__ */ Object.assign({
                './pages/dashboard.tsx': __vite_glob_0_0,
                './pages/layouts/AppLayout.tsx': __vite_glob_0_1,
            });
            return pages[`./pages/${name}.tsx`];
        },
        // @ts-expect-error SSR setup receives null element
        setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props }),
    });
}
export { render as default };
