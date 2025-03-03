import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis,
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
} from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

interface TopClient {
  name: string;
  revenue: number;
}

interface BarChartTabProps {
  topClients: TopClient[];
}

const BarChartTab: React.FC<BarChartTabProps> = ({ topClients }) => {
  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="h-[300px] max-h-[300px] w-full"
      >
        <BarChart accessibilityLayer data={topClients} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="revenue" fill="var(--color-desktop)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default BarChartTab;
