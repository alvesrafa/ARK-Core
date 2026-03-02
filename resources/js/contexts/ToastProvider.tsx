import { cn } from '@/lib/utils';
import * as Toast from '@radix-ui/react-toast';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

type ToastType = 'info' | 'success' | 'error';

type ToastProps = {
    title: string;
    description?: string;
    duration?: number;
    type: ToastType;
};

type ToastContextType = {
    notify: (title: string, options?: Partial<ToastProps>) => void;
    notifySuccess: (title: string, description?: string, duration?: number) => void;
    notifyInfo: (title: string, description?: string, duration?: number) => void;
    notifyError: (title: string, description?: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState<ToastProps | null>(null);

    const notify = useCallback((title: string, options?: Partial<ToastProps>) => {
        setToast({
            title,
            description: options?.description || '',
            duration: options?.duration || 4000,
            type: options?.type || 'info',
        });
        setOpen(false);
        requestAnimationFrame(() => setOpen(true));
    }, []);

    const notifySuccess = useCallback(
        (title: string, description?: string, duration?: number) => {
            notify(title, { description, duration, type: 'success' });
        },
        [notify],
    );

    const notifyInfo = useCallback(
        (title: string, description?: string, duration?: number) => {
            notify(title, { description, duration, type: 'info' });
        },
        [notify],
    );

    const notifyError = useCallback(
        (title: string, description?: string, duration?: number) => {
            notify(title, { description, duration, type: 'error' });
        },
        [notify],
    );

    const getIconAndStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    className: 'border-green-200 bg-green-50',
                };
            case 'error':
                return {
                    icon: <AlertCircle className="h-5 w-5 text-red-600" />,
                    className: 'border-red-200 bg-red-50',
                };
            case 'info':
            default:
                return {
                    icon: <Info className="h-5 w-5 text-blue-600" />,
                    className: 'border-blue-200 bg-blue-50',
                };
        }
    };

    return (
        <ToastContext.Provider value={{ notify, notifySuccess, notifyInfo, notifyError }}>
            <Toast.Provider swipeDirection="right" duration={toast?.duration}>
                {children}
                {toast && (
                    <Toast.Root
                        open={open}
                        onOpenChange={setOpen}
                        className={cn(
                            'flex w-[32rem] flex-col gap-2 rounded-lg border p-4 shadow-xl',
                            getIconAndStyles(toast.type).className,
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="shrink-0">{getIconAndStyles(toast.type).icon}</div>
                            <Toast.Title className="flex-1 font-bold text-gray-900">{toast.title}</Toast.Title>
                            <Toast.Close className="shrink-0 rounded-full p-1 hover:bg-gray-100">
                                <X className="h-4 w-4 text-gray-600" />
                            </Toast.Close>
                        </div>
                        {toast.description && (
                            <Toast.Description className="ml-8 text-sm text-gray-600">
                                {toast.description}
                            </Toast.Description>
                        )}
                    </Toast.Root>
                )}
                <Toast.Viewport className="fixed top-4 left-1/2 z-50 flex w-[32rem] -translate-x-1/2 flex-col items-center" />
            </Toast.Provider>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
