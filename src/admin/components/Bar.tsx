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
      console.log(response);
      
      

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
    barLabel={(item, context) => {
      return context.bar.height < 60 ? null : item.value?.toString();
    }}
      width={530}
      height={300} 
      borderRadius={10}
      series={[
        {
          data,
          label: ("department attendance"),
          id: "pvId",
          
        },
      ]}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    >
      
    </BarChart>
  );
}
