import { SORT_CONFIG } from '../const.js';

/** Поиск города назначения по индексу. */
const findDestinationByIndex = (index, points, destinations) => {
  // Дефолтная сортировка по датам.
  const sortedList = points.toSorted(SORT_CONFIG['date']);
  return destinations?.find(({ id }) => id === sortedList[index]?.destination);
};

export { findDestinationByIndex };
