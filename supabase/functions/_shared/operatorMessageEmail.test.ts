import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderOperatorMessageEmail } from "./operatorMessageEmail.ts";

Deno.test("service operator mail is plain text and has no marketing headers", () => {
  const rendered = renderOperatorMessageEmail({
    messageClass: "service",
    subject: "Account notice",
    body: "Line one\n<img src=x onerror=alert(1)>",
    accountUrl: "https://settlementforge.com/?view=account&section=messages",
  });
  assertEquals(rendered.subject, "Account notice");
  assertEquals(rendered.text.includes("<img src=x onerror=alert(1)>"), true);
  assertEquals(rendered.text.includes("Account > Messages"), true);
  assertEquals(rendered.headers, undefined);
});
Deno.test("announcement mail carries visible and RFC 8058 unsubscribe routes", () => {
  const url = "https://project.supabase.co/functions/v1/unsubscribe?token=x&category=product_updates";
  const rendered = renderOperatorMessageEmail({
    messageClass: "announcement",
    subject: "New cartography tools",
    body: "A short product note.",
    accountUrl: "https://settlementforge.com/?view=account&section=messages",
    unsubscribeUrl: url,
  });
  assertEquals(rendered.text.includes(url), true);
  assertEquals(rendered.headers?.["List-Unsubscribe"], `<${url}>`);
  assertEquals(rendered.headers?.["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click");
});

Deno.test("announcement rendering fails closed without an unsubscribe URL", () => {
  assertThrows(() => renderOperatorMessageEmail({
    messageClass: "announcement",
    subject: "News",
    body: "Body",
    accountUrl: "https://settlementforge.com/account",
  }), Error, "announcement unsubscribe URL is required");
});
