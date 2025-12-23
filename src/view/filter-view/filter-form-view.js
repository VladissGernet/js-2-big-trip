import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';
import createFilterItemTemplate from './filter-item.js';

function createFilterFormTemplate(filters) {
  /**
   * Создает разметку компонентов фильтра
   * @type {Array.<string>} filters Массив фильтров
   */
  const formItems = filters.map((element) => createFilterItemTemplate(element));

  return html`
    <form class="trip-filters" action="#" method="get">
      ${formItems.join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterFormView extends AbstractView {
  /** @type {Array.<Object>} Массив фильтров */
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterFormTemplate(this.#filters);
  }
}
