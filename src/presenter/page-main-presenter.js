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

  resetListView(sortedList) {
    // Закрывает открытые формы редактирования\создания точки.
    this.#listPresenter.resetListView();
    // Удаляет список точек.
    this.#listPresenter.destroy();
    // Создает новый список точек с новыми данными sortedList.
    this.#listPresenter.init(sortedList);
  }

  renderEventsSection({
    filter = null,
    isNoPoints = false,
    isLoading = false,
  } = {}) {
    // Если фильтр отсутствует, то рендер по-умолчанию с фильтром 'everything' согласно ТЗ.
    if (this.#tripEventsView) {
      this.#destroyTripEventsView();
    }

    this.#tripEventsView = new TripEventsView();
    render(this.#tripEventsView, this.#mainView.container);

    // Рендер без сообщения о пустом списке при пустом списке для создания новой первой точки и без
    // сортировки.
    if (isNoPoints) {
      this.#listPresenter = new ListPresenter(this.#createCommonConfig());
      this.#listPresenter.init();
      return;
    }

    // При переключении фильтра соответствующий рендер.
    if (filter) {
      /** Список, с которым будет фильтрация. */
      const points = this.#tripModel.listPoints;
      const filterStatus = this.#filterModel.filter;
      const filteredPoints = FilterPresenter.filterList(filterStatus, points);

      if (filteredPoints.length) {
        this.#renderEvents();
        return;
      }

      this.#renderEmptyMessage({ filterStatus });
      return;
    }

    // Рендер по умолчанию.
    if (this.#tripModel.listPoints?.length) {
      this.#renderEvents();
      return;
    }

    if (isLoading) {
      this.#renderEmptyMessage({ isLoading });
      return;
    }
    this.#renderEmptyMessage();
  }

  /** Очищает элемент tripEvents. */
  #destroyTripEventsView() {
    if (this.#listPresenter) {
      this.#listPresenter.destroy();
      this.#listPresenter = null;
    }

    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }

    remove(this.#tripEventsView);
    this.#tripEventsEmptyView = null;
  }

  /** Рендер до загрузки данных. */
  #renderMain() {
    render(this.#mainView, this.#container);
    this.renderEventsSection({ isLoading: true });
  }

  #renderEvents() {
    // Сперва необходимо создать презентер списка для его передачи
    // презентеру сортировки.
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

  #renderEmptyMessage({ filterStatus = null, isLoading = false } = {}) {
    // TODO остановился на прокидываении статуса загрузки..
    console.log(isLoading);

    this.#tripEventsEmptyView = new TripEventsEmptyView(filterStatus);
    render(this.#tripEventsEmptyView, this.#tripEventsView.element);
  }

  #handleFilterStatus = (filter, status) => {
    if (status !== FilterStatus.CHANGE) {
      return;
    }

    // Очищаем презентер новой точки.
    this.#newPointPresenter.destroy();

    // Очищаем элемент для нового рендера.
    this.renderEventsSection({ filter });
  };
}
