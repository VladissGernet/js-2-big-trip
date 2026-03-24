import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';
import { NO_EVENTS_MESSAGES } from '../../const.js';
import he from 'he';

function createTripEventsEmptyTemplate(value) {
  return html`<p class="trip-events__msg">
    ${value ? NO_EVENTS_MESSAGES[value] : NO_EVENTS_MESSAGES['everything']}
  </p>`;
}

export default class TripEventsEmptyView extends AbstractView {
  #value;

  constructor(value) {
    super();
    this.#value = he.encode(value);
  }

  get template() {
    return createTripEventsEmptyTemplate(this.#value);
  }
}
