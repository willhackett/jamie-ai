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

  static getBodyWithoutQuotedReply(body: HTMLElement) {
    const selectors = [
      'div.gmail_extra', // Gmail
      'div.OutlookMessageHeader', // Outlook
      'div.OutlookMessageBody', // Outlook
      'div.yahoo_quoted', // Yahoo
    ];

    for (const selector of selectors) {
      const reply = body.querySelector(selector);
      if (reply) {
        reply.remove();
        break;
      }
    }

    // Apple Mail uses 'blockquote' for quoted replies
    const blockquotes = body.querySelectorAll('blockquote');
    if (blockquotes.length > 0) {
      const parentBlockquotes = blockquotes.filter(
        (blockquote) => blockquote.parentNode === body
      );
      if (parentBlockquotes.length > 0) {
        parentBlockquotes[parentBlockquotes.length - 1].remove();
      }
    }

    return body;
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
