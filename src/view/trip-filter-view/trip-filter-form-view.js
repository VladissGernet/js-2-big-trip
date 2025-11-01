import { createElement } from '../../utils/create-element.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createTripFilteFormTemplate() {
  return html`
    <form class="trip-filters" action="#" method="get">
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class TripFilterFormView {
  getTemplate() {
    return createTripFilteFormTemplate();
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
