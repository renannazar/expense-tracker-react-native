export function numberWithCommas(x: string) {
  const removeNonNumeric = x.replace(/[^0-9]/g, '');
  const addCommas = removeNonNumeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return addCommas;
}
