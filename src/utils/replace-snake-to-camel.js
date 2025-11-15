function snakeToCamel(snakeKey) {
  return snakeKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function replaceSnakeToCamel(data) {
  if (Array.isArray(data)) {
    return data.map((element) => replaceSnakeToCamel(element));
  } else if (data !== null && data.constructor === Object) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [snakeToCamel(key), value])
    );
  }
  return data;
}

export { replaceSnakeToCamel };
