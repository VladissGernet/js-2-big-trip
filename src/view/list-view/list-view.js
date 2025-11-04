import { createElement } from '../../utils/create-element.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createListViewTemplate() {
  return html`<ul class="trip-events__list"></ul>`;
}

export default class ListView {
  getTemplate() {
    return createListViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
