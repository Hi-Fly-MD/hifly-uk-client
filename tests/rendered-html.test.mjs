import assert from "node:assert/strict";
import test from "node:test";

// Exercise the same server bundle used by Sites hosting, not source strings.
async function render() {
  const { default: worker } = await import("../dist/server/index.js");
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("serves the HiFLY demo with usable navigation and search before hydration", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  const html = await response.text();
  assert.match(html, /<title>HiFLY — Your next great escape<\/title>/);
  assert.match(html, /aria-label="HiFLY home"/);
  assert.match(html, /src="\/hifly-logo.png"/);
  assert.match(html, /aria-label="Destination"/);
  assert.match(html, /aria-label="Departure date"/);
  assert.match(html, /aria-label="Mobile navigation"/);
  assert.match(html, /INTERACTIVE DEMO/);
  assert.match(html, /Santorini, beyond the postcard/);
  assert.doesNotMatch(
    html,
    /codex-preview|Your site is taking shape|Building your site/,
  );
});
