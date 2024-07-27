import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const pData = [61, 77, 54, 99, 65, 86, ];
const xLabels = [
  'IT',
  'Sales',
  'HR',
  'Marketing',
  'Social',
  'Administry',
];

export default function SimpleBarChart() {
  return (
    <BarChart
      width={400}
      height={350}
      series={[
        { data: pData, label: 'department attendance', id: 'pvId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
    />
  );
}