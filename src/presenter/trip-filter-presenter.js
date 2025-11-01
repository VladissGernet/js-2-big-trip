import TripFilterFormView from '../view/trip-filter-view/trip-filter-form-view.js';
import TripFilterItemView from '../view/trip-filter-view/trip-filter-item-view.js';
import { render, RenderPosition } from '../utils/render.js';

export default class TripFilterPresenter {
  tripFilterFormComponet = new TripFilterFormView();

  constructor({ tripFilterContainer, filters }) {
    this.container = tripFilterContainer;
    this.filters = filters;
  }

  init() {
    render(this.tripFilterFormComponet, this.container);
    for (let i = this.filters.length - 1; i >= 0; i--) {
      // Из-за RenderPosition.AFTERBEGIN необходимо начинать с конца.
      const element = this.filters[i];
      render(
        new TripFilterItemView(element),
        this.tripFilterFormComponet.getElement(),
        RenderPosition.AFTERBEGIN
      );
    }
  }
}
