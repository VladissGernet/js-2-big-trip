import AbstractView from './../../framework/view/abstract-view.js';

function createTripMainTemplate() {
  return '<div class="trip-main"></div>';
}

export default class TripMain extends AbstractView {
  get template() {
    return createTripMainTemplate();
  }
}
