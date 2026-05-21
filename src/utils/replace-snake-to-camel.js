const convertSnakeToCamel = (snakeKey) =>
  snakeKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const replaceSnakeToCamel = (data) =>
  data.map((element) =>
    Object.fromEntries(
      Object.entries(element).map(([key, value]) => [
        convertSnakeToCamel(key),
        value,
      ]),
    ),
  );

export { replaceSnakeToCamel };
