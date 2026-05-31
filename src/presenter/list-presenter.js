import { ListView } from '../view/index.js';
import { render, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import { SORT_CONFIG, DEFAULT_SORT } from '../const.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {Class} pageMainPresenter - Презентер страницы Main.
 * @property {TripModel} tripModel - Модель данных поездки.
 * @property {Class} newPointPresenter - Презентер кнопки создания нового события.
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 */

/** Презентер списка. Отвечает за рендеринг компонента Списка. */
export default class ListPresenter {
  #pageMainPresenter = null;
  #tripModel = null;
  #filterModel = null;
  #newPointPresenter = null;

  #listView = null;

  /** Коллекция из презентеров точек. */
  #pointPresenters = new Map();

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({
    pageMainPresenter,
    tripModel,
    newPointPresenter,
    filterModel,
  }) {
    this.#pageMainPresenter = pageMainPresenter;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = newPointPresenter;
  }

  get listView() {
    return this.#listView;
  }

  init(sortedPoints = null) {
    this.#renderList(sortedPoints);
  }

  /** Полная очистка списка и коллекции презентеров. */
  destroy() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.clear();
      presenter = null;
    });
    this.#pointPresenters.clear();

    remove(this.#listView);
    this.#listView.removeElement();
    this.#listView = null;
  }

  /** Перерисовывает список */
  closeListForms = () => {
    // Нужен контекст для callback редактировании точки и публичный метод.
    this.#pointPresenters.forEach((presenter) =>
      presenter.fullReplaceFormToPoint(),
    );
  };

  /** Удаляет презентер точки из списка по id */
  #removeFromPointPresenters = (id) => this.#pointPresenters.delete(id);

  #renderList(sortedPoints = null) {
    if (this.#listView) {
      this.destroy();
    }

    this.#listView = new ListView();
    const tripEventsElement = this.#pageMainPresenter.tripEventsView.element;

    // Проверяет получение отсортированного списка, иначе берём данные из модели.
    if (!sortedPoints) {
      /** Значение для выделения нужных дат */
      const currentFilter = this.#filterModel.filter;
      const filteredList = FilterPresenter.filterList(
        currentFilter,
        this.#tripModel.listPoints,
      );

      filteredList
        .sort(SORT_CONFIG[DEFAULT_SORT])
        .forEach((point) => this.#createPoint(point));

      render(this.#listView, tripEventsElement);
      return;
    }

    sortedPoints.forEach((point) => this.#createPoint(point));
    render(this.#listView, tripEventsElement);
  }

  #createPoint(pointData) {
    const pointPresenter = new PointPresenter({
      pointData,
      pageMainPresenter: this.#pageMainPresenter,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      newPointPresenter: this.#newPointPresenter,
      closeListForms: this.closeListForms,
      removeFromPointPresenters: this.#removeFromPointPresenters,
    });
    pointPresenter.init();
    this.#pointPresenters.set(pointData.id, pointPresenter);
  }
}
