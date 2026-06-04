import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import Observable from '../framework/observable.js';
import { replaceSnakeToCamel, transformListPoint } from '../utils/index.js';
import { SORT_CONFIG, DEFAULT_SORT, LoadStatus, TimeLimit } from '../const.js';

export default class TripModel extends Observable {
  #pointsApiService = null;

  #points = null;
  #destinations = null;
  #offers = null;
  #cities = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

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

  /** @returns {Array<Object>} Список путевых точек */
  get listPoints() {
    return this.#points;
  }

  /** Обновляет данные выбранной точки */
  async updatePoint(pointId, updatedData) {
    this.#uiBlocker.block();

    try {
      const index = this.listPoints.findIndex((item) => item.id === pointId);
      if (index === -1) {
        // prettier-ignore
        throw new Error('Can\'t update nonexistent point');
      }
      let selectedPoint = this.listPoints[index];
      selectedPoint = { ...this.listPoints[index], ...updatedData };

      await this.#pointsApiService.updatePoint(selectedPoint);
      // Обновление в локальных данных.
      this.listPoints[index] = selectedPoint;
      this._notify();

      return selectedPoint;
    } catch (err) {
      // prettier-ignore
      throw new Error('Can\'t update current point');
    } finally {
      this.#uiBlocker.unblock();
    }
  }

  async removePoint(pointId) {
    this.#uiBlocker.block();
    try {
      await this.#pointsApiService.removePoint(pointId);
      const index = this.listPoints.findIndex((item) => item.id === pointId);
      this.listPoints.splice(index, 1);
      this._notify();
    } catch (err) {
      // prettier-ignore
      throw new Error('Can\'t remove current point');
    } finally {
      this.#uiBlocker.unblock();
    }
  }

  async addPoint(data) {
    this.#uiBlocker.block();
    try {
      const result = await this.#pointsApiService.addPoint(data);
      data.id = result.id;

      this.listPoints.push(data);
      this.listPoints.sort(SORT_CONFIG[DEFAULT_SORT]);
      this._notify();
    } catch (err) {
      // prettier-ignore
      throw new Error('Can\'t add current point, validation error');
    } finally {
      this.#uiBlocker.unblock();
    }
  }

  async init() {
    this.#uiBlocker.block();
    try {
      // Получаю данные с сервера
      const [serverPoints, serverDestinations, serverOffers] =
        await Promise.all([
          this.#pointsApiService.points,
          this.#pointsApiService.destinations,
          this.#pointsApiService.offers,
        ]);

      const { cities, destinationsById, offersByType, listPoints } =
        TripModel.#adaptToClient(
          serverPoints,
          serverDestinations,
          serverOffers,
        );

      this.#points = listPoints;
      this.#destinations = destinationsById;
      this.#offers = offersByType;
      this.#cities = cities;

      // Уведомляю для рендера tripInfo в Header.
      this._notify(LoadStatus.RESOLVED);
    } catch (err) {
      this._notify(LoadStatus.REJECTED);
    } finally {
      this.#uiBlocker.unblock();
    }
  }

  static #adaptToClient(serverPoints, serverDestinations, serverOffers) {
    const listPoints =
      replaceSnakeToCamel(serverPoints).map(transformListPoint);
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

    return {
      listPoints,
      cities,
      destinationsById,
      offersByType,
    };
  }
}
