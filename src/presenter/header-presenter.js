import { HeaderView, TripMainView, TripControlsView } from '../view/index.js';
import NewPointPresenter from './new-point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import { LoadStatus } from '../const.js';
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

  #filterPresenter = null;

  /** Публичный доступ к презентеру кнопки создания новой точки для связывания со списком. */
  newPointPresenter = null;

  /** @param {PresenterConfig} config */
  constructor({ container, tripModel, filterModel }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#tripModel.addObserver(this.#loadStatusHandler);
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

  #renderTripControls() {
    render(this.#tripControls, this.#tripMain.element);
    this.#renderFilters();
  }

  #renderFilters() {
    this.#filterPresenter = new FilterPresenter({
      container: this.#tripControls.filtersContainer,
      filterModel: this.#filterModel,
    });
    this.#filterPresenter.init();
    // Отключаем на время первой загрузки.
    this.#filterPresenter.disable();
  }

  #renderNewEventBtn() {
    this.newPointPresenter = new NewPointPresenter({
      tripModel: this.#tripModel,
      filterModel: this.#filterModel,
      containerElement: this.#tripMain.element,
      filterPresenter: this.#filterPresenter,
    });
    this.newPointPresenter.init();
    // Отключаем на время первой загрузки.
    this.newPointPresenter.disable();
  }

  #loadStatusHandler = (status) => {
    if (status === LoadStatus.RESOLVED) {
      // После успешной загрузки данных с сервера.
      const tripInfoPresenter = new TripInfoPresenter(
        this.#tripModel,
        this.#tripMain.element,
      );
      tripInfoPresenter.init();
      this.newPointPresenter.enable();
    }
    this.#tripModel.removeObserver(this.#loadStatusHandler);
  };
}
