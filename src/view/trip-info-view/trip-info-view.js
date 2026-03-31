import AbstractView from '../../framework/view/abstract-view.js';
import { html } from '../../utils/index.js';
import he from 'he';

function createTripInfoTemplate(tripInfoData) {
  return html` <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${he.encode(tripInfoData.title)}</h1>
      <p class="trip-info__dates">${tripInfoData.datesResult}</p>
    </div>

    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value"
        >${he.encode(String(tripInfoData.totalPrice))}</span
      >
    </p>
  </section>`;
}

export default class TripInfoView extends AbstractView {
  #tripInfoData = null;

  constructor(tripInfoData) {
    super();
    this.#tripInfoData = tripInfoData;
  }

  get template() {
    return createTripInfoTemplate(this.#tripInfoData);
  }
}
