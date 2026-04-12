import { ListPointView } from '../view/index.js';
import PointFormPresenter from './point-form-presenter.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';

/** Конфигурация презентера путевой точки.
 * @typedef {Object} PointConfig
 * @property {PointData} pointData - Данные точки маршрута.
 * @property {TripModel} tripModel - Модель данных поездки.
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Class} pageMainPresenter - Презентер страницы Main.
 * @property {Class} newEventBtnPresenter - Презентер кнопки создания нового события.
 * @property {function(): void} resetListView - Функция‑callback, сбрасывающая список
 * @property {function(): void} removeFromPointPresenters - Функция‑callback, удаляющая
 * из коллекции Map в listPresenter.
 */

/** Данные точки маршрута (event point) для планировщика поездок.
 * @typedef {Object} PointData
 * @property {string} id - Уникальный идентификатор точки (UUID).
 * @property {number} basePrice - Базовая цена услуги в рублях.
 * @property {string} dateFrom - Дата и время начала события в формате ISO 8601 (UTC).
 * @property {string} dateTo - Дата и время окончания события в формате ISO 8601 (UTC).
 * @property {string} destination - Идентификатор пункта назначения (UUID).
 * @property {boolean} isFavorite - Флаг избранного события.
 * @property {string[]} offers - Массив идентификаторов доступных предложений/опций (UUID).
 * @property {string} type - Тип события: 'check-in', 'taxi', 'sightseeing', 'flight' и т.д.
 */

/** Модель данных поездки.
 * @typedef {Object} TripModel
 * @property {Object<string, DestinationData>} destinationsById - Назначения по ID
 * @property {Object<string, ListOffers>} offersByType - Предложения по типу
 */

export default class PointPresenter {
  #pointData = null;
  #tripModel = null;
  #filterModel = null;
  #pageMainPresenter = null;
  #newEventBtnPresenter = null;
  #resetListView = null;
  #removeFromPointPresenters = null;

  #pointFormPresenter = null;
  #pointComponent = null;

  // Режим текущй точки (по умолчанию\редактируется)
  #mode = Mode.DEFAULT;

  /** @param {PointConfig} config - Конфигурация презентера */
  constructor({
    pointData,
    tripModel,
    filterModel,
    pageMainPresenter,
    newEventBtnPresenter,
    resetListView,
    removeFromPointPresenters,
  }) {
    this.#pointData = pointData;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#pageMainPresenter = pageMainPresenter;
    this.#newEventBtnPresenter = newEventBtnPresenter;
    this.#resetListView = resetListView;
    this.#removeFromPointPresenters = removeFromPointPresenters;
  }

  init() {
    this.#renderPoint();
  }

  /**
   * Закрывает форму через listPresenter (поэтому публичный метод), если она была открыта,
   * чтобы на странице была только одна открытая форма.
   */
  fullReplaceFormToPoint() {
    // Оптимизировано, чтобы не перерисовывать всю страницу.
    if (this.#mode === Mode.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  /** Очищает компонент презентера. */
  clear() {
    remove(this.#pointComponent);
    this.#pointComponent = null;
  }

  #renderPoint() {
    this.#createPointComponent();
    render(this.#pointComponent, this.#pageMainPresenter.listView.element);
  }

  #createPointComponent() {
    const viewPointData = PointPresenter.createViewPointData(
      this.#tripModel,
      this.#pointData,
    );

    this.#pointComponent = new ListPointView({
      ...viewPointData,
      onRollupClick: this.#openRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });
  }

  /**
   *  Метод сброса представления в презентере маршрута для отображения точки маршрута
   *  вместо формы редактирования.
   */
  #replacePointToForm() {
    this.#newEventBtnPresenter.destroy();
    this.#createPointFormPresenter();

    // Закрывает все открытые формы чтобы на странице была только одна открытая форма.
    this.#resetListView();

    this.#mode = Mode.EDITING;

    replace(this.#pointFormPresenter.component, this.#pointComponent);
    remove(this.#pointComponent);
  }

  #createPointFormPresenter() {
    this.#pointFormPresenter = new PointFormPresenter({
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      isEditForm: true,
      pointData: this.#pointData,
      pointPresenter: this,
      pageMainPresenter: this.#pageMainPresenter,
      onRolldownClick: this.#handleCloseRolldownClick,
      removeFromPointPresenters: this.#removeFromPointPresenters,
    });
  }

  #replaceFormToPoint() {
    this.#mode = Mode.DEFAULT;

    this.#createPointComponent();
    replace(this.#pointComponent, this.#pointFormPresenter.component);

    this.#pointFormPresenter.removeComponent();
    this.#pointFormPresenter = null;
  }

  /** Открытие по нажатию Rollup. */
  #openRollupClickHandler = () => {
    this.#replacePointToForm();
  };

  /** Закрытие по нажатию Rollup в форме. */
  #handleCloseRolldownClick = () => {
    this.#replaceFormToPoint();
  };

  /** Обработчик добавления в избранное. */
  #favoriteClickHandler = () => {
    const selectedPointId = this.#pointData.id;
    // Обновляем данные.
    this.#pointData = this.#tripModel.updatePoint(selectedPointId, {
      isFavorite: !this.#pointData.isFavorite,
    });

    // Перерисовываем точку на странице.
    const prevPointComponent = this.#pointComponent;
    this.#createPointComponent();
    replace(this.#pointComponent, prevPointComponent);
  };

  static #transformOfferTypeData({ offerTypeData, currentPointOffers }) {
    return Array.from(offerTypeData, ([id, data]) => ({
      ...data,
      isSelected: currentPointOffers.has(id),
    }));
  }

  static createViewPointData(tripModel, point) {
    const destinationData = tripModel.destinationsById.get(point.destination);

    const transformedOfferTypeData = PointPresenter.#transformOfferTypeData({
      offerTypeData: tripModel.offersByType.get(point.type),
      currentPointOffers: point.offers,
    });

    return {
      listPoint: point,
      destinationData: destinationData,
      offerData: transformedOfferTypeData,
    };
  }
}
