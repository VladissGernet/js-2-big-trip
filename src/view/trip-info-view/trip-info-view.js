import AbstractView from '../../framework/view/abstract-view.js';
import { html } from '../../utils/index.js';

function createTripInfoTemplate() {
  return html` <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam — Chamonix — Geneva</h1>

      <p class="trip-info__dates">18&nbsp;—&nbsp;20 Mar</p>
    </div>

    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>`;
}

export default class TripInfoView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createTripInfoTemplate();
  }
}
