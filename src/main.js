import TripFilterPresenter from './presenter/trip-filter-presenter.js';

const TRIP_FILTERS = ['All', 'Past', 'Present', 'Future'];

const tripControls = document.querySelector('.trip-controls');
const tripControlsFilters = tripControls.querySelector(
  '.trip-controls__filters'
);

const tripFilterPresenter = new TripFilterPresenter({
  tripFilterContainer: tripControlsFilters,
  filters: TRIP_FILTERS,
});

tripFilterPresenter.init();
