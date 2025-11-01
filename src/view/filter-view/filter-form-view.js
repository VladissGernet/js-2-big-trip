import { createElement } from '../../utils/create-element.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createFilteFormTemplate() {
  return html`
    <form class="trip-filters" action="#" method="get">
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterFormView {
  getTemplate() {
    return createFilteFormTemplate();
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
