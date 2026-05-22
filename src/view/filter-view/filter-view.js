import { html } from '../../utils/index.js';
import AbstractView from '../../framework/view/abstract-view.js';
import createFilterItemTemplate from './filter-item.js';
import { TRIP_FILTERS } from '../../const.js';

function createFilterTemplate() {
  const formItems = TRIP_FILTERS.map(createFilterItemTemplate);
  return html`
    <form class="trip-filters" action="#" method="get">
      ${formItems.join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  #handleFilterChange = null;

  constructor(onFilterChange) {
    super();
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#handleFilterChange);
  }

  get template() {
    return createFilterTemplate();
  }

  get controls() {
    return this.element.querySelectorAll('input[type="radio"]');
  }

  removeElement() {
    super.removeElement();
    this.element.removeEventListener('change', this.#handleFilterChange);
  }
}
