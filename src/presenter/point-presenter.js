import { ListPointView } from '../view/index.js';
import PointFormPresenter from './point-form-presenter.js';
import { render, replace, remove } from '../framework/render.js';
import { createViewPointData } from '../utils/index.js';

/** Конфигурация презентера путевой точки.
 * @typedef {Object} PointConfig
 * @property {PointData} pointData - Данные точки маршрута.
 * @property {TripModel} tripModel - Модель данных поездки.
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Class} pageMainPresenter - Презентер страницы Main.
 * @property {Class} newPointPresenter - Презентер кнопки создания нового события.
 * @property {function(): void} closeListForms - Функция‑callback, сбрасывающая список
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
  #newPointPresenter = null;
  #closeListForms = null;
  #removeFromPointPresenters = null;

  #pointFormPresenter = null;
  #pointComponent = null;

  // Статус текущей точки.
  #isEditing = false;

  /** @param {PointConfig} config - Конфигурация презентера */
  constructor({
    pointData,
    tripModel,
    filterModel,
    pageMainPresenter,
    newPointPresenter,
    closeListForms,
    removeFromPointPresenters,
  }) {
    this.#pointData = pointData;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#pageMainPresenter = pageMainPresenter;
    this.#newPointPresenter = newPointPresenter;
    this.#closeListForms = closeListForms;
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
    if (this.#isEditing) {
      this.#replaceFormToPoint();
    }
  }

  /** Очищает компонент презентера. */
  clear() {
    remove(this.#pointComponent);
    this.#pointComponent = null;

    if (this.#pointFormPresenter) {
      this.#pointFormPresenter.destroy();
      this.#pointFormPresenter = null;
    }
  }

  #renderPoint() {
    this.#createPointComponent();
    render(this.#pointComponent, this.#pageMainPresenter.listView.element);
  }

  #createPointComponent() {
    const viewPointData = createViewPointData({
      tripModel: this.#tripModel,
      pointData: this.#pointData,
    });

    this.#pointComponent = new ListPointView({
      ...viewPointData,
      onRollupClick: this.#openRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });
  }

  #replacePointToForm() {
    this.#newPointPresenter.destroy();
    this.#createPointFormPresenter();

    // Закрывает все открытые формы чтобы на странице была только одна открытая форма.
    this.#closeListForms();

    this.#isEditing = true;

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
      onRolldownClick: this.#closeRolldownClickHandler,
      removeFromPointPresenters: this.#removeFromPointPresenters,
    });
  }

  #replaceFormToPoint() {
    this.#isEditing = false;

    this.#createPointComponent();
    replace(this.#pointComponent, this.#pointFormPresenter.component);
    this.#pointFormPresenter.destroy();
    this.#pointFormPresenter = null;
  }

  /** Открытие по нажатию Rollup. */
  #openRollupClickHandler = () => {
    this.#replacePointToForm();
  };

  /** Закрытие по нажатию Rollup в форме. */
  #closeRolldownClickHandler = () => {
    this.#replaceFormToPoint();
  };

  /** Обработчик добавления в избранное. */
  #favoriteClickHandler = async () => {
    const selectedPointId = this.#pointData.id;
    try {
      // Обновляем данные.
      this.#pointData = await this.#tripModel.updatePoint(selectedPointId, {
        isFavorite: !this.#pointData.isFavorite,
      });

      // Перерисовываем точку на странице.
      const prevPointComponent = this.#pointComponent;
      this.#createPointComponent();
      replace(this.#pointComponent, prevPointComponent);
      // Удаляем старую точку с обработчиками.
      remove(prevPointComponent);
    } catch (error) {
      this.#pointComponent.shake();
      // prettier-ignore
      throw new Error('Can\'t update current point');
    }
  };
}
