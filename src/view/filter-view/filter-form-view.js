import AbstractView from './../../framework/view/abstract-view.js';
import createFilterItemTemplate from './filter-item.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createFilterFormTemplate(filters) {
  const formItems = filters.map((element) => createFilterItemTemplate(element));

  return html`
    <form class="trip-filters" action="#" method="get">
      ${formItems.join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterFormView extends AbstractView {
  constructor(filters) {
    super();
    this.filters = filters;
  }

  get template() {
    return createFilterFormTemplate(this.filters);
  }
}
