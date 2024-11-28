import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesOverview = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sales Overview</h2>
      <Line
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              label: 'Sales',
              data: [65, 59, 80, 81, 56, 55],
              borderColor: '#4B9CD3',
              backgroundColor: 'rgba(75, 158, 212, 0.2)',
              borderWidth: 2,
              tension: 0.1
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: $${context.raw}`
              }
            }
          }
        }}
      />
    </div>
  );
};

export default SalesOverview;
