import React from 'react';
import './RecordPlayer.css';

const RecordPlayer = () => {
  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-200">
      {/* --- Phần đĩa than --- */}
      <div className="relative">
        {/* Đĩa vinyl với đường vân (grooves) và hiệu ứng xoay */}
        <div className="vinyl-disc w-64 h-64 rounded-full border-8 border-gray-700 shadow-lg animate-spin-slow"></div>
        {/* Nhãn giữa đĩa */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">Label</span>
        </div>
      </div>

      {/* --- Phần đầu đĩa (tonearm) --- */}
      {/* Vị trí của tonearm được đặt absolute sao cho phần kim đặt lên đĩa */}
      <div
        className="absolute"
        style={{
          top: '20%',    // điều chỉnh theo ý thích
          left: '60%',   // điều chỉnh sao cho kim chạm đĩa
          zIndex: 10,    // đảm bảo tonearm luôn hiển thị trên đĩa
        }}
      >
        {/* Phần đáy của đầu đĩa (tonearm base) */}
        <div
          className="bg-gray-800"
          style={{
            width: '12px',
            height: '60px',
            borderRadius: '6px',
            transformOrigin: 'top center',
            transform: 'rotate(-15deg)', // xoay góc nhẹ
          }}
        ></div>
        {/* Kim của đầu đĩa */}
        <div
          className="bg-slate-300"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '4px',
            height: '80px',
            transformOrigin: 'top center',
            transform: 'rotate(25deg)', // xoay tạo hiệu ứng kim nghiêng
          }}
        ></div>
      </div>
    </div>
  );
};

export default RecordPlayer;
