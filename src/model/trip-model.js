import Observable from '../framework/observable.js';
import { nanoid } from 'nanoid';
import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';
import { SORT_CONFIG } from '../const.js';

export default class TripModel extends Observable {
  #points = null;
  #destinations = null;
  #offers = null;

  #offersReadOnly = null;
  #destinationsReadOnly = null;
  #cities = null;

  get offersReadOnly() {
    if (!this.#offersReadOnly) {
      this.#offersReadOnly = Object.freeze(structuredClone(offersMock));
    }
    return this.#offersReadOnly;
  }

  // Список всех городов из данных
  get cities() {
    if (!this.#cities) {
      this.#cities = destinationsMock.map((dest) => dest.name);
    }

    return this.#cities;
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
    // TODO
    // Рассмотреть возможность заменты полей date_from и date_to сразу на объекты Date, чтобы
    // каждый раз не преобразовывать их из строки в объект и из объекта в строку, ведь отправлть
    // на сервер буду адаптированные для этого данные.
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
    if (index === -1) {
      return;
    }
    let selectedPoint = this.listPoints[index];
    selectedPoint = { ...this.listPoints[index], ...updatedData };
    this.listPoints[index] = selectedPoint;
    this.#notifyAboutListChange();

    // Возвращаем выбранную точку.
    return selectedPoint;
  }

  removePoint(pointId) {
    const index = this.listPoints.findIndex((item) => item.id === pointId);
    this.listPoints.splice(index, 1);
    this.#notifyAboutListChange();
  }

  addPoint(data) {
    // Генерируем новый ID.
    data.id = nanoid();
    this.listPoints.push(data);
    this.listPoints.sort(SORT_CONFIG['date']);
    this.#notifyAboutListChange();
  }

  findDestinationByIndex(index) {
    // Дефолтная сортировка по датам.
    const sortedList = this.listPoints.toSorted(SORT_CONFIG['date']);
    return this.destinationsReadOnly?.find(
      ({ id }) => id === sortedList[index]?.destination,
    );
  }

  /** Обратно переводит имя назначения в id. */
  transformDestinationNameToId(destinationName) {
    const item = this.destinationsReadOnly.find(
      ({ name }) => name === destinationName,
    );
    return item.id;
  }

  #notifyAboutListChange() {
    this._notify();
  }
}
