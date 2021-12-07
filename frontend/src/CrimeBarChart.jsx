import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            enabled: true,
            labels: {
                color: "#fff",
            }
        },
        title: {
            display: true,
            text: 'Crime Breakdown by Type',
            color: "#fff",
            font: { size: '16px', weight: 100}
        }
    },
    scales: {
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.3)",
            },
            ticks: {
                color: '#fff'
            }
        },
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.3)"
            }
        }
    }
};

const labels = [''];

const data = {
  labels,
  datasets: [
    {
      label: 'Violent',
      data: [1],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
        label: 'Theft',
        data: [1],
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
    },
    {
        label: 'Other',
        data: [1],
        backgroundColor: 'rgba(35, 35, 35, 0.5)',
    },
  ],
};

export default function CrimeBarChart({crimeData}) {
  return <Bar options={options} data={data} />;
}
