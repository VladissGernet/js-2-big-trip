const removeValidity = (input) => {
  input.setAttribute('readonly', '');
  input.required = false;
};

export { removeValidity };
