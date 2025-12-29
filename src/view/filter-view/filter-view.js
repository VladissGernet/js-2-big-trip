import { html } from '../../utils/index.js';
import AbstractView from '../../framework/view/abstract-view.js';
import createFilterItemTemplate from './filter-item.js';

function createFilterTemplate(filters) {
  /** Создает разметку компонентов фильтра.
   * @type {string[]} formItems - Массив HTML-разметок элементов фильтра
   */
  const formItems = filters.map((element) => createFilterItemTemplate(element));

  return html`
    <form class="trip-filters" action="#" method="get">
      ${formItems.join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  constructor(filters) {
    super();
    this.#filters = filters;
  }

  #filters = null;

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
