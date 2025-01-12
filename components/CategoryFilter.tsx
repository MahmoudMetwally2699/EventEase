'use client'

import { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onCategoryChange('')}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
