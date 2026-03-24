import {
  HeaderView,
  TripMainView,
  TripControlsView,
  TripInfoView,
} from '../view/index.js';
import NewEventBtnPresenter from './new-event-btn-presenter.js';
import FilterPresenter from './filter-presenter.js';
import { TRIP_FILTERS, TRIP_INFO_TITLE } from '../const.js';
import { render } from '../framework/render.js';

/** Конфиг принимаемый презентором
 * @typedef {Object} PresenterConfig
 * @property {HTMLDivElement} container - Контейнер для рендера
 * @property {Model} tripModel - Данные модели для рендера страницы
 */

/** Презентер header страницы */
export default class HeaderPresenter {
  /** Публичный доступ к презентеру кнопки создания новой точки для связывания со списком */
  newEventBtnPresenter;

  #container;
  #tripModel;
  #filterModel;
  #pageHeader = new HeaderView();
  #tripInfo = null;
  #tripMain = new TripMainView();
  #tripControls = new TripControlsView();

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
    // TODO
    // Прокинуть данные из модели, которые должны обновляться
    // Добавить даты согласно ТЗ:

    // "Дата начала всего путешествия соответствует дате начала первой точки маршрута.
    // Дата окончания — дате завершения последней точки маршрута.
    // Например, «18 AUG — 6 OCT»."

    const tripInfoData = HeaderPresenter.#createTripInfoData(this.#tripModel);
    this.#tripInfo = new TripInfoView(tripInfoData);
    render(this.#tripInfo, this.#tripMain.element);
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

  static #createTripInfoData(tripModel) {
    const { MAX_VISIBLE_POINTS, PLACEHOLDER, TWO_POINTS } = TRIP_INFO_TITLE;

    const tripInfoData = {
      title: '',
      totalPrice: 0,
    };

    tripInfoData.totalPrice = tripModel.listPoints.reduce(
      (acc, { basePrice }) => acc + basePrice,
      0,
    );

    tripInfoData.title = tripModel.findPointByIndex(0)?.name;

    const listLength = tripModel.listPoints.length;

    if (listLength > MAX_VISIBLE_POINTS) {
      // Если точек больше 3-х.
      tripInfoData.title += ` — ${PLACEHOLDER} — ${tripModel.findPointByIndex(listLength - 1).name}`;
      return tripInfoData;
    } else if (listLength === MAX_VISIBLE_POINTS) {
      // Если 3 точки
      tripInfoData.title += ` — ${tripModel.findPointByIndex(1).name} — ${tripModel.findPointByIndex(2).name}`;
      return tripInfoData;
    } else if (listLength === TWO_POINTS) {
      // Если 2 точки
      tripInfoData.title += ` — ${tripModel.findPointByIndex(1).name}`;
      return tripInfoData;
    }

    return tripInfoData;
  }
}
