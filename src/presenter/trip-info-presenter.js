import { TripInfoView } from '../view/index.js';
import { TRIP_INFO_TITLE } from '../const.js';
import dayjs from 'dayjs';

export default class TripInfoPresenter {
  #tripModel;

  constructor(tripModel) {
    this.#tripModel = tripModel;
  }

  init() {
    const tripInfoData = TripInfoPresenter.#createTripInfoData(this.#tripModel);
    return new TripInfoView(tripInfoData);
  }

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

    // Общаяя цена.
    tripInfoData.totalPrice = tripModel.listPoints.reduce(
      (acc, { basePrice }) => acc + basePrice,
      0,
    );

    // Формирование загаловка
    tripInfoData.title = tripModel.findDestinationByIndex(0)?.name;
    if (listLength > MAX_VISIBLE_POINTS) {
      // Если точек больше 3-х.
      tripInfoData.title += ` — ${PLACEHOLDER} — ${tripModel.findDestinationByIndex(listLength - 1).name}`;
      return tripInfoData;
    } else if (listLength === MAX_VISIBLE_POINTS) {
      // Если 3 точки
      tripInfoData.title += ` — ${tripModel.findDestinationByIndex(1).name} — ${tripModel.findDestinationByIndex(2).name}`;
      return tripInfoData;
    } else if (listLength === TWO_POINTS) {
      // Если 2 точки
      tripInfoData.title += ` — ${tripModel.findDestinationByIndex(1).name}`;
      return tripInfoData;
    }

    return tripInfoData;
  }
}
