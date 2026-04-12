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
 * @property {Class} newEventBtnPresenter - Презентер кнопки создания нового события.
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 */

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  #tripModel = null;
  #filterModel = null;
  #container = null;
  #newEventBtnPresenter = null;
  #main = new PageMainView();
  #sortPresenter = null;
  #tripEventsEmpty = null;

  /** Публичный доступ к презентеру списка. */
  listPresenter = null;

  /** Секция с основынм списком событий.
   * @type {Class} - Экземпляр разметки section.
   * @description Публично для обновления статуса заполненности списка событий.
   */
  tripEvents = new TripEventsView();

  /** Публичный доступ к сообщению о пустоте списка
   * @type {HTMLParagraphElement} - Элемент текста разметки.
   */

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

  #renderMain() {
    render(this.#main, this.#container);
    this.#renderEventsSection();
  }

  #renderEventsSection() {
    render(this.tripEvents, this.#main.container);

    // Проверка на пустой список при первой отрисовке.
    if (this.#tripModel.listPoints.length !== 0) {
      this.#renderEvents();
    } else {
      this.#renderEmptyMessage();
    }
  }

  #renderEvents() {
    const commonConfig = {
      container: this.tripEvents.element,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      newEventBtnPresenter: this.#newEventBtnPresenter,
    };

    // Сперва необходимо создать презентер списка для его передачи
    // презентеру сортириовки.
    this.listPresenter = new ListPresenter(commonConfig);

    this.#sortPresenter = new SortPresenter({
      ...commonConfig,
      listPresenter: this.listPresenter,
    });

    this.#sortPresenter.init();
    this.listPresenter.init();
  }

  #renderEmptyMessage(filterStatus) {
    // Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    this.#tripEventsEmpty = new TripEventsEmptyView(filterStatus);
    render(this.#tripEventsEmpty, this.tripEvents.element);
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
      this.listPresenter.clearList();
      this.#sortPresenter.removeComponent();
    }

    // Очищаем элемент для нового рендера.
    this.tripEvents.element.innerHTML =
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
