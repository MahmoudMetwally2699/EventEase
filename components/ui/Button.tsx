'use client'

import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
          'border border-gray-300 hover:bg-gray-50': variant === 'outline',
          'px-4 py-2': size === 'default',
          'px-3 py-1.5': size === 'sm',
          'px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
