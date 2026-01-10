import { html } from '../../utils/index.js';
import AbstractView from './../../framework/view/abstract-view.js';

function tripControlsViewTemplate() {
  return html`
    <div class="trip-main__trip-controls trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
      </div>
    </div>
  `;
}

export default class TripControlsView extends AbstractView {
  get template() {
    return tripControlsViewTemplate();
  }

  get filtersContainer() {
    return this.element.querySelector('.trip-controls__filters');
  }
}
