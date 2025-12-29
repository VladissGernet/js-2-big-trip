import PageHeaderView from '../view/page-header-view/page-header-view.js';
import TripMainView from '../view/trip-main-view/trip-main-view.js';
import TripControlsView from '../view/trip-controls-view/trip-controls-view.js';
import FilterPresenter from './filter-presenter.js';
import BtnView from '../view/btn-view/btn-view.js';
import { TRIP_FILTERS } from '../const.js';
import { render } from '../framework/render.js';

/** Конфиг принимаемый презентором
 * @typedef {Object} PresenterConfig
 * @property {HTMLDivElement} container - Контейнер для рендера
 */

/** Презентер header страницы */
export default class PageHeaderPresenter {
  /** @param {PresenterConfig} config */
  constructor({ container }) {
    this.#container = container;
  }

  #container = null;

  init() {
    const pageHeader = new PageHeaderView({
      containerClassName: 'page-body__container page-header__container',
    });
    const tripMain = new TripMainView();
    const tripControls = new TripControlsView();
    const eventAddBtn = new BtnView(
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

    render(eventAddBtn, tripMain.element);
    eventAddBtn.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      console.log('click');
    });
  }
}
