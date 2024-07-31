// import * as React from 'react';
// import { BarChart } from '@mui/x-charts/BarChart';

// const pData = [61, 77, 54, 89, 65, 86, ];
// const xLabels = [
//   'Admstr',
//   'Sales',
//   'HR',
//   'Mrkt',
//   'Social',
//   'IT',
// ];

// export default function SimpleBarChart() {
//   return (
//     <BarChart
//       width={430}
//       height={300}
//       series={[
//         { data: pData, label: 'department attendance', id: 'pvId' },
//       ]}
//       xAxis={[{ data: xLabels, scaleType: 'band' }]}
//     />
//   );
// }

import * as React from "react";
import { BarChart } from "@mui/x-charts";

const data = [61, 77, 54, 89, 65, 86];
const xLabels = ["Admstr", "Sales", "HR", "Mrkt", "Social", "IT"];

export default function SimpleBarChart() {
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
          x={index * 55 + 80} // Adjust positioning as needed
          y={236} // Adjust positioning as needed
          textAnchor="middle"
          dominantBaseline="central"
          fill="black"
        >
          {((value / 100) * 100).toFixed(0)}%
        </text>
      ))}
    </BarChart>
  );
}