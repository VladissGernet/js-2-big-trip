import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

export default class BtnView extends AbstractView {
  #handleClick = null;

  constructor(onClick = null) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return html`
      <button
        class="trip-main__event-add-btn btn btn--big btn--yellow"
        type="button"
      >
        New event
      </button>
    `;
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
