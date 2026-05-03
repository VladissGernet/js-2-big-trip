/** Обратно переводит имя назначения в id. */
const transformDestinationNameToId = (destinationName) => {
  const item = this.destinationsReadOnly.find(
    ({ name }) => name === destinationName,
  );
  return item.id;
};

export { transformDestinationNameToId };
