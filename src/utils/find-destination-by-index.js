import { SORT_CONFIG, DEFAULT_SORT } from '../const.js';

/** Поиск города назначения по индексу. */
const findDestinationByIndex = (index, points, destinations) => {
  // Дефолтная сортировка по датам.
  const sortedList = points.toSorted(SORT_CONFIG[DEFAULT_SORT]);
  return destinations.get(sortedList[index].destination);
};

export { findDestinationByIndex };
