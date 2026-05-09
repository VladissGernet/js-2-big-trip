import Observable from '../framework/observable.js';
// TODO
// Рассмотреть удаление nanoid обязательно через 'npm uninstall'. Обязательно затестировать нужно присвоение id новым точкам.
import { nanoid } from 'nanoid';
import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import { pointsMock } from '../mock/points-mock.js';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';
import { SORT_CONFIG, DEFAULT_SORT } from '../const.js';

export default class TripModel extends Observable {
  #points = null;
  #destinations = null;
  #offers = null;
  #cities = null;

  /** Массив всех городов из данных */
  get cities() {
    if (!this.#cities) {
      // TODO обработать данные с сервера.
      this.#cities = destinationsMock.map((dest) => dest.name);
    }

    return this.#cities;
  }

  /** @returns {Map<string, Object>}  Назначения по ID для быстрого поиска. */
  get destinationsById() {
    if (!this.#destinations) {
      // Преобразовываю данные для оптимизированного поиска.
      // TODO преобразовать для получения данных с сервера.
      this.#destinations = destinationsMock.reduce(
        (result, { id, ...rest }) => result.set(id, rest),
        new Map(),
      );
    }
    return this.#destinations;
  }
  // TODO проследить путь данных

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

  /** Для отрисовки формы создания новой точки. По умолчанию, выбирается самый первый из полученных данных. */
  get defaultTypeOffer() {
    // TODO исправить при получении данных сервера.
    return offersMock[0].type;
  }

  /** @returns {Array<Object>} Список путевых точек */
  get listPoints() {
    // TODO
    // Рассмотреть возможность заменты полей date_from и date_to сразу на объекты Date (dayjs), чтобы
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
    // TODO
    // Сначала нужно сделать изменение на сервере, дождаться с помощью try/catch и await и только потом
    // отобразить на клиенте в разметке, иначе отработать ошибку в catch.
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
    // TODO
    // Сначала нужно сделать изменение на сервере, дождаться с помощью try/catch и await и только потом
    // отобразить на клиенте в разметке, иначе отработать ошибку в catch.
    const index = this.listPoints.findIndex((item) => item.id === pointId);
    this.listPoints.splice(index, 1);
    this.#notifyAboutListChange();
  }

  addPoint(data) {
    // TODO
    // Сначала нужно сделать изменение на сервере, дождаться с помощью try/catch и await и только потом
    // отобразить на клиенте в разметке, иначе отработать ошибку в catch.

    // Есть пример в демо проекте async addAtask

    // Генерируем новый ID.
    // TODO удалить naonoid после настройки данных с сервера
    data.id = nanoid();
    this.listPoints.push(data);
    this.listPoints.sort(SORT_CONFIG[DEFAULT_SORT]);
    this.#notifyAboutListChange();
  }

  #notifyAboutListChange() {
    this._notify();
  }
}
