const setValidity = (input) => {
  const wasInputReadonly = input.hasAttribute('readonly');

  if (wasInputReadonly) {
    input.removeAttribute('readonly');
    input.required = true;
  }
};

export { setValidity };
