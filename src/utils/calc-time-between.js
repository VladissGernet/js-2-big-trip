import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const calcTimeBetween = (from, to) => {
  const start = dayjs(from);
  const end = dayjs(to);

  const diffMillis = end.diff(start, 'minutes');
  const durationBetween = dayjs.duration(diffMillis, 'minutes');

  let result = `${durationBetween.format('mm')}M`;

  if (durationBetween.hours() > 0) {
    result = `${durationBetween.format('HH')}H ${result}`;
  }

  if (durationBetween.days() > 1) {
    result = `${durationBetween.format('DD')}D ${result}`;
  }

  if (durationBetween.years() > 1) {
    result = `${durationBetween.format('YY')}Y ${result}`;
  }

  return result;
};

export { calcTimeBetween };
