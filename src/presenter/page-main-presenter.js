import { render } from '../framework/render.js';
import { PageMainView, TripEventsView } from '../view/index.js';
import SortPresenter from '../presenter/sort-presenter.js';
import ListPresenter from '../presenter/list-presenter.js';
import TripModel from '../model/trip-model.js';

import { TRIP_SORTS } from '../const.js';

/** Презентер основного содержимого страницы */
export default class PageMainPresenter {
  /**
   * @param {HTMLElement} container Место вставки компонента
   */
  constructor(container) {
    this.#container = container;
  }

  #container = null;

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
      tripModel: new TripModel(),
    });

    sortPresenter.init();
    listPresenter.init();
  }
}
