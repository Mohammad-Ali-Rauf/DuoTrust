import { serve } from "bun";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const LEDGER_PATH = join(import.meta.dir, "ledger.json");

if (!existsSync(LEDGER_PATH)) {
  writeFileSync(LEDGER_PATH, "[]");
}

function saveToLedger(data: any) {
  const ledger = JSON.parse(readFileSync(LEDGER_PATH, "utf-8"));
  ledger.push(data);
  writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
}

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/submit") {
      const body = await req.json();
      saveToLedger(body);
      return new Response(JSON.stringify({ status: "success" }), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/ledger") {
      const data = readFileSync(LEDGER_PATH, "utf-8");
      return new Response(data, { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/") {
      return new Response(Bun.file("./public/index.html"));
    }

    return new Response("404 Not Found", { status: 404 });
  },
});