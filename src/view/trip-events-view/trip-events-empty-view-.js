import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';
import { NO_EVENTS_MESSAGES } from '../../const.js';

function createTripEventsEmptyTemplate(value) {
  return html`<p class="trip-events__msg">
    ${value ? NO_EVENTS_MESSAGES[value] : NO_EVENTS_MESSAGES['everything']}
  </p>`;
}

export default class TripEventsEmptyView extends AbstractView {
  #value = null;

  constructor(value) {
    super();
    this.#value = value;

    // TODO, генерирует где-то два сообщения при пустом списке
    // 1. нажатие кнопки создания New Event (зачем-то тут создание)
    // 2. переключение фильтра
    // далее уже отрисовка 2-го лишнего сообщения.
  }

  get template() {
    return createTripEventsEmptyTemplate(this.#value);
  }
}
