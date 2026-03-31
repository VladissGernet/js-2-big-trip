import { HeaderView, TripMainView, TripControlsView } from '../view/index.js';
import NewEventBtnPresenter from './new-event-btn-presenter.js';
import FilterPresenter from './filter-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import { TRIP_FILTERS } from '../const.js';
import { render } from '../framework/render.js';

/** Конфиг принимаемый презентором
 * @typedef {Object} PresenterConfig
 * @property {HTMLDivElement} container - Контейнер для рендера
 * @property {Model} tripModel - Данные модели для рендера страницы
 * @property {Class} filterModel - Модель фильтра с наблюдателем.
 */

/** Презентер header страницы */
export default class HeaderPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;

  #pageHeader = new HeaderView();
  #tripMain = new TripMainView();
  #tripControls = new TripControlsView();

  /** Публичный доступ к презентеру кнопки создания новой точки для связывания со списком */
  newEventBtnPresenter = null;

  /** Публичный доступ контролов фильтрации списка внутри main.
   *  @type {HTMLDivElement} Контейнер копок фильтров.
   */
  filterControls = null;

  /** @param {PresenterConfig} config */
  constructor({ container, tripModel, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#renderHeader();
  }

  connectPageMainComponents(components) {
    this.newEventBtnPresenter.connectPageMainComponents(components);
  }

  #renderHeader() {
    render(this.#pageHeader, this.#container);
    this.#renderTripMain();
  }

  #renderTripMain() {
    render(this.#tripMain, this.#pageHeader.container);
    this.#renderTripInfo();
    this.#renderTripControls();
    this.#renderNewEventBtn();
  }

  #renderTripInfo() {
    if (this.#tripModel.listPoints.length) {
      const tripInfoPresenter = new TripInfoPresenter(this.#tripModel);
      render(tripInfoPresenter.init(), this.#tripMain.element);
    }
  }

  #renderTripControls() {
    render(this.#tripControls, this.#tripMain.element);
    this.#renderFilters();
  }

  #renderFilters() {
    const filterPresenter = new FilterPresenter({
      container: this.#tripControls.filtersContainer,
      filters: TRIP_FILTERS,
      filterModel: this.#filterModel,
    });
    filterPresenter.init();
    this.filterControls = filterPresenter.filterComponent.element;
  }

  #renderNewEventBtn() {
    this.newEventBtnPresenter = new NewEventBtnPresenter({
      tripModel: this.#tripModel,
      filterControls: this.filterControls,
      containerElement: this.#tripMain.element,
    });
    this.newEventBtnPresenter.init();
  }
}
