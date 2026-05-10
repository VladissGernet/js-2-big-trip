import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

export default class TripEventsView extends AbstractView {
  get template() {
    return html`
      <section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>
      </section>
    `;
  }

  get container() {
    return this.element.querySelector('.page-body__container');
  }
}
