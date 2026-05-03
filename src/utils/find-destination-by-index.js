import { SORT_CONFIG } from '../const.js';

const findDestinationByIndex = (index) => {
  // Дефолтная сортировка по датам.
  const sortedList = this.listPoints.toSorted(SORT_CONFIG['date']);
  return this.destinationsReadOnly?.find(
    ({ id }) => id === sortedList[index]?.destination,
  );
};

export { findDestinationByIndex };
