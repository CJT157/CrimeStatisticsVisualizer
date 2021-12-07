import React, {useState, useEffect} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export function CrimePieChart({crimeData}) {
    const [data, setData] = useState({datasets: []});

    const getCrimeType = crime => {

        const type = {
            'HOMICIDE': "Violent",
            'CRIMINAL SEXUAL ASSAULT': "Violent",
            'ROBBERY': 'Theft',
            'BATTERY': 'Violent',
            'ASSAULT': 'Violent',
            'THEFT': 'Theft',
        }

        if(crime in type) {
            return type[crime]
        } else {
            return "Other"
        }

    }

    useEffect(() => {
        let chartData = { "Violent": 0, "Theft": 0, "Other": 0};

        for(let crime in crimeData) {
            let crimeType = getCrimeType(crimeData[crime].primary_type);
            chartData[crimeType]++;
        }

        console.log(chartData);

        setData({
            labels: ['Violent', 'Theft', 'Other'],
            datasets: [
                {
                    label: 'Crimes',
                    data: [chartData['Violent'], chartData['Theft'], chartData['Other']],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(0, 255, 0, 0.5)',
                        'rgba(0, 0, 255, 0.5)',
                    ]
                }
            ],
        });
    }, [crimeData]);

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
    };
  return <Pie data={data} options={options} />;
}
