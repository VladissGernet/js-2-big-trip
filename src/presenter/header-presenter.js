import { HeaderView, TripMainView, TripControlsView } from '../view/index.js';
import NewEventBtnPresenter from './new-event-btn-presenter.js';

import FilterPresenter from './filter-presenter.js';
import { TRIP_FILTERS } from '../const.js';
import { render } from '../framework/render.js';

/** Конфиг принимаемый презентором
 * @typedef {Object} PresenterConfig
 * @property {HTMLDivElement} container - Контейнер для рендера
 * @property {Model} model - Данные модели для рендера страницы
 */

/** Презентер header страницы */
export default class HeaderPresenter {
  #container;
  #model;
  #newEventBtnPresenter;
  #pageHeader = new HeaderView();
  #tripMain = new TripMainView();
  #tripControls = new TripControlsView();

  /** Публичный доступ контролов фильтрации списка внутри main.
   *  @type {HTMLDivElement} Контейнер копок фильтров.
   */
  filterControls = null;

  /** @param {PresenterConfig} config */
  constructor({ container, model }) {
    this.#container = container;
    this.#model = model;
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
    this.#renderNewEventBtn();
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

  #renderNewEventBtn() {
    this.#newEventBtnPresenter = new NewEventBtnPresenter({
      model: this.#model,
      filterControls: this.filterControls,
      containerElement: this.#tripMain.element,
    });
    this.#newEventBtnPresenter.init();
  }

  connectPageMainComponents(components) {
    this.#newEventBtnPresenter.connectPageMainComponents(components);
  }
}
