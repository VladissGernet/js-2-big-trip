import { html } from '../../utils/index.js';
import AbstractView from '../../framework/view/abstract-view.js';
import createSortItemTemplate from './sort-item.js';

function createSortTemplate(sorts) {
  const formItems = sorts.map(createSortItemTemplate);

  return html`
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${formItems.join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #sorts;

  #handleChange = null;

  constructor({ sorts, onChange }) {
    super();
    this.#sorts = sorts;
    this.#handleChange = onChange;

    if (this.#handleChange !== null) {
      this.element.addEventListener('change', this.#handleChange);
    }
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }

  removeElement() {
    super.removeElement();

    this.element.removeEventListener('change', this.#handleChange);
  }
}
