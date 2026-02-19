"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Users, MapPin, Compass } from "lucide-react"

interface Stat {
  id: number
  icon: React.ReactNode
  value: number
  label: string
  suffix: string
}

const stats: Stat[] = [
  {
    id: 1,
    icon: <Users className="h-8 w-8 text-lta-purple" />,
    value: 15000,
    label: "Happy Clients",
    suffix: "+",
  },
  {
    id: 2,
    icon: <MapPin className="h-8 w-8 text-lta-purple" />,
    value: 120,
    label: "Destinations",
    suffix: "+",
  },
  {
    id: 3,
    icon: <Compass className="h-8 w-8 text-lta-purple" />,
    value: 500,
    label: "Expert Tours",
    suffix: "+",
  },
]

export default function StatsSection() {
  const [counters, setCounters] = useState<number[]>(stats.map(() => 0))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const intervals = stats.map((stat, index) => {
            return setInterval(() => {
              setCounters((prev) => {
                const newCounters = [...prev]
                if (newCounters[index] < stat.value) {
                  const increment = Math.ceil(stat.value / 50)
                  newCounters[index] = Math.min(newCounters[index] + increment, stat.value)
                }
                return newCounters
              })
            }, 30)
          })

          return () => {
            intervals.forEach((interval) => clearInterval(interval))
          }
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="stats-section" className="py-16 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.id} className="flex flex-col items-center text-center">
              <div className="mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">
                {counters[index].toLocaleString()}
                {stat.suffix}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
