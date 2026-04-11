import { ListView } from '../view/index.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import { SORT_CONFIG } from '../const.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {TripModel} tripModel - Модель данных поездки
 * @property {Class} newEventBtnPresenter - Презентер кнопки создания нового события.
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 */

/** Презентер списка. Отвечает за рендеринг компонента Списка. */
export default class ListPresenter {
  #newEventBtnPresenter = null;
  #container = null;
  #tripModel = null;
  #filterModel = null;

  /** Коллекция из презентеров точек. */
  #pointPresenters = new Map();

  /** Публичный доступ для управления списком представления из header презентера при создании новой точки. */
  listView = new ListView();

  /** @param {PresenterConfig} config - Конфигурация презентера */
  constructor({ container, tripModel, newEventBtnPresenter, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#newEventBtnPresenter = newEventBtnPresenter;
  }

  init(sortedList) {
    this.#renderList(sortedList);
  }

  /** Полная очистка списка и коллекции презентеров. */
  clearList() {
    this.listView.element.innerHTML = '';
    this.#pointPresenters.forEach((presenter) => {
      presenter.clear();
      presenter = null;
    });
    this.#pointPresenters.clear();
  }

  /** Перерисовывает список */
  resetListView = () => {
    this.#pointPresenters.forEach((presenter) =>
      presenter.fullReplaceFormToPoint(),
    );
  };

  /** Удаляет презентер точки из списка по id */
  #removeFromPointPresenters = (id) => this.#pointPresenters.delete(id);

  #renderList(sortedList = null) {
    // Проверяет получение отсортированного списка, иначе берём данные из модели.
    if (!sortedList) {
      /** Значение для выделения нужных дат */
      const currentFilter = this.#filterModel.filter;
      const filteredList = FilterPresenter.filterList(
        currentFilter,
        this.#tripModel.listPoints,
      );

      filteredList
        .sort(SORT_CONFIG['date'])
        .forEach((point) => this.#createPoint(point));

      render(this.listView, this.#container);
      return;
    }

    sortedList.forEach((point) => this.#createPoint(point));
    render(this.listView, this.#container);
  }

  #createPoint(pointData) {
    const pointPresenter = new PointPresenter({
      pointData,
      listPresenter: this,
      tripModel: this.#tripModel,
      newEventBtnPresenter: this.#newEventBtnPresenter,
      resetListView: this.resetListView,
      removeFromPointPresenters: this.#removeFromPointPresenters,
    });
    pointPresenter.init();
    this.#pointPresenters.set(pointData.id, pointPresenter);
  }
}
