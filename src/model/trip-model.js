import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';

export default class TripModel {
  /** @type {Array<Object>} Список путевых точек */
  #points = replaceSnakeToCamel(pointsMock);

  /** @type {Array<Object>} Список назначений */
  #destinations = destinationsMock;

  /** Список предложений
   * @type {Array<Object>}
   * Публичный для отрисовки списка типов в форме создания\редактирования точки.
   */
  offers = offersMock;

  /** @returns {Object} Назначения по ID для быстрого поиска. */
  get destinationsById() {
    // Преобразовываю данные для оптимизированного поиска.
    return structuredClone(this.#destinations).reduce(
      (acc, { id, ...rest }) => {
        acc[id] = rest;
        return acc;
      },
      {}
    );
  }

  /** @returns {Object} Назначения по типу для быстрого поиска. */
  get offersByType() {
    // Преобразовываю данные для оптимизированного поиска.
    return structuredClone(this.offers).reduce((types, { type, offers }) => {
      types[type] = offers.reduce((offersIdentifications, { id, ...rest }) => {
        offersIdentifications[id] = rest;
        return offersIdentifications;
      }, {});
      return types;
    }, {});
  }

  /** @returns {Array<Object>} Список путевых точек */
  get listPoints() {
    return structuredClone(this.#points);
  }
}
