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
  /** @param {PresenterConfig} */
  constructor({ container: container, model: model }) {
    this.#container = container;
    this.#model = model;
  }

  #model;
  #container;

  /** Публичный доступ для управления списком
   * @type {HTMLUlistElement} - Элемент разметки
   */
  listView;

  /** Публичный доступ к элементу секции.
   * @type {HTMLElement} - Элемент разметки section.
   */
  tripEvents;

  /** Публичный доступ к сообщению о том, что список пустой
   * @type {HTMLParagraphElement} - Элемент текста разметки.
   */
  tripEventsEmpty = null;

  init(headerPresenter) {
    const main = new PageMainView();
    this.tripEvents = new TripEventsView();

    render(main, this.#container);
    render(this.tripEvents, main.container);

    if (this.#model.listPoints.length !== 0) {
      const sortPresenter = new SortPresenter({
        container: this.tripEvents.element,
        sorts: TRIP_SORTS,
      });
      const listPresenter = new ListPresenter({
        container: this.tripEvents.element,
        tripModel: this.#model,
      });

      sortPresenter.init();
      listPresenter.init();

      this.listView = listPresenter.listView;
    } else {
      // Если список пустой, то возвращает сообщение о предложении создания новой путевой точки.
      const checkedFilter = headerPresenter.querySelector(
        'input[name="trip-filter"]:checked'
      ).value;
      this.tripEventsEmpty = new TripEventsEmptyView(checkedFilter);
      render(this.tripEventsEmpty, this.tripEvents.element);
    }
  }
}
