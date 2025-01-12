'use client'

import { ChangeEvent } from 'react'
import Input from './ui/Input'

interface SearchFiltersProps {
  search: string
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void
  sortBy: string
  onSortChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

export default function SearchFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}: SearchFiltersProps) {
  return (
    <div className="flex gap-4 items-end mb-8">
      <div className="flex-1">
        <Input
          label="Search events"
          type="search"
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name or location..."
        />
      </div>
      <div className="w-48">
        <label className="block text-sm font-medium mb-2">Sort by</label>
        <select
          value={sortBy}
          onChange={onSortChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="capacity">Capacity</option>
        </select>
      </div>
    </div>
  )
}
