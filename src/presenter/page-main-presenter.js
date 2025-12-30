import { render } from '../framework/render.js';
import { PageMainView, TripEventsView } from '../view/index.js';
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
  /**
   * @param {PresenterConfig}
   */
  constructor({ container: container, model: model }) {
    this.#container = container;
    this.#model = model;
  }

  #model;
  #container;

  /** Доступ к компоненту списка
   * @type {HTMLUlistElement} - элемент разметки
   */
  listView = null;

  init() {
    const main = new PageMainView();
    const tripEvents = new TripEventsView();

    render(main, this.#container);
    render(tripEvents, main.container);

    const sortPresenter = new SortPresenter({
      container: tripEvents.element,
      sorts: TRIP_SORTS,
    });
    const listPresenter = new ListPresenter({
      container: tripEvents.element,
      tripModel: this.#model,
    });

    sortPresenter.init();
    listPresenter.init();

    this.listView = listPresenter.listView;
  }
}
