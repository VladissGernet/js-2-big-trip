import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

function createBtnTemplate(className) {
  return html`
    <button class="${className || 'btn'}" type="button">New event</button>
  `;
}

export default class BtnView extends AbstractView {
  #className = null;
  #handleClick = null;

  constructor({ className, onClick }) {
    super();
    this.#className = className;
    this.#handleClick = onClick;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createBtnTemplate(this.#className);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
