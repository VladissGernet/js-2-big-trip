import { TripInfoView } from '../view/index.js';
import { TRIP_INFO_TITLE, LoadStatus } from '../const.js';
import dayjs from 'dayjs';
import {
  render,
  remove,
  replace,
  RenderPosition,
} from '../framework/render.js';
import { calcFinalPrice, findDestinationByIndex } from '../utils/index.js';
import {
  FIRST_DESTINATION,
  SECOND_DESTINATION,
  THIRD_DESTINATION,
} from '../const.js';

export default class TripInfoPresenter {
  #tripModel = null;
  #tripInfoView = null;
  #mainElement = null;

  /** @param {TripModel} tripModel Модель данных поездки */
  constructor(tripModel, mainElement) {
    this.#tripModel = tripModel;
    this.#mainElement = mainElement;

    this.#tripModel.addObserver(this.#handleListStatus);
  }

  init() {
    if (!this.#tripModel.listPoints?.length) {
      return;
    }
    const tripInfoData = TripInfoPresenter.#createTripInfoData(this.#tripModel);
    this.#tripInfoView = new TripInfoView(tripInfoData);
    render(this.#tripInfoView, this.#mainElement, RenderPosition.AFTERBEGIN);
  }

  /** Обновляет информацию о всем маршруте. */
  #handleListStatus = (status) => {
    // Убираю повторный рендер после загрузки данных,
    if (status === LoadStatus.RESOLVED) {
      return;
    }

    const isPoints = !!this.#tripModel.length;

    // Обновление существующего tripInfoView.
    if (this.#tripInfoView && isPoints) {
      const tripInfoData = TripInfoPresenter.#createTripInfoData(
        this.#tripModel,
      );
      const newTripInfoView = new TripInfoView(tripInfoData);
      replace(newTripInfoView, this.#tripInfoView);
      remove(this.#tripInfoView);
      this.#tripInfoView = newTripInfoView;
      return;
    }

    // Создания первой точки в пустом списке.
    remove(this.#tripInfoView);
    this.#tripInfoView = null;
    this.init();
  };

  static #createTripInfoData(tripModel) {
    const { MAX_VISIBLE_POINTS, PLACEHOLDER, TWO_POINTS } = TRIP_INFO_TITLE;

    const tripInfoData = {
      title: '',
      totalPrice: 0,
      datesResult: '',
    };
    const listLength = tripModel.listPoints.length;

    // Формирование даты.

    // First Point
    const firstPointDateFrom = dayjs(tripModel.listPoints[0].dateFrom);
    // Last Point
    const lastPointDateTo = dayjs(tripModel.listPoints[listLength - 1].dateTo);

    const isSameYear = firstPointDateFrom.year() === lastPointDateTo.year();
    const isSameMonth = firstPointDateFrom.month() === lastPointDateTo.month();
    const isSameMonthDay = firstPointDateFrom.date() === lastPointDateTo.date();

    if (isSameYear && isSameMonth && isSameMonthDay) {
      // Если маршрут умещается в один день.
      tripInfoData.datesResult = lastPointDateTo.format('D MMM');
    } else if (isSameYear && isSameMonth) {
      // Если маршрут умещается в один месяц.
      tripInfoData.datesResult = `${firstPointDateFrom.format('D')}&nbsp;—&nbsp;${lastPointDateTo.format('D MMM')}`;
    } else if (isSameYear) {
      // Если маршрут умещается в один год.
      tripInfoData.datesResult = `${firstPointDateFrom.format('D MMM')}&nbsp;—&nbsp;${lastPointDateTo.format('D MMM')}`;
    } else {
      // Иначе полная дата
      tripInfoData.datesResult = `${firstPointDateFrom.format('D MMM YYYY')}&nbsp;—&nbsp;${lastPointDateTo.format('D MMM YYYY')}`;
    }

    // Подсчет конечной цены на основе выбранных offers.
    tripInfoData.totalPrice = tripModel.listPoints.reduce(
      (acc, { basePrice, offers, type }) =>
        acc +
        calcFinalPrice(tripModel.offersByType.get(type), basePrice, offers),
      0,
    );

    const getDestination = (index) =>
      findDestinationByIndex(
        index,
        tripModel.listPoints,
        tripModel.destinationsById,
      ).name;

    // Формирование заголовка
    tripInfoData.title = getDestination(FIRST_DESTINATION);
    if (listLength > MAX_VISIBLE_POINTS) {
      // Если точек больше 3-х.
      tripInfoData.title += ` — ${PLACEHOLDER} — ${getDestination(listLength - 1)}`;
      return tripInfoData;
    } else if (listLength === MAX_VISIBLE_POINTS) {
      // Если 3 точки
      tripInfoData.title += ` — ${getDestination(SECOND_DESTINATION)} — ${getDestination(THIRD_DESTINATION)}`;
      return tripInfoData;
    } else if (listLength === TWO_POINTS) {
      // Если 2 точки
      tripInfoData.title += ` — ${getDestination(SECOND_DESTINATION)}`;
      return tripInfoData;
    }

    return tripInfoData;
  }
}
