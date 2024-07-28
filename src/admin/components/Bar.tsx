import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const pData = [61, 77, 54, 99, 65, 86, ];
const xLabels = [
  'Admstr',
  'Sales',
  'HR',
  'Mrkt',
  'Social',
  'IT',
];

export default function SimpleBarChart() {
  return (
    <BarChart
      width={430}
      height={300}
      series={[
        { data: pData, label: 'department attendance', id: 'pvId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
    />
  );
}