import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

export default class TripEventsEmptyView extends AbstractView {
  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return html`<p class="trip-events__msg">${this.#message}</p>`;
  }
}
