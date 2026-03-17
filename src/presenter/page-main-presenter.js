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
 * @property {Model} tripModel - Данные модели для рендера страницы
 */

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  #tripModel;
  #filterModel;

  #container;
  #newEventBtnPresenter;
  #main = new PageMainView();

  /** Публичный доступ к презентеру списка. */
  listPresenter;

  /** Секция с основынм списком событий.
   * @type {HTMLElement} - Элемент разметки section.
   * @description Публично для обновления статуса заполненности списка событий.
   */
  tripEvents = new TripEventsView();

  /** Публичный доступ к сообщению о пустоте списка
   * @type {HTMLParagraphElement} - Элемент текста разметки.
   */
  tripEventsEmpty = null;

  /** @param {PresenterConfig} */
  constructor({ container, tripModel, newEventBtnPresenter, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#newEventBtnPresenter = newEventBtnPresenter;
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

    // Проверка на пустой список при первой отрисовке.
    if (this.#tripModel.listPoints.length !== 0) {
      this.#renderEvents();
    } else {
      this.#renderEmptyMessage(headerFilterControls);
    }
  }

  #renderEvents() {
    // Сперва необходимо создать презентер списка для
    // его передачи презентеру сортириовки.
    this.listPresenter = new ListPresenter({
      container: this.tripEvents.element,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      newEventBtnPresenter: this.#newEventBtnPresenter,
    });

    const sortPresenter = new SortPresenter({
      container: this.tripEvents.element,
      sorts: TRIP_SORTS,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      listPresenter: this.listPresenter,
    });

    sortPresenter.init();
    this.listPresenter.init();
  }

  #renderEmptyMessage(headerFilterControls) {
    // Если список пустой, то возвращает сообщение о предложении создания
    // новой путевой точки.
    const checkedFilter = headerFilterControls.querySelector(
      'input[name="trip-filter"]:checked',
    ).value;
    this.tripEventsEmpty = new TripEventsEmptyView(checkedFilter);
    render(this.tripEventsEmpty, this.tripEvents.element);
  }
}
