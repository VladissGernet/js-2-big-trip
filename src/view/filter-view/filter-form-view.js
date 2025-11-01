import createFilterItemTemplate from './filter-item.js';
import { createElement } from '../../utils/create-element.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createFilteFormTemplate(filters) {
  const formItems = filters.map((element) => createFilterItemTemplate(element));

  return html`
    <form class="trip-filters" action="#" method="get">
      ${formItems.join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterFormView {
  constructor(filters) {
    this.filters = filters;
  }

  getTemplate() {
    return createFilteFormTemplate(this.filters);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
