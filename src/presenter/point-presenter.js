import {
  ListPointView,
  ListPointFormView,
  TripEventsEmptyView,
} from '../view/index.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';

/** Конфигурация презентера путевой точки.
 * @typedef {Object} PointConfig
 * @property {PointData} point - Данные точки маршрута.
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
  #point = null;
  #tripModel = null;
  #listElement = null;
  #tripEventsElement = null;
  #newEventBtnPresenter = null;
  #resetListView = null;
  #removeFromPointPresenters = null;
  #pointComponent = null;
  #pointFormComponent = null;
  #mode = Mode.DEFAULT;

  /** @param {PointConfig} config - Конфигурация презентера */
  constructor({
    point,
    tripModel,
    listElement,
    tripEventsElement,
    newEventBtnPresenter,
    resetListView,
    removeFromPointPresenters,
  }) {
    this.#point = point;
    this.#tripModel = tripModel;
    this.#listElement = listElement;
    this.#tripEventsElement = tripEventsElement;
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
    if (this.#mode === Mode.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  /** Очищает презентер */
  clear() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    remove(this.#pointComponent);
    remove(this.#pointFormComponent);

    this.#pointComponent = null;
    this.#pointFormComponent = null;
  }

  get #pointData() {
    const destinationData = this.#tripModel.destinationsById.get(
      this.#point.destination,
    );

    const transformedOfferTypeData = PointPresenter.transformOfferTypeData({
      offerTypeData: this.#tripModel.offersByType.get(this.#point.type),
      currentPointOffers: this.#point.offers,
    });

    return {
      listPoint: this.#point,
      destinationData: destinationData,
      offerData: transformedOfferTypeData,
    };
  }

  #renderPoint() {
    this.#createPointComponent();
    render(this.#pointComponent, this.#listElement);
  }

  #createPointComponent() {
    this.#pointComponent = new ListPointView({
      ...this.#pointData,
      onRollupClick: this.#openRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });
  }

  #createFormComponent() {
    this.#pointFormComponent = new ListPointFormView({
      pointData: this.#pointData,
      isEditForm: true,
      tripModel: this.#tripModel,
      onRollupClick: this.#handleCloseRollupClick,
      onResetClick: this.#deleteClickHandler,
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
    this.#createFormComponent();

    replace(this.#pointFormComponent, this.#pointComponent);

    remove(this.#pointComponent);
  }

  #replaceFormToPoint() {
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#createPointComponent();
    replace(this.#pointComponent, this.#pointFormComponent);

    remove(this.#pointFormComponent);
  }

  /** Открытие по нажатию Rollup. */
  #openRollupClickHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  /** Закрытие по нажатию Rollup в форме. */
  #handleCloseRollupClick = () => {
    this.#replaceFormToPoint();
  };

  /** Закрытие по нажатию ESC. */
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  /** Удаление текущей Point из списка. */
  #deleteClickHandler = () => {
    this.clear();

    // Удаление из данных модели.
    const selectedPointId = this.#point.id;
    this.#tripModel.removePoint(selectedPointId);

    // Удаление из коллекции презентеров точек.
    this.#removeFromPointPresenters(this.#point.id);

    //Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    if (this.#tripModel.listPoints.length === 0) {
      this.#tripEventsElement.innerHTML =
        '<h2 class="visually-hidden">Trip events</h2>';
      render(new TripEventsEmptyView(), this.#tripEventsElement);
    }
  };

  /** Обработчик добавления в избранное. */
  #favoriteClickHandler = () => {
    const selectedPointId = this.#point.id;
    // Обновляем данные.
    this.#point = this.#tripModel.updatePoint(selectedPointId, {
      isFavorite: !this.#point.isFavorite,
    });

    // Перерисовываем точку на странице.
    const prevPointComponent = this.#pointComponent;
    this.#createPointComponent();
    replace(this.#pointComponent, prevPointComponent);
  };

  static transformOfferTypeData({ offerTypeData, currentPointOffers }) {
    return Array.from(offerTypeData, ([id, data]) => ({
      ...data,
      isSelected: currentPointOffers.has(id),
    }));
  }
}
