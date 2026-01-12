import { render } from '../framework/render.js';
import {
  PageMainView,
  TripEventsEmptyView,
  TripEventsView,
} from '../view/index.js';
import SortPresenter from '../presenter/sort-presenter.js';
import ListPresenter from '../presenter/list-presenter.js';

import { TRIP_SORTS } from '../const.js';

/** Конфигурация презентера списка.
 * @typedef {Object} PresenterConfig
 * @property {HTMLElement} container - Контейнер для рендера
 * @property {Model} model - Данные модели для рендера страницы
 */

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  #model;
  #container;
  #main = new PageMainView();

  /** Секция с основынм списком событий.
   * @type {HTMLElement} - Элемент разметки section.
   * @description Публично для обновления статуса заполненности списка событий.
   */
  tripEvents = new TripEventsView();

  /** Публичный доступ для управления списком
   * @type {HTMLUlistElement} - Элемент разметки
   */
  listView = null;

  /** Публичный доступ к сообщению о пустоте списка
   * @type {HTMLParagraphElement} - Элемент текста разметки.
   */
  tripEventsEmpty = null;

  /** @param {PresenterConfig} */
  constructor({ container: container, model: model }) {
    this.#container = container;
    this.#model = model;
  }

  init(headerFilterControls) {
    this.#renderMain(headerFilterControls);
  }

  #renderMain(headerFilterControls) {
    render(this.#main, this.#container);
    this.#renderEventsSection(headerFilterControls);
  }

  #renderEventsSection(headerFilterControls) {
    render(this.tripEvents, this.#main.container);

    if (this.#model.listPoints.length !== 0) {
      this.#renderEvents();
    } else {
      this.#renderEmptyMessage(headerFilterControls);
    }
  }

  #renderEvents() {
    const sortPresenter = new SortPresenter({
      container: this.tripEvents.element,
      sorts: TRIP_SORTS,
    });
    // TODO Погружаюсь далее в SortPresenter
    const listPresenter = new ListPresenter({
      container: this.tripEvents.element,
      tripModel: this.#model,
    });

    sortPresenter.init();
    listPresenter.init();

    this.listView = listPresenter.listView;
  }

  #renderEmptyMessage(headerFilterControls) {
    // Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    const checkedFilter = headerFilterControls.querySelector(
      'input[name="trip-filter"]:checked'
    ).value;
    this.tripEventsEmpty = new TripEventsEmptyView(checkedFilter);
    render(this.tripEventsEmpty, this.tripEvents.element);
  }
}
