'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function EventsChart() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/analytics/chart')
        const chartData = await response.json()
        setData(chartData.labels.map((label: string, index: number) => ({
          month: label,
          events: chartData.datasets[0].data[index],
          attendees: chartData.datasets[1].data[index]
        })))
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (isLoading) {
    return <div className="animate-pulse h-full bg-gray-100 rounded-lg" />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="events" stroke="#8884d8" />
        <Line type="monotone" dataKey="attendees" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}
