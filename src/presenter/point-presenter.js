import { ListPointView, ListPointFormView } from '../view/index.js';
import { render, replace, remove } from '../framework/render.js';

/** Конфигурация презентера путевой точки.
 * @typedef {Object} PointConfig
 * @property {PointData} point - Данные точки маршрута.
 * @property {TripModel} model - Модель данных поездки.
 * @property {HTMLUListElement} listElement - Элемент списка для вставки точки.
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
  #point;
  #model;
  #listElement;
  #pointComponent = null;
  #pointFormComponent = null;

  /** @param {PointConfig} config - Конфигурация презентера */
  constructor({ point, model, listElement }) {
    this.#point = point;
    this.#model = model;
    this.#listElement = listElement;
  }

  init() {
    this.#renderPoint();
  }

  get #data() {
    const { destinationsById, offersByType } = this.#model;
    const destinationData = destinationsById.get(this.#point.destination);
    const offerTypeData = offersByType.get(this.#point.type);

    const transformedOfferTypeData = this.#transformOfferTypeData(
      offerTypeData,
      this.#point.offers,
    );

    return {
      destinationData: destinationData,
      transformedOfferTypeData: transformedOfferTypeData,
    };
  }

  #transformOfferTypeData(offerTypeData, currentPointOffers) {
    if (offerTypeData === 0 || currentPointOffers.length === 0) {
      return [];
    }
    const selectedIds = new Set(currentPointOffers);
    return Array.from(offerTypeData, ([id, data]) => ({
      ...data,
      isSelected: selectedIds.has(id),
    }));
  }

  #renderPoint() {
    this.#createPointComponent();
    render(this.#pointComponent, this.#listElement);
  }

  #createPointComponent() {
    const { destinationData, transformedOfferTypeData } = this.#data;

    this.#pointComponent = new ListPointView({
      listPoint: this.#point,
      destinationData: destinationData,
      offerData: transformedOfferTypeData,
      onRollupClick: this.#handleOpenRollupClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
  }

  #createFormComponent() {
    const { destinationData, transformedOfferTypeData } = this.#data;

    const pointData = {
      listPoint: this.#point,
      destinationData: destinationData,
      listOffers: transformedOfferTypeData,
    };

    this.#pointFormComponent = new ListPointFormView({
      pointData: pointData,
      isEditForm: true,
      model: this.#model,
      onRollupClick: this.#handleCloseRollupClick,
      onResetClick: this.#handleDeleteClick,
    });
  }

  #replacePointToForm() {
    this.#createFormComponent();

    replace(this.#pointFormComponent, this.#pointComponent);

    this.#pointComponent.removeEventListeners();
    this.#pointComponent = null;
  }

  #replaceFormToPoint() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#createPointComponent();

    replace(this.#pointComponent, this.#pointFormComponent);

    this.#pointFormComponent.removeEventListeners();
    this.#pointFormComponent = null;
  }

  /** Открытие по нажатию Rollup. */
  #handleOpenRollupClick = () => {
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
  #handleDeleteClick = () => {
    // TODO Решить баг, кодгда на странице удалены все точки, должна отрисовываться пустая страничка
    // Для этого надо удаление связать с данными из модели, а также удалять презентер со всеми его обработчиками.
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#pointFormComponent);
    remove(this.#pointComponent);
  };

  /** Обработчик добавления в избранное. */
  #handleFavoriteClick = () => {
    // evt.currentTarget.classList.toggle('event__favorite-btn--active');
    // console.log(this.#point);
    // console.log(this.#model.destinationsById);
    // TODO Остновился здесь на
    // В презентере маршрута опишите метод изменения данных.
    // Задача метода — обновить моки и вызвать обновление конкретной точки маршрута.
    // 3. Добавить в обработичк обновление данных в Map
    // 4. Перерисовать элемент.
  };
}
