import Observable from '../framework/observable.js';
// TODO Рассмотреть удаление nanoid обязательно через 'npm uninstall'. Обязательно проверить нужно присвоение id новым точкам.
import { nanoid } from 'nanoid';
import { replaceSnakeToCamel } from '../utils/replace-snake-to-camel.js';
import { SORT_CONFIG, DEFAULT_SORT, LoadStatus } from '../const.js';

export default class TripModel extends Observable {
  #pointsApiService = null;

  #points = null;
  #destinations = null;
  #offers = null;
  #defaultTypeOffer = null;
  #cities = null;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  /** Массив всех городов из данных */
  get cities() {
    return this.#cities;
  }

  /** @returns {Map<string, Object>}  Назначения по ID для быстрого поиска. */
  get destinationsById() {
    return this.#destinations;
  }

  /** @returns {Map<string, Map<string, Object>}  Назначения по типу для быстрого поиска. */
  get offersByType() {
    return this.#offers;
  }

  /** Для отрисовки формы создания новой точки. По умолчанию, выбирается самый первый из полученных данных. */
  get defaultTypeOffer() {
    return this.#defaultTypeOffer;
  }

  /** @returns {Array<Object>} Список путевых точек */
  get listPoints() {
    return this.#points;
  }

  /** Обновляет данные выбранной точки */
  updatePoint(pointId, updatedData) {
    try {
      const index = this.listPoints.findIndex((item) => item.id === pointId);
      if (index === -1) {
        // prettier-ignore
        throw new Error('Can\'t update unexisting task');
      }

      let selectedPoint = this.listPoints[index];
      selectedPoint = { ...this.listPoints[index], ...updatedData };
      this.listPoints[index] = selectedPoint;
      this.#pointsApiService.updatePoint(selectedPoint);

      // Возвращаем выбранную точку.
      return selectedPoint;
    } catch (error) {
      // prettier-ignore
      throw new Error('Can\'t update unexisting task');
      // TODO добавить шейк при block request
    }
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

    // Есть пример в демо проекте async addTask

    // Генерируем новый ID.
    // TODO удалить nanoid после настройки данных с сервера
    data.id = nanoid();
    this.listPoints.push(data);
    this.listPoints.sort(SORT_CONFIG[DEFAULT_SORT]);
    this.#notifyAboutListChange();
  }

  #notifyAboutListChange() {
    this._notify();
  }

  async init() {
    try {
      // Получаю данные с сервера
      const [serverPoints, serverDestinations, serverOffers] =
        await Promise.all([
          this.#pointsApiService.points,
          this.#pointsApiService.destinations,
          this.#pointsApiService.offers,
        ]);

      const {
        cities,
        destinationsById,
        offersByType,
        defaultTypeOffer,
        listPoints,
      } = TripModel.#adaptToClient(
        serverPoints,
        serverDestinations,
        serverOffers,
      );

      this.#points = listPoints;
      this.#destinations = destinationsById;
      this.#offers = offersByType;
      this.#defaultTypeOffer = defaultTypeOffer;
      this.#cities = cities;

      // Уведомляю для реднера tripInfo в Header.
      this._notify(LoadStatus.RESOLVED);
    } catch (error) {
      this._notify(LoadStatus.REJECTED);
    }
  }

  static #adaptToClient(serverPoints, serverDestinations, serverOffers) {
    console.log(serverPoints[0]);

    const listPoints = replaceSnakeToCamel(serverPoints).map(
      ({ offers, ...rest }) => ({
        ...rest,
        offers: new Set(offers),
      }),
    );
    const cities = serverDestinations.map((dest) => dest.name);
    const destinationsById = serverDestinations.reduce(
      (result, { id, ...rest }) => result.set(id, rest),
      new Map(),
    );
    const offersByType = serverOffers.reduce((result, { type, offers }) => {
      const offersMap = offers.reduce(
        (acc, { id, ...rest }) => acc.set(id, rest),
        new Map(),
      );
      return result.set(type, offersMap);
    }, new Map());
    const defaultTypeOffer = serverOffers[0].type;

    return {
      listPoints,
      cities,
      destinationsById,
      offersByType,
      defaultTypeOffer,
    };
  }
}
