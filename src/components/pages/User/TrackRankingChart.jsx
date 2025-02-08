import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrackRankingChart = () => {
  const [hoveredKey, setHoveredKey] = useState(null);

  const data = [
    { name: '8:00', uv: 4000, pv: 2400 },
    { name: '10:00', uv: 3000, pv: 1398 },
    { name: '12:00', uv: 2000, pv: 9800 },
    { name: '14:00', uv: 2780, pv: 3908 },
    { name: '16:00', uv: 1890, pv: 4800 },
    { name: '18:00', uv: 2390, pv: 3800 },
    { name: '20:00', uv: 9990, pv: 4300 },
    { name: '22:00', uv: 3490, pv: 4300 },
    { name: '24:00', uv: 3490, pv: 4300 },
    { name: '2:00', uv: 3490, pv: 4300 },
    { name: '4:00', uv: 3490, pv: 4300 },
    { name: '6:00', uv: 3490, pv: 4300 },
  ];

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold text-center mb-4">Bảng xếp hạng</h2>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setHoveredKey(state.activeTooltipIndex !== undefined ? 'pv' : null);
              }
            }}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tick={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              cursor={{ stroke: '#8884d8', strokeDasharray: '3 3' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="pv" 
              stroke="#8884d8" 
              dot={hoveredKey === 'pv' ? { r: 8 } : false}
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="uv" 
              stroke="#82ca9d" 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrackRankingChart;