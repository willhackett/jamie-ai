import { HTMLElement, parse } from 'node-html-parser';

export class EmailUtil {
  static getBody(body: string) {
    const html = parse(body);

    return html;
  }

  static getPlainTextFromBody(body: HTMLElement) {
    const text = body.innerText;

    return text;
  }

  static recipientListToArray(recipients: string): string[] {
    const list = recipients.split(',');
    const result = [];

    for (const item of list) {
      const match = item.match(/<(.+)>/);

      if (match) {
        result.push(match[1]);
      } else {
        result.push(item);
      }
    }

    return result;
  }
}
