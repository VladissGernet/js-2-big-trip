import createSortItemTemplate from './sort-item.js';
import { createElement } from '../../utils/create-element.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createSortFormTemplate(sorts) {
  const formItems = sorts.map((element) => createSortItemTemplate(element));

  return html`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${formItems.join('')}
    </form>
  `;
}

export default class SortFormView {
  constructor(sorts) {
    this.sorts = sorts;
  }

  getTemplate() {
    return createSortFormTemplate(this.sorts);
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
