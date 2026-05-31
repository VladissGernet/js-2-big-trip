import { SORT_CONFIG, DEFAULT_SORT } from '../const.js';

/** Поиск города назначения по индексу. */
const findDestinationByIndex = (index, points, destinations) => {
  // Дефолтная сортировка по датам.
  const sortedPoints = points.toSorted(SORT_CONFIG[DEFAULT_SORT]);
  return destinations.get(sortedPoints[index].destination);
};

export { findDestinationByIndex };
