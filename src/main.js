import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
import TripModel from './model/trip-model.js';

import { TRIP_FILTERS, TRIP_SORTS } from './const.js';

const tripControls = document.querySelector('.trip-controls');
const tripControlsFilters = tripControls?.querySelector(
  '.trip-controls__filters'
);
const tripEvents = document.querySelector('.trip-events');

// Инициализация презентеров.
const filterPresenter = new FilterPresenter({
  container: tripControlsFilters,
  filters: TRIP_FILTERS,
});
const sortPresenter = new SortPresenter({
  container: tripEvents,
  sorts: TRIP_SORTS,
});
const listPresenter = new ListPresenter({
  container: tripEvents,
  tripModel: new TripModel(),
});

filterPresenter.init();
sortPresenter.init();
listPresenter.init();
