import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const calcTimeBetween = (from, to) => {
  const diffMinutes = Math.ceil(to.diff(from, 'minutes', true));
  const durationBetween = dayjs.duration(diffMinutes, 'minutes');

  // Всё время в днях (включая то, что было бы годами)
  const totalDays = Math.floor(durationBetween.asDays());
  const remainingHours = durationBetween.hours();
  const remainingMinutes = durationBetween.minutes();

  let result = `${remainingMinutes}M`;

  if (remainingHours > 0 || totalDays > 0) {
    result = `${remainingHours}H ${result}`;
  }

  if (totalDays > 0) {
    result = `${totalDays}D ${result}`;
  }

  return result.trim();
};

export { calcTimeBetween };
