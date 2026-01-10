import {
  PageHeaderView,
  TripMainView,
  TripControlsView,
  BtnView,
} from '../view/index.js';

import FilterPresenter from './filter-presenter.js';
import { TRIP_FILTERS } from '../const.js';
import { render } from '../framework/render.js';

// TODO остановился на рефакторинге тут

/** Конфиг принимаемый презентором
 * @typedef {Object} PresenterConfig
 * @property {HTMLDivElement} container - Контейнер для рендера
 */

/** Презентер header страницы */
export default class PageHeaderPresenter {
  #container;

  /** @type {HTMLButtonElement} Кнопка добавления новой строчки в списке. */
  eventAddBtn;

  /** @type {HTMLDivElement} Контейнер копок фильтров. */
  filterControls;

  /** @param {PresenterConfig} config */
  constructor({ container }) {
    this.#container = container;
  }

  init() {
    const pageHeader = new PageHeaderView();
    const tripMain = new TripMainView();
    const tripControls = new TripControlsView();

    this.eventAddBtn = new BtnView(
      'trip-main__event-add-btn btn btn--big btn--yellow'
    );

    render(pageHeader, this.#container);
    render(tripMain, pageHeader.container);

    // Рендер списка контролов фильтрации
    render(tripControls, tripMain.element);
    const filterPresenter = new FilterPresenter({
      container: tripControls.filtersContainer,
      filters: TRIP_FILTERS,
    });

    filterPresenter.init();
    this.filterControls = filterPresenter.filterComponent.element;

    render(this.eventAddBtn, tripMain.element);
  }
}
