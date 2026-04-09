import { ListPointView } from '../view/index.js';
import PointFormPresenter from './point-form-presenter.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';

/** Конфигурация презентера путевой точки.
 * @typedef {Object} PointConfig
 * @property {PointData} pointData - Данные точки маршрута.
 * @property {TripModel} tripModel - Модель данных поездки.
 * @property {HTMLUListElement} listElement - Элемент списка для вставки точки.
 * @property {HTMLElement} tripEventsElement - Элемент с сортировкой и списком точек.
 * @property {Class} newEventBtnPresenter - Презентер кнопки создания нового события.
 * @property {function(): void} resetListView - Функция‑callback, сбрасывающая список
 * @property {function(): void} removeFromPointPresenters - Функция‑callback, удаляющая
 * из коллекции Map в listPresenter.
 */

/** Модель точки маршрута (event point) для планировщика поездок.
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
  #listElement = null;
  #tripEventsElement = null;

  #newEventBtnPresenter = null;
  #pointFormPresenter = null;

  #resetListView = null;
  #pointComponent = null;

  #mode = Mode.DEFAULT;

  /** @param {PointConfig} config - Конфигурация презентера */
  constructor({
    pointData,
    tripModel,
    listElement,
    tripEventsElement,
    newEventBtnPresenter,
    resetListView,
    removeFromPointPresenters,
  }) {
    this.#pointData = pointData;
    this.#tripModel = tripModel;
    this.#listElement = listElement;
    this.#tripEventsElement = tripEventsElement;
    this.#newEventBtnPresenter = newEventBtnPresenter;
    this.#resetListView = resetListView;

    this.#pointFormPresenter = new PointFormPresenter({
      pointData: this.#pointData,
      viewPointData: PointPresenter.#createViewPointData(
        this.#tripModel,
        this.#pointData,
      ),
      tripModel: this.#tripModel,
      onRolldownClick: this.#handleCloseRolldownClick,
      removeFromPointPresenters: removeFromPointPresenters,
    });
  }

  init() {
    this.#renderPoint();
  }

  /**
   * Закрывает форму через listPresenter (поэтому публичный метод), если она была открыта,
   * чтобы на странице была только одна открытая форма.
   */
  fullReplaceFormToPoint() {
    if (this.#mode === Mode.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  /** Очищает презентер */
  clear() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    remove(this.#pointComponent);
    this.#pointComponent = null;

    this.#pointFormPresenter.removeComponent();
  }

  #renderPoint() {
    this.#createPointComponent();
    render(this.#pointComponent, this.#listElement);
  }

  #createPointComponent() {
    this.#pointComponent = new ListPointView({
      ...PointPresenter.#createViewPointData(this.#tripModel, this.#pointData),
      onRollupClick: this.#openRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });
  }

  /**
   *  Метод сброса представления в презентере маршрута для отображения точки маршрута
   *  вместо формы редактирования.
   */
  #replacePointToForm() {
    this.#newEventBtnPresenter.closeForm();

    /**
     * Закрывает все открытые формы через чтобы
     * на странице была только одна открытая форма.
     */
    this.#resetListView();

    this.#mode = Mode.EDITING;

    replace(this.#pointFormPresenter.component, this.#pointComponent);
    remove(this.#pointComponent);
  }

  #replaceFormToPoint() {
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#createPointComponent();
    replace(this.#pointComponent, this.#pointFormPresenter.component);

    this.#pointFormPresenter.removeComponent();
  }

  /** Открытие по нажатию Rollup. */
  #openRollupClickHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  /** Закрытие по нажатию Rollup в форме. */
  #handleCloseRolldownClick = () => {
    this.#replaceFormToPoint();
  };

  /** Закрытие по нажатию ESC. */
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
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

  static #createViewPointData(tripModel, point) {
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
