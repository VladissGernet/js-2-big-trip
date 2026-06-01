const adaptDataToServer = (data) => {
  const serverData = Object.entries(data).reduce(
    (adaptedData, [key, value]) => {
      const snakeCaseKey = key
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase();
      adaptedData[snakeCaseKey] = value;
      return adaptedData;
    },
    {},
  );
  serverData.offers = Array.from(serverData.offers);

  return serverData;
};

export { adaptDataToServer };
