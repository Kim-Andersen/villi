/**
 * Tagged template function which enables SQL syntax highlighting.
 */
export function sql(strings:TemplateStringsArray, ... expressions: Array<any>): string {
  let result = '';
  strings.forEach((string, i) => {
    result += string + (expressions[i] || '');
  });
  return result;
};