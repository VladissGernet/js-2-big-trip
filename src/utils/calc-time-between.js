import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const calcTimeBetween = (from, to) => {
  const start = dayjs(from);
  const end = dayjs(to);

  const diffMillis = end.diff(start, 'minutes');
  const durationBetween = dayjs.duration(diffMillis, 'minutes');

  if (durationBetween.hours() === 0) {
    return `${durationBetween.format('mm')}M`;
  }
  return `${durationBetween.format('HH')}H ${durationBetween.format('mm')}M`;
};

export { calcTimeBetween };
