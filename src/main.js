import { render } from './render.js';
import TripFilterView from './view/filter-view.js';

const tripControls = document.querySelector('.trip-controls');
const tripControlsFilters = tripControls.querySelector(
  '.trip-controls__filters'
);

render(new TripFilterView(), tripControlsFilters);
