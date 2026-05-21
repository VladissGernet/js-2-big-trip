const adaptDataToServer = (data) => {
  const serverData = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeCaseKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    serverData[snakeCaseKey] = value;
  }
  serverData.offers = Array.from(serverData.offers);
  return serverData;
};

export { adaptDataToServer };
