"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Character } from "@/lib/types"
import { useTheme } from "@/components/theme-provider"
import React from "react"

interface StatsChartProps {
  character: Character
}

const StatsChart = React.memo(({ character }: StatsChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // Draw radar chart background
    const stats = [
      character.combatSkill,
      character.intelligence,
      character.leadership,
      character.strength,
      character.durability,
      character.technology,
      character.threatLevel,
    ]

    const labels = ["Combat", "Intelligence", "Leadership", "Strength", "Durability", "Technology", "Threat"]

    const numStats = stats.length
    const angleStep = (Math.PI * 2) / numStats

    // Draw background circles
    ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    ctx.fillStyle = isDarkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(241, 245, 249, 0.7)"

    for (let i = 1; i <= 10; i += 3) {
      const circleRadius = (radius / 10) * i

      ctx.beginPath()
      ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw axis lines
    for (let i = 0; i < numStats; i++) {
      const angle = i * angleStep - Math.PI / 2

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
      ctx.stroke()

      // Draw labels
      const labelX = centerX + Math.cos(angle) * (radius + 15)
      const labelY = centerY + Math.sin(angle) * (radius + 15)

      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(labels[i], labelX, labelY)
    }

    // Draw data points and connect them
    const dataPoints = stats.map((stat, i) => {
      const angle = i * angleStep - Math.PI / 2
      const pointRadius = (radius / 10) * stat

      return {
        x: centerX + Math.cos(angle) * pointRadius,
        y: centerY + Math.sin(angle) * pointRadius,
      }
    })

    // Fill the radar area
    ctx.beginPath()
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y)

    for (let i = 1; i < dataPoints.length; i++) {
      ctx.lineTo(dataPoints[i].x, dataPoints[i].y)
    }

    ctx.closePath()
    ctx.fillStyle = isDarkMode ? "rgba(56, 189, 248, 0.2)" : "rgba(14, 165, 233, 0.2)"
    ctx.fill()

    // Draw the outline
    ctx.beginPath()
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y)

    for (let i = 1; i < dataPoints.length; i++) {
      ctx.lineTo(dataPoints[i].x, dataPoints[i].y)
    }

    ctx.closePath()
    ctx.strokeStyle = isDarkMode ? "rgba(56, 189, 248, 0.8)" : "rgba(14, 165, 233, 0.8)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data points
    dataPoints.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = isDarkMode ? "rgba(56, 189, 248, 1)" : "rgba(14, 165, 233, 1)"
      ctx.fill()
      ctx.strokeStyle = isDarkMode ? "#fff" : "#000"
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }, [character, isDarkMode])

  return (
    <Card className="animate-fadeIn">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Character Stats Radar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas ref={canvasRef} width={300} height={300} className="max-w-full" />
      </CardContent>
    </Card>
  )
})

StatsChart.displayName = "StatsChart"

export default StatsChart
