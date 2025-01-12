'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="block text-sm font-medium">{label}</label>}
        <input
          className={cn(
            'w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
