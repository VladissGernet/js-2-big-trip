import { html } from '../../utils/index.js';
import AbstractView from '../../framework/view/abstract-view.js';
import createFilterItemTemplate from './filter-item.js';

function createFilterTemplate(filters) {
  const formItems = filters.map(createFilterItemTemplate);

  return html`
    <form class="trip-filters" action="#" method="get">
      ${formItems.join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  #filters;
  #handleFilterChange = null;

  constructor(filters, onFilterChange) {
    super();
    this.#filters = filters;
    this.#handleFilterChange = onFilterChange;

    // Добавляет обработчик на форму.
    this.element.addEventListener('change', this.#handleFilterChange);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
