import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
interface PieCenterLabelProps {
  children: React.ReactNode;
}

const data = [
  { value: 88, label: '出席' },
  { value: 12, label: '欠席' },
];

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

function PieCenterLabel({ children } : PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  return (
    <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
      <PieCenterLabel>{data[0].value}%</PieCenterLabel>
    </PieChart>
  );
}