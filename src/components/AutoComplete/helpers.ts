export function clearBoldTag(text: string) {
  text = text.replace('<b>', '').replace('</b>', '');
  return text;
}
export function searchedBolder(text: string, result: string) {
  const textReg: RegExp = new RegExp(text, 'gi');
  return result.replace(textReg, match => `<b>${match}</b>`);
}
