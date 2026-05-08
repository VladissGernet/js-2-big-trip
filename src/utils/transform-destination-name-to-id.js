/**
 * Переводит имя назначения в id.
 * @param {string} destinationName - Имя для поиска.
 * @param {Map<string, {name: string}>} destinations - Коллекция destination.
 * @returns {string} Найденный id или пустая строка, если не найдено.
 * */
const transformDestinationNameToId = (destinationName, destinations) => {
  for (const [destinationId, { name }] of destinations) {
    if (name === destinationName) {
      return destinationId;
    }
  }
  return '';
};

export { transformDestinationNameToId };
