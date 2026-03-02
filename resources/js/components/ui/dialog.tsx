import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn('fixed inset-0 z-50 bg-black/80', className)}
            {...props}
        />
    ),
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
    ({ className, children, ...props }, ref) => (
        <DialogPrimitive.Portal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white p-6 shadow-lg sm:rounded-lg',
                    className,
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                    <X className="h-4 w-4" />
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    ),
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)} {...props} />
);

const DialogTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
    ),
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Description ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
    ),
);
DialogDescription.displayName = 'DialogDescription';

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger };
