export function xml(input: TemplateStringsArray, ...values: any[]) {
  const combined = input.reduce((acc, cur, i) => {
    return acc + cur + (values[i] || '');
  }, '');

  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    combined
      // remove all newlines
      .replace(/\n/g, '')
      // clear whitespace between tags
      .replace(/>\s+</g, '><')
      .trim()
  );
}
