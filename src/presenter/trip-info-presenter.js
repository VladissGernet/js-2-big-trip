import { TripInfoView } from '../view/index.js';
import { TRIP_INFO_TITLE } from '../const.js';

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
    };
    const listLength = tripModel.listPoints.length;

    // TODO
    // "Дата начала всего путешествия соответствует дате начала первой точки маршрута.
    // Дата окончания — дате завершения последней точки маршрута.

    // Также предусмотреть разность в годах

    // Если даты в одном месяце одного года. Например, «18 — 20 AUG»."
    // Если даты в разных месяцах одного года. Например, «18 AUG — 6 OCT»."
    // Если даты в разных годах. Например, «18 AUG 2025 — 6 OCT 2026»."

    console.log(tripModel.findPointByIndex(0));

    // Общаяя цена.
    tripInfoData.totalPrice = tripModel.listPoints.reduce(
      (acc, { basePrice }) => acc + basePrice,
      0,
    );

    // Формирование загаловка
    tripInfoData.title = tripModel.findPointByIndex(0)?.name;
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
