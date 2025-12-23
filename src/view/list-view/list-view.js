import { html } from '../../utils/index.js';
import AbstractView from '../../framework/view/abstract-view.js';

function createListViewTemplate() {
  return html`<ul class="trip-events__list"></ul>`;
}

export default class ListView extends AbstractView {
  get template() {
    return createListViewTemplate();
  }
}
