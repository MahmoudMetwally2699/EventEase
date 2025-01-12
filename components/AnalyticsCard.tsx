interface AnalyticsCardProps {
  title: string
  value: number | string
  icon: string
  className?: string
}

export default function AnalyticsCard({ title, value, icon, className = '' }: AnalyticsCardProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
    </div>
  )
}
