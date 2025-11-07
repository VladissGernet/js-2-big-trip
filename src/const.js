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

export { TRIP_FILTERS, TRIP_SORTS };
