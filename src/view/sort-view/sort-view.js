import { html } from '../../utils/index.js';
import AbstractView from '../../framework/view/abstract-view.js';
import createSortItemTemplate from './sort-item.js';

function createSortTemplate(sorts) {
  const formItems = sorts.map(createSortItemTemplate);

  return html`
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${formItems.join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #sorts;

  constructor(sorts) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }
}
