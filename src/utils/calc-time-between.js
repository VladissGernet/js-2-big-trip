import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const calcTimeBetween = (from, to) => {
  const diffMinutes = Math.ceil(to.diff(from, 'minutes', true));
  const durationBetween = dayjs.duration(diffMinutes, 'minutes');

  const totalDays = Math.floor(durationBetween.asDays());
  const remainingHours = durationBetween.hours();
  const remainingMinutes = durationBetween.minutes();

  // Форматируем все числа как 2 цифры
  const mm = remainingMinutes.toString().padStart(2, '0');
  const HH = remainingHours.toString().padStart(2, '0');
  const DD = totalDays.toString().padStart(2, '0');

  let result = `${mm}M`;

  if (remainingHours > 0 || totalDays > 0) {
    result = `${HH}H ${result}`;
  }

  if (totalDays > 0) {
    result = `${DD}D ${result}`;
  }

  return result.trim();
};

export { calcTimeBetween };
