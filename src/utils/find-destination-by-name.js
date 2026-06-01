/**
 * Ищет destination по имени.
 * @param {string} name - Имя для поиска.
 * @param {Map<string, {name: string}>} destinations - Коллекция destination.
 * @returns {{name: string}|undefined} Найденный destination или undefined.
 */
const findDestinationByName = (name, destinations) =>
  destinations.values().find((destination) => destination.name === name);

export { findDestinationByName };
