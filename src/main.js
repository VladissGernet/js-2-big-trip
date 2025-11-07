import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import ListPresenter from './presenter/list-presenter.js';

import { TRIP_FILTERS, TRIP_SORTS } from './const.js';

// Фильтры.
const tripControls = document.querySelector('.trip-controls');
const tripControlsFilters = tripControls.querySelector(
  '.trip-controls__filters'
);
// Сортировка и список.
const tripEvents = document.querySelector('.trip-events');

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilters,
  filters: TRIP_FILTERS,
});

const sortPresenter = new SortPresenter({
  sortContainer: tripEvents,
  sorts: TRIP_SORTS,
});

const listPresenter = new ListPresenter({ container: tripEvents });

filterPresenter.init();
sortPresenter.init();
listPresenter.init();
