import { render } from '../framework/render.js';
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

  #renderMain() {
    render(this.#mainView, this.#container);
    this.#renderEventsSection();
  }

  #renderEventsSection() {
    this.#tripEventsView = new TripEventsView();
    render(this.#tripEventsView, this.#mainView.container);

    // Проверка на пустой список при первой отрисовке.
    if (this.#tripModel.listPoints.length) {
      this.#renderEvents();
    } else {
      this.#renderEmptyMessage();
    }
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

  #renderEmptyMessage(filterStatus) {
    // Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    this.#tripEventsEmptyView = new TripEventsEmptyView(filterStatus);
    render(this.#tripEventsEmptyView, this.tripEvents.element);
  }

  #handleFilterStatus = (_, status) => {
    const filterStauts = this.#filterModel.filter;

    /** Список, с которым будет фильтрация. */
    const points = this.#tripModel.listPoints;

    const filteredPoints = FilterPresenter.filterList(filterStauts, points);

    // Очищаем презентер новой точки.
    this.#newEventBtnPresenter.destroy();

    // Если точки существуют.
    if (points.length) {
      this.#listPresenter.destroy();
      this.#sortPresenter.removeComponent();
    }

    // Очищаем элемент для нового рендера.
    this.#tripEventsView.element.innerHTML =
      '<h2 class="visually-hidden">Trip events</h2>';

    // Если есть отфильтрованные точки.
    if (filteredPoints.length) {
      this.#sortPresenter.init();
      this.listPresenter.init(filteredPoints);
      return;
    }

    // Если filteredPoints будет пустой, то выводим сообщение о пустом списке.
    if (status === FilterStatus.CHANGE) {
      // Нужно реднерить только при смене статуса, чтобы небыло 2 сообщения.
      this.#renderEmptyMessage(this.#filterModel.filter);
    }
  };
}
