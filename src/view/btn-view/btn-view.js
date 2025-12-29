import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

function btnTemplate(className) {
  return html`
    <button class="${className || 'btn'}" type="button">New event</button>
  `;
}

export default class BtnView extends AbstractView {
  constructor(className) {
    super();
    this.#className = className;
  }

  #className;

  get template() {
    return btnTemplate(this.#className);
  }
}
