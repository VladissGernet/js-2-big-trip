import { html } from '../../utils/index.js';
import AbstractView from '../../framework/view/abstract-view.js';
import createSortItemTemplate from './sort-item.js';

/** Создание шаблона формы сортировки */
function createSortTemplate(sorts) {
  const formItems = sorts.map((element) => createSortItemTemplate(element));

  return html`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${formItems.join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  constructor(sorts) {
    super();
    this.#sorts = sorts;
  }

  #sorts = null;

  get template() {
    return createSortTemplate(this.#sorts);
  }
}
