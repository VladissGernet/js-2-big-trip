import AbstractView from '../../framework/view/abstract-view.js';
import createSortItemTemplate from './sort-item.js';

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

export default class SortFormView extends AbstractView {
  constructor(sorts) {
    super();
    this.sorts = sorts;
  }

  get template() {
    return createSortFormTemplate(this.sorts);
  }
}
