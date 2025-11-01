import FilterPresenter from './presenter/trip-filter-presenter.js';

const TRIP_FILTERS = ['Everything', 'Future', 'Present', 'Past'];

const tripControls = document.querySelector('.trip-controls');
const tripControlsFilters = tripControls.querySelector(
  '.trip-controls__filters'
);

const tripFilterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilters,
  filters: TRIP_FILTERS,
});

tripFilterPresenter.init();
