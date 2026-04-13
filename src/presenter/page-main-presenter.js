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
 * @property {Class} newEventBtnPresenter - Презентер кнопки создания нового события.
 */

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;
  #newEventBtnPresenter = null;

  #mainView = new PageMainView();
  #tripEventsView = null;
  #tripEventsEmptyView = null;

  #sortPresenter = null;
  #listPresenter = null;

  /** @param {PresenterConfig} */
  constructor({ container, tripModel, newEventBtnPresenter, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#newEventBtnPresenter = newEventBtnPresenter;

    this.#filterModel.addObserver(this.#handleFilterStatus);
  }

  init() {
    this.#renderMain();
  }

  get tripEventsView() {
    return this.#tripEventsView;
  }

  get listView() {
    return this.#listPresenter.listView;
  }

  reinitListView(sortedList) {
    this.#listPresenter.destroy();
    this.#listPresenter.init(sortedList);
  }

  renderEventsSection(filteredPoints = null, filter = null) {
    if (this.#tripEventsView) {
      this.#destroyTripEventsView();
    }
    if (this.#sortPresenter) {
      this.#sortPresenter.removeComponent();
    }

    this.#tripEventsView = new TripEventsView();
    render(this.#tripEventsView, this.#mainView.container);

    // При переключении фильтра соответсвующий рендер.
    if (filteredPoints) {
      if (filteredPoints.length) {
        this.#renderEvents();
        return;
      }
      this.#renderEmptyMessage(filter);
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
    }

    remove(this.#tripEventsView);
    this.#tripEventsEmptyView = null;
  }

  #renderMain() {
    render(this.#mainView, this.#container);
    this.renderEventsSection();
  }

  #renderEvents() {
    const commonConfig = {
      pageMainPresenter: this,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      newEventBtnPresenter: this.#newEventBtnPresenter,
    };

    // Сперва необходимо создать презентер списка для его передачи
    // презентеру сортириовки.
    this.#listPresenter = new ListPresenter(commonConfig);
    this.#sortPresenter = new SortPresenter(commonConfig);

    this.#sortPresenter.init();
    this.#listPresenter.init();
  }

  #renderEmptyMessage(filter) {
    // Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    this.#sortPresenter.removeComponent();
    this.#tripEventsEmptyView = new TripEventsEmptyView(filter);
    render(this.#tripEventsEmptyView, this.#tripEventsView.element);
  }

  #handleFilterStatus = (filter, status) => {
    if (status !== FilterStatus.CHANGE) {
      return;
    }

    /** Список, с которым будет фильтрация. */
    const points = this.#tripModel.listPoints;
    const filterStauts = this.#filterModel.filter;
    const filteredPoints = FilterPresenter.filterList(filterStauts, points);

    // Очищаем презентер новой точки.
    this.#newEventBtnPresenter.destroy();

    // Очищаем элемент для нового рендера.
    this.renderEventsSection(filteredPoints, filter);
  };
}
