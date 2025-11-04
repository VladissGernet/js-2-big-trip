import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';

const TRIP_FILTERS = [
  { name: 'Everything', isChecked: true },
  { name: 'Future' },
  { name: 'Present' },
  { name: 'Past' },
];

const TRIP_SORTS = [
  { name: 'Day' },
  { name: 'Event', isDisabled: true },
  { name: 'Time' },
  { name: 'Price', isChecked: true },
  { name: 'Offers', isDisabled: true },
];

// Фильтры.
const tripControls = document.querySelector('.trip-controls');
const tripControlsFilters = tripControls.querySelector(
  '.trip-controls__filters'
);
// Сортировка.
const tripEvents = document.querySelector('.trip-events');

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilters,
  filters: TRIP_FILTERS,
});

const sortPresenter = new SortPresenter({
  sortContainer: tripEvents,
  sorts: TRIP_SORTS,
});

filterPresenter.init();
sortPresenter.init();
