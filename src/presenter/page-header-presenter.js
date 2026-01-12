import {
  PageHeaderView,
  TripMainView,
  TripControlsView,
  BtnView,
} from '../view/index.js';

import FilterPresenter from './filter-presenter.js';
import { TRIP_FILTERS } from '../const.js';
import { render } from '../framework/render.js';

/** Конфиг принимаемый презентором
 * @typedef {Object} PresenterConfig
 * @property {HTMLDivElement} container - Контейнер для рендера
 */

/** Презентер header страницы */
export default class PageHeaderPresenter {
  #container;
  #pageHeader = new PageHeaderView();
  #tripMain = new TripMainView();
  #tripControls = new TripControlsView();

  /** Публичный доступ получения кнопки добавления формы в список внутри main.
   * @type {HTMLButtonElement} Кнопка добавления новой строчки в списке.
   */
  eventAddBtn = new BtnView(
    'trip-main__event-add-btn btn btn--big btn--yellow'
  );

  /** Публичный доступ контролов фильтрации списка внутри main.
   *  @type {HTMLDivElement} Контейнер копок фильтров.
   */
  filterControls = null;

  /** @param {PresenterConfig} config */
  constructor({ container }) {
    this.#container = container;
  }

  init() {
    this.#renderHeader();
  }

  #renderHeader() {
    render(this.#pageHeader, this.#container);
    this.#renderTripMain();
  }

  #renderTripMain() {
    render(this.#tripMain, this.#pageHeader.container);
    this.#renderTripControls();
    this.#renderEventAddBtn();
  }

  #renderTripControls() {
    render(this.#tripControls, this.#tripMain.element);
    this.#renderFilters();
  }

  #renderFilters() {
    const filterPresenter = new FilterPresenter({
      container: this.#tripControls.filtersContainer,
      filters: TRIP_FILTERS,
    });
    filterPresenter.init();
    this.filterControls = filterPresenter.filterComponent.element;
  }

  #renderEventAddBtn() {
    render(this.eventAddBtn, this.#tripMain.element);
  }
}
