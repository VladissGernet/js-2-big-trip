import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';

export default class TripModel {
  #points = null;
  #destinations = null;
  #offers = null;
  #offersReadOnly = null;

  get offersReadOnly() {
    if (!this.#offersReadOnly) {
      this.#offersReadOnly = Object.freeze(structuredClone(offersMock));
    }
    return this.#offersReadOnly;
  }

  /** @returns {Map<string, Object>}  Назначения по ID для быстрого поиска. */
  get destinationsById() {
    if (!this.#destinations) {
      // Преобразовываю данные для оптимизированного поиска.
      this.#destinations = destinationsMock.reduce(
        (result, { id, ...rest }) => result.set(id, rest),
        new Map(),
      );
    }
    return this.#destinations;
  }

  /** @returns {Map<string, Map<string, Object>}  Назначения по типу для быстрого поиска. */
  get offersByType() {
    if (!this.#offers) {
      // Преобразовываю данные для оптимизированного поиска.
      this.#offers = offersMock.reduce((result, { type, offers }) => {
        const offersMap = offers.reduce(
          (acc, { id, ...rest }) => acc.set(id, rest),
          new Map(),
        );
        return result.set(type, offersMap);
      }, new Map());
    }
    return this.#offers;
  }

  /** @returns {Array<Object>} Список путевых точек */
  get listPoints() {
    if (!this.#points) {
      this.#points = replaceSnakeToCamel(pointsMock);
      this.#points = this.#points.map(({ offers, ...rest }) => ({
        ...rest,
        offers: new Set(offers),
      }));
    }
    return this.#points;
  }

  set listPoints(newPoints) {
    if (!Array.isArray(newPoints)) {
      throw new Error('listPoints must be an array');
    }
    this.#points = newPoints;
  }

  updatePointFavorite(pointId) {
    const index = this.listPoints.findIndex((item) => item.id === pointId);
    this.listPoints[index].isFavorite = !this.listPoints[index].isFavorite;
  }
}
