// End-to-end test: a fake NWS changes its alerts and a listening client hears it.
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";

const NWS_PORT = 3390;
const MCP_PORT = 3391;
const uri = "weather://alerts/FL";

const features = [];
const nws = createServer((_req, res) => {
  res.setHeader("Content-Type", "application/geo+json");
  res.end(JSON.stringify({ features }));
});
await new Promise((resolve) => nws.listen(NWS_PORT, "127.0.0.1", resolve));

const server = spawn(
  process.execPath,
  [join(dirname(fileURLToPath(import.meta.url)), "../build/index.js"), "--http"],
  {
    stdio: ["ignore", "ignore", "inherit"],
    env: {
      ...process.env,
      NWS_API_BASE: `http://127.0.0.1:${NWS_PORT}`,
      PORT: String(MCP_PORT),
      POLL_SECONDS: "1",
      WATCH_STATES: "FL",
    },
  },
);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = async (check, what) => {
  for (let i = 0; i < 100; i++) {
    if (check()) return;
    await wait(100);
  }
  throw new Error(`Timed out waiting for ${what}`);
};

let exitCode = 1;
const client = new Client(
  { name: "listen-test", version: "1.0.0" },
  { versionNegotiation: { mode: "auto" } },
);

try {
  await wait(1000);
  const updates = [];
  client.setNotificationHandler("notifications/resources/updated", (n) => {
    updates.push(n.params.uri);
  });

  await client.connect(
    new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${MCP_PORT}/mcp`)),
  );
  const subscription = await client.listen({ resourceSubscriptions: [uri] });
  if (!subscription.honoredFilter.resourceSubscriptions?.includes(uri)) {
    throw new Error("Server did not honor the subscription");
  }

  await wait(2500);
  if (updates.length !== 0) throw new Error("Got an update with no change");
  console.log("PASS no update while alerts are unchanged");

  features.push({ properties: { event: "Test Flood Warning", severity: "Severe" } });
  await until(() => updates.length === 1, "first update");
  const { contents } = await client.readResource({ uri });
  const event = JSON.parse(contents[0].text)[0]?.event;
  if (event !== "Test Flood Warning") throw new Error(`Read back ${event}`);
  console.log("PASS update pushed when an alert appeared, new data read back");

  features.length = 0;
  await until(() => updates.length === 2, "second update");
  console.log("PASS same stream stayed open and pushed a second update");

  await subscription.close();
  exitCode = 0;
} catch (error) {
  console.error("FAIL", error);
} finally {
  await client.close().catch(() => {});
  server.kill();
  nws.close();
  nws.closeAllConnections();
}
process.exit(exitCode);
