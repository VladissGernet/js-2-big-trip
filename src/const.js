import dayjs from 'dayjs';

// Константы
const DEFAULT_SORT = 'date';
const DEFAULT_TYPE_OFFER = 'taxi';

// Перечисления (Enum)

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FilterStatus = {
  CHANGE: 'change',
  DEFAULT: 'default',
};

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const InputDateStage = {
  MINDATE: 'minDate',
  MAXDATE: 'maxDate',
};

// Конфигурационные массивы с дефолтными данными для UI.

/** Состояние кнопок филтров по умолчанию. */
const TRIP_FILTERS = [
  { name: 'Everything', isChecked: true },
  { name: 'Future', isChecked: false },
  { name: 'Present', isChecked: false },
  { name: 'Past', isChecked: false },
];

/** Состояние кнопок сортировки по умолчанию. */
const TRIP_SORTS = [
  { name: 'Day', isChecked: true, isDisabled: false },
  { name: 'Event', isChecked: false, isDisabled: true },
  { name: 'Time', isChecked: false, isDisabled: false },
  { name: 'Price', isChecked: false, isDisabled: false },
  { name: 'Offers', isChecked: false, isDisabled: true },
];

// Словари.

/** Набор сообщений в зависимости от значения фильтра. */
const NO_EVENTS_MESSAGES = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const SORT_CONFIG = {
  price: ({ basePrice: priceA }, { basePrice: priceB }) => priceB - priceA,
  date: (a, b) => dayjs(a.dateTo).diff(dayjs(b.dateTo)),
  time: (
    { dateFrom: dateFromA, dateTo: dateToA },
    { dateFrom: dateFromB, dateTo: dateToB },
  ) => {
    const timeA = dayjs(dateToA).diff(dayjs(dateFromA));
    const timeB = dayjs(dateToB).diff(dayjs(dateFromB));
    return timeB - timeA;
  },
};

const DateStateStage = {
  minDate: 'dateFrom',
  maxDate: 'dateTo',
};

const SORT_TYPES = {
  'sort-day': 'date',
  'sort-time': 'time',
  'sort-price': 'price',
};

const TRIP_INFO_TITLE = {
  TWO_POINTS: 2,
  MAX_VISIBLE_POINTS: 3, // сколько точек показывать явно
  PLACEHOLDER: '...', // символ для «свернутой» части маршрута
};

export {
  TRIP_FILTERS,
  TRIP_SORTS,
  NO_EVENTS_MESSAGES,
  FilterType,
  SORT_CONFIG,
  SORT_TYPES,
  TRIP_INFO_TITLE,
  Mode,
  InputDateStage,
  DateStateStage,
  FilterStatus,
  DEFAULT_SORT,
  DEFAULT_TYPE_OFFER,
};
