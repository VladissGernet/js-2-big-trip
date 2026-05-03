import { TripInfoView } from '../view/index.js';
import { TRIP_INFO_TITLE } from '../const.js';
import dayjs from 'dayjs';
import { remove, replace } from '../framework/render.js';
import { calcFinalPrice, findDestinationByIndex } from '../utils/index.js';

export default class TripInfoPresenter {
  #tripModel;
  #tripInfoView = null;

  /** @param {TripModel} tripModel Модель данных поездки */
  constructor(tripModel) {
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#handleListStatus);
  }

  init() {
    const tripInfoData = TripInfoPresenter.#createTripInfoData(this.#tripModel);
    this.#tripInfoView = new TripInfoView(tripInfoData);
    return this.#tripInfoView;
  }

  /** Обновляет информацию о всем маршруте. */
  #handleListStatus = () => {
    if (!this.#tripModel.listPoints.length) {
      remove(this.#tripInfoView);
      return;
    }

    const tripInfoData = TripInfoPresenter.#createTripInfoData(this.#tripModel);
    const newTripInfoView = new TripInfoView(tripInfoData);
    replace(newTripInfoView, this.#tripInfoView);
    remove(this.#tripInfoView);
    this.#tripInfoView = newTripInfoView;
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
      // Если маршут умещается в один день.
      tripInfoData.datesResult = lastPointDateTo.format('D MMM');
    } else if (isSameYear && isSameMonth) {
      // Если маршурт умещается в один месяц.
      tripInfoData.datesResult = `${firstPointDateFrom.format('D')}&nbsp;—&nbsp;${lastPointDateTo.format('D MMM')}`;
    } else if (isSameYear) {
      // Если маршурт умещается в один год.
      tripInfoData.datesResult = `${firstPointDateFrom.format('D MMM')}&nbsp;—&nbsp;${lastPointDateTo.format('D MMM')}`;
    } else {
      // Иначе полная дата
      tripInfoData.datesResult = `${firstPointDateFrom.format('D MMM YYYY')}&nbsp;—&nbsp;${lastPointDateTo.format('D MMM YYYY')}`;
    }

    // Подсчет конечной цены на основе выбранных офферов.
    tripInfoData.totalPrice = tripModel.listPoints.reduce(
      (acc, { basePrice, offers, type }) =>
        acc +
        calcFinalPrice(tripModel.offersByType.get(type), basePrice, offers),
      0,
    );

    const getDestination = (index) => {
      const name = findDestinationByIndex(index)?.name;
      return name ? name : '';
    };

    // Формирование загаловка
    tripInfoData.title = getDestination(0);
    if (listLength > MAX_VISIBLE_POINTS) {
      // Если точек больше 3-х.
      tripInfoData.title += ` — ${PLACEHOLDER} — ${getDestination(listLength - 1)}`;
      return tripInfoData;
    } else if (listLength === MAX_VISIBLE_POINTS) {
      // Если 3 точки
      tripInfoData.title += ` — ${getDestination(1)} — ${getDestination(2)}`;
      return tripInfoData;
    } else if (listLength === TWO_POINTS) {
      // Если 2 точки
      tripInfoData.title += ` — ${getDestination(1)}`;
      return tripInfoData;
    }

    return tripInfoData;
  }
}
