import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

function createTripEventsTemplate() {
  return html`
    <section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>
  `;
}

export default class TripEventsView extends AbstractView {
  get template() {
    return createTripEventsTemplate();
  }

  get container() {
    return this.element.querySelector('.page-body__container');
  }
}
