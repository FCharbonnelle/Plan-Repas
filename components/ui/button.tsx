import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Variantes principales
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        
        // Variantes avec contour
        outline: 'border-2 border-primary bg-background text-primary hover:bg-primary/10',
        ghost: 'text-primary hover:bg-primary/10',
        link: 'text-primary underline-offset-4 hover:underline',
        
        // Variante dégradé
        gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9 p-0',
        pill: 'rounded-full px-6',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
