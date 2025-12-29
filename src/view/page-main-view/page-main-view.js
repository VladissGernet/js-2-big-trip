import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

function createPageMainTemplate() {
  return html`
    <main class="page-body__page-main page-main">
      <div class="page-body__container"></div>
    </main>
  `;
}

export default class PageMainView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createPageMainTemplate();
  }

  get container() {
    return this.element.querySelector('.page-body__container');
  }
}
