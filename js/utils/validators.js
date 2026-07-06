export const isRequired = (value) => value.trim().length > 0;

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isSameValue = (firstValue, secondValue) =>
  firstValue === secondValue;
