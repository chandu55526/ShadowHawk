import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ThreatData {
  timestamp: string;
  threatLevel: number;
  threatType: string;
}

const Dashboard = () => {
  const { socket, isConnected } = useSocket();
  const [threatData, setThreatData] = useState<ThreatData[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on('threat-detected', (data: ThreatData) => {
        setThreatData((prev) => [...prev, data].slice(-10));
      });
    }

    return () => {
      if (socket) {
        socket.off('threat-detected');
      }
    };
  }, [socket]);

  const chartData = {
    labels: threatData.map((data) => new Date(data.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Threat Level',
        data: threatData.map((data) => data.threatLevel),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-time Threat Level',
      },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Threat Dashboard</h1>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Threat Level Chart</h2>
          <Line data={chartData} options={options} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Threats</h2>
          <div className="space-y-4">
            {threatData.map((data, index) => (
              <div key={index} className="border-b pb-2">
                <p className="font-medium">{data.threatType}</p>
                <p className="text-sm text-gray-500">
                  {new Date(data.timestamp).toLocaleString()}
                </p>
                <p className="text-sm">Level: {data.threatLevel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 