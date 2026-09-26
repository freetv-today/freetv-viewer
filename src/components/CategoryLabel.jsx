// Used to capitalize first letter of category

export function capitalizeFirstLetter(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}