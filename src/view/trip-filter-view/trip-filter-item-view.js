import { createElement } from '../../utils/create-element.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createFilterItemTemplate() {
  return html`
    <div class="trip-filters__filter">
      <input
        id="filter-everything"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="everything"
      />
      <label class="trip-filters__filter-label" for="filter-everything"
        >Everything</label
      >
    </div>
  `;
}

export default class TripFilterItemView {
  constructor(itemContent) {
    this.itemContent = itemContent;
  }

  getTemplate() {
    return createFilterItemTemplate();
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
