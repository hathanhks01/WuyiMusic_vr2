import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import StatisticService from '../../../Services/StatisticService';

const Chart = () => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [totalNewUsers, setTotalNewUsers] = useState(0);
  const [dateRange, setDateRange] = useState('');
  useEffect(() => {
    const fetchStatistic = async () => {
      try {
        const data = await StatisticService.GetNewUsersCountByDateRange();
        console.log("API response data:", data);

        const formattedData = data.map(item => {
          const parts = item.date.split('T')[0].split('-'); 
          return {
            date: `${parts[2]}/${parts[1]}`, 
            "new user": item.count,
          };
        });
        console.log("Formatted data:", formattedData);
        const total = formattedData.reduce((acc, item) => acc + item["new user"], 0);
        setTotalNewUsers(total);
        setStatistics(formattedData);
        if (data.length > 0) {
          const startDate = new Date(data[0].date).toLocaleDateString();
          const endDate = new Date(data[data.length - 1].date).toLocaleDateString();
          setDateRange(`${startDate} - ${endDate}`);
        }
      } catch (error) {
        console.error("Không thể lấy dữ liệu:", error);
      }
    };

    fetchStatistic();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold text-center mb-4"> {dateRange && `(${dateRange})`} - Số user mới tháng này : {totalNewUsers}</h2>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={statistics}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setHoveredKey(state.activeTooltipIndex !== undefined ? 'new user' : null);
              }
            }}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              cursor={{ stroke: '#8884d8', strokeDasharray: '3 3' }}
            />
            <Legend />
            {/* Thêm Brush để hỗ trợ zoom */}
            <Brush dataKey="date" height={30} stroke="#8884d8" />
            <Line
              type="monotone"
              dataKey="new user"
              stroke="#8884d8"
              dot={hoveredKey === 'new user' ? { r: 8 } : false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
