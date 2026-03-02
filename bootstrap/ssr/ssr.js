import { createInertiaApp, Head, Link, router, useForm, usePage } from '@inertiajs/react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Slot } from '@radix-ui/react-slot';
import * as Toast from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Info,
    LayoutDashboard,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { createContext, forwardRef, useCallback, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { jsx, jsxs } from 'react/jsx-runtime';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
function formatDate(date) {
    if (!date) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
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
                                        children: 'Este é o template padrão Assefaz.',
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
const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-gray-900 text-white hover:bg-gray-800',
                destructive: 'bg-red-600 text-white hover:bg-red-700',
                outline: 'border border-gray-300 bg-white hover:bg-gray-50',
                secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                ghost: 'hover:bg-gray-100',
                link: 'text-gray-900 underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);
const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
});
Button.displayName = 'Button';
const Input = forwardRef(({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx('input', {
        type,
        className: cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        ),
        ref,
        ...props,
    });
});
Input.displayName = 'Input';
const Label = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx(LabelPrimitive.Root, {
        ref,
        className: cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className,
        ),
        ...props,
    }),
);
Label.displayName = 'Label';
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = forwardRef(({ className, children, ...props }, ref) =>
    /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
        ref,
        className: cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        ),
        ...props,
        children: [
            children,
            /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
                asChild: true,
                children: /* @__PURE__ */ jsx(ChevronDown, { className: 'h-4 w-4 opacity-50' }),
            }),
        ],
    }),
);
SelectTrigger.displayName = 'SelectTrigger';
const SelectContent = forwardRef(({ className, children, position = 'popper', ...props }, ref) =>
    /* @__PURE__ */ jsx(SelectPrimitive.Portal, {
        children: /* @__PURE__ */ jsx(SelectPrimitive.Content, {
            ref,
            className: cn(
                'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md',
                position === 'popper' && 'translate-y-1',
                className,
            ),
            position,
            ...props,
            children: /* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
                className: cn(
                    'p-1',
                    position === 'popper' &&
                        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
                ),
                children,
            }),
        }),
    }),
);
SelectContent.displayName = 'SelectContent';
const SelectItem = forwardRef(({ className, children, ...props }, ref) =>
    /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
        ref,
        className: cn(
            'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className,
        ),
        ...props,
        children: [
            /* @__PURE__ */ jsx('span', {
                className: 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
                children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, {
                    children: /* @__PURE__ */ jsx(Check, { className: 'h-4 w-4' }),
                }),
            }),
            /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children }),
        ],
    }),
);
SelectItem.displayName = 'SelectItem';
const Textarea = forwardRef(({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx('textarea', {
        className: cn(
            'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        ),
        ref,
        ...props,
    });
});
Textarea.displayName = 'Textarea';
function PostForm({ form, statuses, onSubmit, submitLabel }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };
    return /* @__PURE__ */ jsxs('form', {
        onSubmit: handleSubmit,
        className: 'space-y-6',
        children: [
            /* @__PURE__ */ jsxs('div', {
                className: 'space-y-2',
                children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: 'title', children: 'Título' }),
                    /* @__PURE__ */ jsx(Input, {
                        id: 'title',
                        value: form.data.title,
                        onChange: (e) => form.setData('title', e.target.value),
                        placeholder: 'Título do post',
                    }),
                    form.errors.title &&
                        /* @__PURE__ */ jsx('p', { className: 'text-sm text-red-600', children: form.errors.title }),
                ],
            }),
            /* @__PURE__ */ jsxs('div', {
                className: 'space-y-2',
                children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: 'content', children: 'Conteúdo' }),
                    /* @__PURE__ */ jsx(Textarea, {
                        id: 'content',
                        value: form.data.content,
                        onChange: (e) => form.setData('content', e.target.value),
                        placeholder: 'Conteúdo do post',
                        rows: 6,
                    }),
                    form.errors.content &&
                        /* @__PURE__ */ jsx('p', { className: 'text-sm text-red-600', children: form.errors.content }),
                ],
            }),
            /* @__PURE__ */ jsxs('div', {
                className: 'space-y-2',
                children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: 'status', children: 'Status' }),
                    /* @__PURE__ */ jsxs(Select, {
                        value: form.data.status,
                        onValueChange: (value) => form.setData('status', value),
                        children: [
                            /* @__PURE__ */ jsx(SelectTrigger, {
                                children: /* @__PURE__ */ jsx(SelectValue, { placeholder: 'Selecione o status' }),
                            }),
                            /* @__PURE__ */ jsx(SelectContent, {
                                children: Object.entries(statuses).map(([value, label]) =>
                                    /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value),
                                ),
                            }),
                        ],
                    }),
                    form.errors.status &&
                        /* @__PURE__ */ jsx('p', { className: 'text-sm text-red-600', children: form.errors.status }),
                ],
            }),
            /* @__PURE__ */ jsxs('div', {
                className: 'flex gap-3',
                children: [
                    /* @__PURE__ */ jsx(Button, {
                        type: 'submit',
                        disabled: form.processing,
                        children: form.processing ? 'Salvando...' : submitLabel,
                    }),
                    /* @__PURE__ */ jsx(Button, {
                        type: 'button',
                        variant: 'outline',
                        onClick: () => window.history.back(),
                        children: 'Cancelar',
                    }),
                ],
            }),
        ],
    });
}
function useFormWithZod({ schema, initialValues }) {
    const form = useForm(initialValues);
    const validate = useCallback(() => {
        const result = schema.safeParse(form.data);
        if (!result.success) {
            const zodError = result.error;
            const errors = {};
            for (const issue of zodError.issues) {
                const key = issue.path.join('.');
                if (!errors[key]) {
                    errors[key] = issue.message;
                }
            }
            form.clearErrors();
            for (const [key, message] of Object.entries(errors)) {
                form.setError(key, message);
            }
            return false;
        }
        form.clearErrors();
        return true;
    }, [form, schema]);
    const submitWithValidation = useCallback(
        (method, url) => {
            if (!validate()) return;
            form[method](url);
        },
        [form, validate],
    );
    return {
        ...form,
        validate,
        submitWithValidation,
    };
}
const postSchema = z.object({
    title: z
        .string({ error: 'O título é obrigatório.' })
        .min(1, 'O título é obrigatório.')
        .max(255, 'O título deve ter no máximo 255 caracteres.'),
    content: z.string({ error: 'O conteúdo é obrigatório.' }).min(1, 'O conteúdo é obrigatório.'),
    status: z.enum(['draft', 'published', 'archived'], {
        error: 'O status é obrigatório.',
    }),
});
function usePostForm({ initialValues } = {}) {
    const form = useFormWithZod({
        schema: postSchema,
        initialValues: {
            title: initialValues?.title || '',
            content: initialValues?.content || '',
            status: initialValues?.status || 'draft',
        },
    });
    const submitCreate = () => {
        form.submitWithValidation('post', '/posts');
    };
    const submitUpdate = (id) => {
        form.submitWithValidation('put', `/posts/${id}`);
    };
    return {
        ...form,
        submitCreate,
        submitUpdate,
    };
}
function PostsCreate({ statuses }) {
    const form = usePostForm();
    return /* @__PURE__ */ jsx(AppLayout, {
        title: 'Novo Post',
        children: /* @__PURE__ */ jsxs('div', {
            className: 'mx-auto max-w-2xl space-y-6',
            children: [
                /* @__PURE__ */ jsx('h2', { className: 'text-3xl font-bold tracking-tight', children: 'Novo Post' }),
                /* @__PURE__ */ jsxs(Card, {
                    children: [
                        /* @__PURE__ */ jsx(CardHeader, {
                            children: /* @__PURE__ */ jsx(CardTitle, { children: 'Dados do Post' }),
                        }),
                        /* @__PURE__ */ jsx(CardContent, {
                            children: /* @__PURE__ */ jsx(PostForm, {
                                form,
                                statuses,
                                onSubmit: form.submitCreate,
                                submitLabel: 'Criar Post',
                            }),
                        }),
                    ],
                }),
            ],
        }),
    });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            default: PostsCreate,
        },
        Symbol.toStringTag,
        { value: 'Module' },
    ),
);
function PostsEdit({ post, statuses }) {
    const form = usePostForm({
        initialValues: {
            title: post.title,
            content: post.content,
            status: post.status,
        },
    });
    return /* @__PURE__ */ jsx(AppLayout, {
        title: 'Editar Post',
        children: /* @__PURE__ */ jsxs('div', {
            className: 'mx-auto max-w-2xl space-y-6',
            children: [
                /* @__PURE__ */ jsx('h2', { className: 'text-3xl font-bold tracking-tight', children: 'Editar Post' }),
                /* @__PURE__ */ jsxs(Card, {
                    children: [
                        /* @__PURE__ */ jsx(CardHeader, {
                            children: /* @__PURE__ */ jsx(CardTitle, { children: 'Dados do Post' }),
                        }),
                        /* @__PURE__ */ jsx(CardContent, {
                            children: /* @__PURE__ */ jsx(PostForm, {
                                form,
                                statuses,
                                onSubmit: () => form.submitUpdate(post.id),
                                submitLabel: 'Salvar Alterações',
                            }),
                        }),
                    ],
                }),
            ],
        }),
    });
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            default: PostsEdit,
        },
        Symbol.toStringTag,
        { value: 'Module' },
    ),
);
function Pagination({ paginator, className }) {
    if (paginator.last_page <= 1) return null;
    return /* @__PURE__ */ jsxs('nav', {
        className: cn('flex items-center justify-between', className),
        children: [
            /* @__PURE__ */ jsxs('p', {
                className: 'text-sm text-gray-500',
                children: ['Mostrando ', paginator.from, ' a ', paginator.to, ' de ', paginator.total, ' resultados'],
            }),
            /* @__PURE__ */ jsx('div', {
                className: 'flex items-center gap-1',
                children: paginator.links.map((link, index) => {
                    if (!link.url) {
                        return /* @__PURE__ */ jsx(
                            'span',
                            {
                                className:
                                    'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-gray-400',
                                dangerouslySetInnerHTML: { __html: link.label },
                            },
                            index,
                        );
                    }
                    return /* @__PURE__ */ jsx(
                        Link,
                        {
                            href: link.url,
                            className: cn(
                                'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-colors',
                                link.active ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
                            ),
                            preserveState: true,
                            preserveScroll: true,
                            children:
                                link.label === '&laquo; Previous'
                                    ? /* @__PURE__ */ jsx(ChevronLeft, { className: 'h-4 w-4' })
                                    : link.label === 'Next &raquo;'
                                      ? /* @__PURE__ */ jsx(ChevronRight, { className: 'h-4 w-4' })
                                      : /* @__PURE__ */ jsx('span', {
                                            dangerouslySetInnerHTML: { __html: link.label },
                                        }),
                        },
                        index,
                    );
                }),
            }),
        ],
    });
}
const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-gray-900 text-white',
                secondary: 'border-transparent bg-gray-100 text-gray-900',
                destructive: 'border-transparent bg-red-600 text-white',
                outline: 'text-gray-900',
                success: 'border-transparent bg-green-100 text-green-800',
                warning: 'border-transparent bg-yellow-100 text-yellow-800',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);
function Badge({ className, variant, ...props }) {
    return /* @__PURE__ */ jsx('div', { className: cn(badgeVariants({ variant }), className), ...props });
}
const Table = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('div', {
        className: 'relative w-full overflow-auto',
        children: /* @__PURE__ */ jsx('table', {
            ref,
            className: cn('w-full caption-bottom text-sm', className),
            ...props,
        }),
    }),
);
Table.displayName = 'Table';
const TableHeader = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('thead', { ref, className: cn('[&_tr]:border-b', className), ...props }),
);
TableHeader.displayName = 'TableHeader';
const TableBody = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('tbody', { ref, className: cn('[&_tr:last-child]:border-0', className), ...props }),
);
TableBody.displayName = 'TableBody';
const TableRow = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('tr', {
        ref,
        className: cn('border-b transition-colors hover:bg-gray-50', className),
        ...props,
    }),
);
TableRow.displayName = 'TableRow';
const TableHead = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('th', {
        ref,
        className: cn('h-12 px-4 text-left align-middle font-medium text-gray-500', className),
        ...props,
    }),
);
TableHead.displayName = 'TableHead';
const TableCell = forwardRef(({ className, ...props }, ref) =>
    /* @__PURE__ */ jsx('td', { ref, className: cn('p-4 align-middle', className), ...props }),
);
TableCell.displayName = 'TableCell';
const statusVariant$1 = {
    draft: 'secondary',
    published: 'success',
    archived: 'default',
};
const statusLabel$1 = {
    draft: 'Rascunho',
    published: 'Publicado',
    archived: 'Arquivado',
};
function PostTable({ posts, onDelete }) {
    return /* @__PURE__ */ jsxs(Table, {
        children: [
            /* @__PURE__ */ jsx(TableHeader, {
                children: /* @__PURE__ */ jsxs(TableRow, {
                    children: [
                        /* @__PURE__ */ jsx(TableHead, { children: 'Título' }),
                        /* @__PURE__ */ jsx(TableHead, { children: 'Status' }),
                        /* @__PURE__ */ jsx(TableHead, { children: 'Publicado em' }),
                        /* @__PURE__ */ jsx(TableHead, { children: 'Criado em' }),
                        /* @__PURE__ */ jsx(TableHead, { className: 'text-right', children: 'Ações' }),
                    ],
                }),
            }),
            /* @__PURE__ */ jsx(TableBody, {
                children:
                    posts.length === 0
                        ? /* @__PURE__ */ jsx(TableRow, {
                              children: /* @__PURE__ */ jsx(TableCell, {
                                  colSpan: 5,
                                  className: 'text-center text-gray-500',
                                  children: 'Nenhum post encontrado.',
                              }),
                          })
                        : posts.map((post) =>
                              /* @__PURE__ */ jsxs(
                                  TableRow,
                                  {
                                      children: [
                                          /* @__PURE__ */ jsx(TableCell, {
                                              className: 'font-medium',
                                              children: post.title,
                                          }),
                                          /* @__PURE__ */ jsx(TableCell, {
                                              children: /* @__PURE__ */ jsx(Badge, {
                                                  variant: statusVariant$1[post.status] || 'secondary',
                                                  children: statusLabel$1[post.status] || post.status,
                                              }),
                                          }),
                                          /* @__PURE__ */ jsx(TableCell, { children: formatDate(post.published_at) }),
                                          /* @__PURE__ */ jsx(TableCell, { children: formatDate(post.created_at) }),
                                          /* @__PURE__ */ jsx(TableCell, {
                                              className: 'text-right',
                                              children: /* @__PURE__ */ jsxs('div', {
                                                  className: 'flex justify-end gap-1',
                                                  children: [
                                                      /* @__PURE__ */ jsx(Button, {
                                                          variant: 'ghost',
                                                          size: 'icon',
                                                          asChild: true,
                                                          children: /* @__PURE__ */ jsx(Link, {
                                                              href: `/posts/${post.id}`,
                                                              children: /* @__PURE__ */ jsx(Eye, {
                                                                  className: 'h-4 w-4',
                                                              }),
                                                          }),
                                                      }),
                                                      /* @__PURE__ */ jsx(Button, {
                                                          variant: 'ghost',
                                                          size: 'icon',
                                                          asChild: true,
                                                          children: /* @__PURE__ */ jsx(Link, {
                                                              href: `/posts/${post.id}/edit`,
                                                              children: /* @__PURE__ */ jsx(Pencil, {
                                                                  className: 'h-4 w-4',
                                                              }),
                                                          }),
                                                      }),
                                                      /* @__PURE__ */ jsx(Button, {
                                                          variant: 'ghost',
                                                          size: 'icon',
                                                          onClick: () => onDelete(post.id),
                                                          children: /* @__PURE__ */ jsx(Trash2, {
                                                              className: 'h-4 w-4 text-red-600',
                                                          }),
                                                      }),
                                                  ],
                                              }),
                                          }),
                                      ],
                                  },
                                  post.id,
                              ),
                          ),
            }),
        ],
    });
}
function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}
function PostsIndex({ posts, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 300);
    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get('/posts', { search: debouncedSearch || void 0 }, { preserveState: true, preserveScroll: true });
        }
    }, [debouncedSearch]);
    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este post?')) {
            router.delete(`/posts/${id}`, { preserveScroll: true });
        }
    };
    return /* @__PURE__ */ jsx(AppLayout, {
        title: 'Posts',
        children: /* @__PURE__ */ jsxs('div', {
            className: 'space-y-6',
            children: [
                /* @__PURE__ */ jsxs('div', {
                    className: 'flex items-center justify-between',
                    children: [
                        /* @__PURE__ */ jsx('h2', {
                            className: 'text-3xl font-bold tracking-tight',
                            children: 'Posts',
                        }),
                        /* @__PURE__ */ jsx(Button, {
                            asChild: true,
                            children: /* @__PURE__ */ jsxs(Link, {
                                href: '/posts/create',
                                children: [/* @__PURE__ */ jsx(Plus, { className: 'mr-2 h-4 w-4' }), 'Novo Post'],
                            }),
                        }),
                    ],
                }),
                /* @__PURE__ */ jsxs('div', {
                    className: 'relative max-w-sm',
                    children: [
                        /* @__PURE__ */ jsx(Search, {
                            className: 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400',
                        }),
                        /* @__PURE__ */ jsx(Input, {
                            placeholder: 'Buscar posts...',
                            value: search,
                            onChange: (e) => setSearch(e.target.value),
                            className: 'pl-10',
                        }),
                    ],
                }),
                /* @__PURE__ */ jsx('div', {
                    className: 'rounded-lg border bg-white',
                    children: /* @__PURE__ */ jsx(PostTable, { posts: posts.data, onDelete: handleDelete }),
                }),
                /* @__PURE__ */ jsx(Pagination, { paginator: posts }),
            ],
        }),
    });
}
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            default: PostsIndex,
        },
        Symbol.toStringTag,
        { value: 'Module' },
    ),
);
const statusVariant = {
    draft: 'secondary',
    published: 'success',
    archived: 'default',
};
const statusLabel = {
    draft: 'Rascunho',
    published: 'Publicado',
    archived: 'Arquivado',
};
function PostsShow({ post }) {
    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este post?')) {
            router.delete(`/posts/${post.id}`);
        }
    };
    return /* @__PURE__ */ jsx(AppLayout, {
        title: post.title,
        children: /* @__PURE__ */ jsxs('div', {
            className: 'mx-auto max-w-3xl space-y-6',
            children: [
                /* @__PURE__ */ jsxs('div', {
                    className: 'flex items-center gap-4',
                    children: [
                        /* @__PURE__ */ jsx(Button, {
                            variant: 'ghost',
                            size: 'icon',
                            asChild: true,
                            children: /* @__PURE__ */ jsx(Link, {
                                href: '/posts',
                                children: /* @__PURE__ */ jsx(ArrowLeft, { className: 'h-4 w-4' }),
                            }),
                        }),
                        /* @__PURE__ */ jsx('h2', {
                            className: 'flex-1 text-3xl font-bold tracking-tight',
                            children: post.title,
                        }),
                        /* @__PURE__ */ jsx(Badge, {
                            variant: statusVariant[post.status] || 'secondary',
                            children: statusLabel[post.status] || post.status,
                        }),
                    ],
                }),
                /* @__PURE__ */ jsxs(Card, {
                    children: [
                        /* @__PURE__ */ jsx(CardHeader, {
                            children: /* @__PURE__ */ jsxs('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                    /* @__PURE__ */ jsx(CardTitle, { children: 'Conteúdo' }),
                                    /* @__PURE__ */ jsxs('div', {
                                        className: 'flex gap-2',
                                        children: [
                                            /* @__PURE__ */ jsx(Button, {
                                                variant: 'outline',
                                                size: 'sm',
                                                asChild: true,
                                                children: /* @__PURE__ */ jsxs(Link, {
                                                    href: `/posts/${post.id}/edit`,
                                                    children: [
                                                        /* @__PURE__ */ jsx(Pencil, { className: 'mr-2 h-4 w-4' }),
                                                        'Editar',
                                                    ],
                                                }),
                                            }),
                                            /* @__PURE__ */ jsxs(Button, {
                                                variant: 'destructive',
                                                size: 'sm',
                                                onClick: handleDelete,
                                                children: [
                                                    /* @__PURE__ */ jsx(Trash2, { className: 'mr-2 h-4 w-4' }),
                                                    'Excluir',
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        }),
                        /* @__PURE__ */ jsxs(CardContent, {
                            children: [
                                /* @__PURE__ */ jsx('div', {
                                    className: 'prose max-w-none whitespace-pre-wrap',
                                    children: post.content,
                                }),
                                /* @__PURE__ */ jsxs('div', {
                                    className: 'mt-6 flex gap-4 border-t pt-4 text-sm text-gray-500',
                                    children: [
                                        /* @__PURE__ */ jsxs('span', {
                                            children: ['Criado em: ', formatDate(post.created_at)],
                                        }),
                                        post.published_at &&
                                            /* @__PURE__ */ jsxs('span', {
                                                children: ['Publicado em: ', formatDate(post.published_at)],
                                            }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    });
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            default: PostsShow,
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
                './pages/posts/create.tsx': __vite_glob_0_1,
                './pages/posts/edit.tsx': __vite_glob_0_2,
                './pages/posts/index.tsx': __vite_glob_0_3,
                './pages/posts/show.tsx': __vite_glob_0_4,
            });
            return pages[`./pages/${name}.tsx`];
        },
        // @ts-expect-error SSR setup receives null element
        setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props }),
    });
}
export { render as default };
