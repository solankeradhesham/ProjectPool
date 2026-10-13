import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82a68b] disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: { default: 'bg-[#315e4c] text-white hover:bg-[#274d3d]', outline: 'border border-[#dce5dc] bg-white text-[#365a46] hover:bg-[#f1f5ef]', ghost: 'text-[#607568] hover:bg-[#eff4ef] hover:text-[#315e4c]' },
    size: { default: 'h-10 px-4 py-2', icon: 'h-9 w-9' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Component = asChild ? Slot : 'button'
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />
}