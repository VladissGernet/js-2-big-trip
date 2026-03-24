import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';
import { SORT_CONFIG } from '../const.js';

export default class TripModel {
  #points = null;
  #destinations = null;
  #offers = null;

  #offersReadOnly = null;
  #destinationsReadOnly = null;

  get offersReadOnly() {
    if (!this.#offersReadOnly) {
      this.#offersReadOnly = Object.freeze(structuredClone(offersMock));
    }
    return this.#offersReadOnly;
  }

  // Список всех городов из данных
  get cities() {
    return destinationsMock.map((dest) => dest.name);
  }

  get destinationsReadOnly() {
    if (!this.#destinationsReadOnly) {
      this.#destinationsReadOnly = Object.freeze(
        structuredClone(destinationsMock),
      );
    }
    return this.#destinationsReadOnly;
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

  /** Обновляет данные выбранной точки */
  updatePoint(pointId, updatedData) {
    const index = this.listPoints.findIndex((item) => item.id === pointId);
    if (index !== -1) {
      let selectedPoint = this.listPoints[index];
      selectedPoint = { ...this.listPoints[index], ...updatedData };
      this.listPoints[index] = selectedPoint;

      // Возвращаем выбранную точку.
      return selectedPoint;
    }
  }

  removePoint(pointId) {
    const index = this.listPoints.findIndex((item) => item.id === pointId);
    this.listPoints.splice(index, 1);
  }

  findPointByIndex(index) {
    // Дефолтная сортировка по датам.
    const sortedList = this.listPoints.toSorted(SORT_CONFIG['date']);

    return this.destinationsReadOnly?.find(
      ({ id }) => id === sortedList[index]?.destination,
    );
  }
}
