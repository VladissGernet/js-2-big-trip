/** Состояние кнопок филтров по умолчанию */
const TRIP_FILTERS = [
  { name: 'Everything', isChecked: true },
  { name: 'Future', isChecked: false },
  { name: 'Present', isChecked: false },
  { name: 'Past', isChecked: false },
];

/** Набор сообщений в зависимости от значения фильтра */
const NO_EVENTS_MESSAGES = {
  everything: 'Click New Event to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future: 'There are no future events now',
};

/** Состояние кнопок сортировки по умолчанию */
const TRIP_SORTS = [
  { name: 'Day', isChecked: false, isDisabled: false },
  { name: 'Event', isChecked: false, isDisabled: true },
  { name: 'Time', isChecked: false, isDisabled: false },
  { name: 'Price', isChecked: true, isDisabled: false },
  { name: 'Offers', isChecked: false, isDisabled: true },
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { TRIP_FILTERS, TRIP_SORTS, NO_EVENTS_MESSAGES, FilterType, UpdateType };
