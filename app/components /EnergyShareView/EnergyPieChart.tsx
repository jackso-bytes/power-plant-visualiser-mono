'use client';
import { EnergyShareResponse } from '@/app/types/responseTypes';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

const chartConfig: ChartConfig = {
  renewable: { label: 'Renewable', color: 'var(--chart-2)' },
  nonRenewable: { label: 'Non-Renewable', color: 'var(--chart-1)' },
};

type Props = {
  energyShare: EnergyShareResponse;
};

const EnergyPieChart = ({ energyShare }: Props) => {
  const chartData = [
    {
      name: 'renewable',
      value: energyShare.renewableGenerationGwh,
      percentage: energyShare.renewablePercentage,
    },
    {
      name: 'nonRenewable',
      value: energyShare.nonRenewableGenerationGwh,
      percentage: energyShare.nonRenewablePercentage,
    },
  ];

  return (
    <div>
      <h2 className='text-lg font-semibold mb-2'>
        {energyShare.country} — {energyShare.year}
      </h2>
      <ChartContainer config={chartConfig} className='h-64 w-full'>
        <PieChart>
          <Pie
            data={chartData}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={100}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  const item = chartData.find((d) => d.name === name);
                  return [
                    `${Number(value).toLocaleString()} GWh (${item?.percentage.toFixed(1)}%)`,
                    chartConfig[name as string]?.label ?? name,
                  ];
                }}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default EnergyPieChart;
