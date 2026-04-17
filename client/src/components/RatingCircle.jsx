import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const RatingCircle = ({ rating, size = 40 }) => {
  // Преобразуем рейтинг из шкалы 0-10 в проценты
  const percentage = (rating / 10) * 100;
  
  // Определяем цвет в зависимости от рейтинга
  const getColor = (rate) => {
    if (rate >= 8) return '#22c55e'; // зеленый
    if (rate >= 6) return '#eab308'; // желтый
    if (rate >= 4) return '#f97316'; // оранжевый
    return '#ef4444'; // красный
  };

  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        value={percentage}
        text={`${rating.toFixed(1)}`}
        styles={buildStyles({
          textSize: '28px',
          textColor: getColor(rating),
          pathColor: getColor(rating),
          trailColor: 'rgba(255, 255, 255, 0.2)',
          textWeight: 'bold',
        })}
      />
    </div>
  );
};

export default RatingCircle;