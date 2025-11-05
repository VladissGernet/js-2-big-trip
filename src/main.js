import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import ListPresenter from './presenter/list-presenter.js';

const TRIP_FILTERS = [
  { name: 'Everything', isChecked: true },
  { name: 'Future', isChecked: false },
  { name: 'Present', isChecked: false },
  { name: 'Past', isChecked: false },
];

const TRIP_SORTS = [
  { name: 'Day', isChecked: false, isDisabled: false },
  { name: 'Event', isChecked: false, isDisabled: true },
  { name: 'Time', isChecked: false, isDisabled: false },
  { name: 'Price', isChecked: true, isDisabled: false },
  { name: 'Offers', isChecked: false, isDisabled: true },
];

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
