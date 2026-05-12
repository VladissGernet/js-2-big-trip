import { HeaderView, TripMainView, TripControlsView } from '../view/index.js';
import NewPointPresenter from './new-point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import { TRIP_FILTERS } from '../const.js';
import { render, RenderPosition } from '../framework/render.js';

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

  #filterPresenter = null;

  /** Публичный доступ к презентеру кнопки создания новой точки для связывания со списком. */
  newPointPresenter = null;

  /** @param {PresenterConfig} config */
  constructor({ container, tripModel, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#tripModel.addObserver(this.#handleLoadStatus);
  }

  init() {
    this.#renderHeader();
  }

  /** Связывает main страницы с header.*/
  connectPageMainPresenter(presenter) {
    this.newPointPresenter.connectPageMainPresenter(presenter);
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

  /** Активирует рендер информации о маршруте. */
  #renderTripInfo() {
    // TODO, остановился здесь. Таким же способом реализовать блокировку контролов, кнопки и отрисовки сообщения emptyMessage
    if (this.#tripModel.listPoints?.length) {
      const tripInfoPresenter = new TripInfoPresenter(this.#tripModel);
      render(
        tripInfoPresenter.init(),
        this.#tripMain.element,
        RenderPosition.AFTERBEGIN,
      );
    }
  }

  #renderTripControls() {
    render(this.#tripControls, this.#tripMain.element);
    this.#renderFilters();
  }

  #renderFilters() {
    this.#filterPresenter = new FilterPresenter({
      container: this.#tripControls.filtersContainer,
      filters: TRIP_FILTERS,
      filterModel: this.#filterModel,
    });
    this.#filterPresenter.init();
  }

  #renderNewEventBtn() {
    this.newPointPresenter = new NewPointPresenter({
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      containerElement: this.#tripMain.element,
      filterPresenter: this.#filterPresenter,
    });
    this.newPointPresenter.init();
  }

  #handleLoadStatus = () => {
    this.#renderTripInfo();
    // После загрузки удалить из наблюдателя.
    this.#tripModel.removeObserver(this.#handleLoadStatus);
  };
}
