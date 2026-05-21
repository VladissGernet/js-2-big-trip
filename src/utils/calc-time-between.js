import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const calcTimeBetween = (from, to) => {
  const diffMinutes = Math.ceil(to.diff(from, 'minutes', true));

  const durationBetween = dayjs.duration(diffMinutes, 'minutes');

  let result = `${durationBetween.format('mm')}M`;

  if (durationBetween.hours() >= 0) {
    result = `${durationBetween.format('HH')}H ${result}`;
  }

  if (durationBetween.days() >= 1) {
    result = `${durationBetween.format('DD')}D ${result}`;
  }

  if (durationBetween.years() >= 1) {
    result = `${durationBetween.format('YY')}Y ${result}`;
  }

  return result;
};

export { calcTimeBetween };
