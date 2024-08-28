import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../utils/libs/axios';

interface PieData {
  absent: number;
  come: number;
}

interface PieCenterLabelProps {
  children: React.ReactNode;
}

const size = {
  width: 300,
  height: 300,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 30,
}));

function PieCenterLabel({ children }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  const [data, setData] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    getPieData();
  }, []);

  const getPieData = async () => {
    try {
      const response = await axiosInstance().get('/attendance/piechart');
      const pieValue: PieData = response.data.data;
      
      
      setData([
        { value: pieValue.come, label: '出席' },
        { value: pieValue.absent, label: '欠席' },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
      {data.length > 0 && <PieCenterLabel>{data[0].value}%</PieCenterLabel>}
    </PieChart>
  );
}