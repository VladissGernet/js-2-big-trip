import dayjs from 'dayjs';

// Константы

const FILTER_UPDATE_STATUS = 'update';
const DEFAULT_MINUTES_ADDITION = 1;
const DEFAULT_SORT = 'date';
const DEFAULT_SORT_VALUE = 'sort-day';
const DEFAULT_BASE_PRICE = 0;
const DEFAULT_TYPE_OFFER = 'flight';

// Server
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic dXNlckBwYXNzd29yZA==';

// Формирование Trip Info.
const FIRST_DESTINATION = 0;
const SECOND_DESTINATION = 1;
const THIRD_DESTINATION = 2;

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

const InputDateStage = {
  MINDATE: 'minDate',
  MAXDATE: 'maxDate',
};

const PointsURLs = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

const Method = {
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const LoadStatus = {
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  LOADING: 'loading',
};

// Конфигурационные массивы с дефолтными данными для UI.

/** Состояние кнопок фильтров по умолчанию. */
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

/** Набор сообщений для рендера сообщения о пустом списке. */
const NO_EVENTS_MESSAGES = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
  [LoadStatus.LOADING]: 'Loading...',
  [LoadStatus.REJECTED]: 'Failed to load latest route information',
};

const SORT_CONFIG = {
  price: ({ basePrice: priceA }, { basePrice: priceB }) => priceB - priceA,
  date: (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)),
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

const TimeLimit = {
  LOWER_LIMIT: 10,
  UPPER_LIMIT: 1000,
};

const SORT_TYPES = {
  'sort-day': 'date',
  'sort-time': 'time',
  'sort-price': 'price',
};

const FlatpickrId = {
  'event-start-time': 'date-from',
  'event-end-time': 'date-to',
};

const DELETE_BUTTON_STATUS = {
  DELETE: 'Delete',
  DELETING: 'Deleting...',
};

const SAVE_BUTTON_STATUS = {
  SAVE: 'Save',
  SAVING: 'Saving...',
};

const TRIP_INFO_TITLE = {
  TWO_POINTS: 2,
  MAX_VISIBLE_POINTS: 3, // сколько точек показывать явно
  PLACEHOLDER: '...', // символ для "свернутой" части маршрута
};

export {
  TRIP_FILTERS,
  TRIP_SORTS,
  NO_EVENTS_MESSAGES,
  FilterType,
  SORT_CONFIG,
  SORT_TYPES,
  TRIP_INFO_TITLE,
  InputDateStage,
  DateStateStage,
  FilterStatus,
  DEFAULT_SORT,
  FIRST_DESTINATION,
  SECOND_DESTINATION,
  THIRD_DESTINATION,
  END_POINT,
  AUTHORIZATION,
  PointsURLs,
  LoadStatus,
  Method,
  DEFAULT_MINUTES_ADDITION,
  DELETE_BUTTON_STATUS,
  SAVE_BUTTON_STATUS,
  TimeLimit,
  FILTER_UPDATE_STATUS,
  FlatpickrId,
  DEFAULT_SORT_VALUE,
  DEFAULT_BASE_PRICE,
  DEFAULT_TYPE_OFFER,
};
