import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';

export default class TripModel {
  /** @type {Array<Object>} Список путевых точек */
  #points = replaceSnakeToCamel(pointsMock);

  /** @type {Array<Object>} Список назначений */
  #destinations = destinationsMock;

  /** @type {Array<Object>} Список предложений */
  #offers = offersMock;

  get offersReadOnly() {
    return Object.freeze(structuredClone(this.#offers));
  }

  /** @returns {Map<string, Object>}  Назначения по ID для быстрого поиска. */
  get destinationsById() {
    // Преобразовываю данные для оптимизированного поиска.
    return this.#destinations.reduce(
      (result, { id, ...rest }) => result.set(id, rest),
      new Map()
    );
  }

  /** @returns {Map<string, Offer[]>}  Назначения по типу для быстрого поиска. */
  get offersByType() {
    // Преобразовываю данные для оптимизированного поиска.
    return this.#offers.reduce((result, { type, offers }) => {
      const offersMap = offers.reduce(
        (acc, { id, ...rest }) => acc.set(id, rest),
        new Map()
      );
      return result.set(type, offersMap);
    }, new Map());
  }

  /** @returns {Array<Object>} Список путевых точек */
  get listPoints() {
    return structuredClone(this.#points);
  }
}
