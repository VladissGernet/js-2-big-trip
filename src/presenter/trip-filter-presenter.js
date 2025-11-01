import TripFilterView from '../view/trip-filter-view/trip-filter-view.js';
import TripFilterItemView from '../view/trip-filter-view/trip-filter-item-view.js';
import { render } from '../utils/render.js';

export default class TripFilterPresenter {
  tripFilterComponet = new TripFilterView();
  tripFilterItempComponent = new TripFilterItemView();

  constructor({ tripFilterContainer, filters }) {
    this.container = tripFilterContainer;
    this.filters = filters;
  }

  init() {
    render(this.tripFilterComponet, this.container);
    render(this.tripFilterItempComponent, this.tripFilterComponet.getElement());
  }
}
