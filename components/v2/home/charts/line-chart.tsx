"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 0, mobile: 0 },
  { month: "February", desktop: 0, mobile: 0 },
  { month: "March", desktop: 0, mobile: 0 },
  { month: "April", desktop: 0, mobile: 0 },
  { month: "May", desktop: 0, mobile: 0 },
  { month: "June", desktop: 0, mobile: 0 },
  { month: "July", desktop: 0, mobile: 0 },
  { month: "August", desktop: 0, mobile: 0 },
  { month: "September", desktop: 0, mobile: 0 },
  { month: "October", desktop: 0, mobile: 0 },
  { month: "November", desktop: 0, mobile: 0 },
  { month: "December", desktop: 0, mobile: 0 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function RevenewInsight() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] max-h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
              left: 12,
              right: 12,
          }}
        >
        <CartesianGrid vertical={false} />
        <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
        />
        <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{
                fill: "var(--color-desktop)",
            }}
            activeDot={{
                r: 6,
            }}
        />
        </LineChart>
    </ChartContainer>
  )
}
