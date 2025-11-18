const validateDate = (date) => {
  const validatedDateFrom = new Date(date);
  if (isNaN(validatedDateFrom)) {
    return '';
  }
  return validatedDateFrom.toISOString();
};

export { validateDate };
