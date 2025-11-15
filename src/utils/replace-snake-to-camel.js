function convertSnakeToCamel(snakeKey) {
  return snakeKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function replaceSnakeToCamel(data) {
  return data.map((element) =>
    Object.fromEntries(
      Object.entries(element).map(([key, value]) => [
        convertSnakeToCamel(key),
        value,
      ])
    )
  );
}

export { replaceSnakeToCamel };
