import AbstractView from '../../framework/view/abstract-view.js';

// Используем String.raw как тег для шаблонных строк,
// чтобы Prettier и редактор форматировали HTML внутри template literals корректно
const html = String.raw;

function createListViewTemplate() {
  return html`<ul class="trip-events__list"></ul>`;
}

export default class ListView extends AbstractView {
  get template() {
    return createListViewTemplate();
  }
}
