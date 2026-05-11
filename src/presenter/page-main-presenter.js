import { render, remove } from '../framework/render.js';
import {
  PageMainView,
  TripEventsEmptyView,
  TripEventsView,
} from '../view/index.js';
import SortPresenter from './sort-presenter.js';
import ListPresenter from './list-presenter.js';
import FilterPresenter from './filter-presenter.js';
import { FilterStatus } from '../const.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {Model} tripModel - Данные модели для рендера страницы
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 * @property {Class} newPointPresenter - Презентер кнопки создания нового события.
 */

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;
  #newPointPresenter = null;

  #mainView = new PageMainView();
  #tripEventsView = null;
  #tripEventsEmptyView = null;

  #sortPresenter = null;
  #listPresenter = null;

  /** @param {PresenterConfig} */
  constructor({ container, tripModel, newPointPresenter, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = newPointPresenter;

    this.#filterModel.addObserver(this.#handleFilterStatus);
  }

  get tripEventsView() {
    return this.#tripEventsView;
  }

  get listView() {
    return this.#listPresenter.listView;
  }

  init() {
    this.#renderMain();
  }

  reinitListView(sortedList) {
    // Закрывает открытые формы редактирования\создания точки.
    this.#listPresenter.resetListView();
    // Удаляет список точек.
    this.#listPresenter.destroy();
    // Создает новый список точек с новыми данными sortedList.
    this.#listPresenter.init(sortedList);
  }

  renderEventsSection(filter = null, isNoEmptyMessage = false) {
    // Если фильтр отсутсвует, то рендер по-умолчанию с фильтром 'everything' согласно ТЗ.
    if (this.#tripEventsView) {
      this.#destroyTripEventsView();
    }

    this.#tripEventsView = new TripEventsView();
    render(this.#tripEventsView, this.#mainView.container);

    // Рендер без сообщения о пустом списке при пустом списке для созднаия новой первой точки и без
    // сортировки.
    if (isNoEmptyMessage) {
      this.#listPresenter = new ListPresenter(this.#createCommonConfig());
      this.#listPresenter.init();
      return;
    }

    // При переключении фильтра соответсвующий рендер.
    if (filter) {
      /** Список, с которым будет фильтрация. */
      const points = this.#tripModel.listPoints;
      const filterStauts = this.#filterModel.filter;
      const filteredPoints = FilterPresenter.filterList(filterStauts, points);

      if (filteredPoints.length) {
        this.#renderEvents();
        return;
      }
      this.#renderEmptyMessage(filterStauts);
      return;
    }

    // Рендер по умолчанию.
    if (this.#tripModel.listPoints.length) {
      this.#renderEvents();
    } else {
      this.#renderEmptyMessage();
    }
  }

  /** Очищает элемент tripEvents. */
  #destroyTripEventsView() {
    if (this.#listPresenter) {
      this.#listPresenter.destroy();
      this.#listPresenter = null;
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }

    remove(this.#tripEventsView);
    this.#tripEventsEmptyView = null;
  }

  #renderMain() {
    render(this.#mainView, this.#container);
    this.renderEventsSection();
  }

  #renderEvents() {
    // Сперва необходимо создать презентер списка для его передачи
    // презентеру сортириовки.
    this.#listPresenter = new ListPresenter(this.#createCommonConfig());
    this.#sortPresenter = new SortPresenter(this.#createCommonConfig());

    this.#sortPresenter.init();
    this.#listPresenter.init();
  }

  #createCommonConfig() {
    return {
      pageMainPresenter: this,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      newPointPresenter: this.#newPointPresenter,
    };
  }

  #renderEmptyMessage(filter = null) {
    this.#tripEventsEmptyView = new TripEventsEmptyView(filter);
    render(this.#tripEventsEmptyView, this.#tripEventsView.element);
  }

  #handleFilterStatus = (filter, status) => {
    if (status !== FilterStatus.CHANGE) {
      return;
    }

    // Очищаем презентер новой точки.
    this.#newPointPresenter.destroy();

    // Очищаем элемент для нового рендера.
    this.renderEventsSection(filter);
  };
}
