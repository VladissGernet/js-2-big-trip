const transformListPoint = ({ offers, ...rest }) => ({
  ...rest,
  offers: new Set(offers),
});

export { transformListPoint };
