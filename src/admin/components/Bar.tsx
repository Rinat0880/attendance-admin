import React, { useEffect, useState } from 'react';
import { BarChart } from "@mui/x-charts";
import axiosInstance from '../../utils/libs/axios';

interface BarData {
  department: string;
  percentage: number;
}

export default function SimpleBarChart() {
  const [data, setData] = useState<number[]>([]);
  const [xLabels, setXLabels] = useState<string[]>([]);

  useEffect(() => {
    getBarData();
  }, []);

  const getBarData = async () => {
    try {
      const response = await axiosInstance().get('/attendance/barchart');
      const barData: BarData[] = response.data.data;
      console.log(response.data.data);
      

      // Маппинг данных для графика
      const percentages = barData.map(item => item.percentage);
      const labels = barData.map(item => item.department);

      setData(percentages);
      setXLabels(labels);
    } catch (err) {
      console.log('Error fetching bar data:', err);
    }
  };

  return (
    <BarChart
      width={430}
      height={300}
      series={[
        {
          data,
          label: "department attendance",
          id: "pvId",
        },
      ]}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    >
      {/* Custom bar labels */}
      {data.map((value, index) => (
        <text
          key={index}
          x={index * (430 / data.length) + 80} // Подстроить позиционирование по оси X
          y={236} // Подстроить позиционирование по оси Y
          textAnchor="middle"
          dominantBaseline="central"
          fill="black"
        >
          {value.toFixed(0)}%
        </text>
      ))}
    </BarChart>
  );
}
