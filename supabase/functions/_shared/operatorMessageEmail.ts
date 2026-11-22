/**
 * Plain-text email rendering for operator messages.
 *
 * Account Messages is the source of truth; email is only a courier. This module
 * therefore accepts already-validated plain text and never produces HTML or an
 * open-tracking surface. Announcement mail carries both a visible unsubscribe
 * link and RFC 8058 headers. Service mail deliberately carries neither because
 * it is transactional and is not governed by marketing preferences.
 */

export type OperatorMessageClass = "service" | "announcement";

export interface OperatorMessageEmailInput {
  messageClass: OperatorMessageClass;
  subject: string;
  body: string;
  accountUrl: string;
  unsubscribeUrl?: string | null;
}
export interface RenderedOperatorMessageEmail {
  subject: string;
  text: string;
  headers?: Record<string, string>;
}

function cleanRequired(value: string, label: string): string {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${label} is required`);
  return text;
}

export function renderOperatorMessageEmail(
  input: OperatorMessageEmailInput,
): RenderedOperatorMessageEmail {
  const subject = cleanRequired(input.subject, "subject");
  const body = cleanRequired(input.body, "body");
  const accountUrl = cleanRequired(input.accountUrl, "account URL");

  if (input.messageClass === "service") {
    return {
      subject,
      text: [
        "SettlementForge",
        "Service message",
        "",
        subject,
        "",
        body,
        "",
        "This notice is also available in Account > Messages:",
        accountUrl,
        "",
        "Reply through Feedback & support from your account if you need help.",
        "",
        "— SettlementForge",
      ].join("\n"),
    };
  }

  const unsubscribeUrl = cleanRequired(
    input.unsubscribeUrl || "",
    "announcement unsubscribe URL",
  );
  return {
    subject,
    text: [
      "SettlementForge",
      "Announcement",
      "",
      subject,
      "",
      body,
      "",
      "This announcement is also available in Account > Messages:",
      accountUrl,
      "",
      "Manage email preferences from your account, or unsubscribe from product updates:",
      unsubscribeUrl,
      "",
      "— SettlementForge",
    ].join("\n"),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
