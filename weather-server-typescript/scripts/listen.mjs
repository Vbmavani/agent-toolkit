// Stay connected and print a line whenever a resource changes.
// Usage: node scripts/listen.mjs [STATE | RESOURCE_URI] [URL]
//   node scripts/listen.mjs FL
//   node scripts/listen.mjs weather://rotate/FL-CA-NY
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";

const target = process.argv[2] ?? "FL";
const url = process.argv[3] ?? "http://127.0.0.1:3333/mcp";
const uri = target.includes("://")
  ? target
  : `weather://alerts/${target.toUpperCase()}`;

const client = new Client(
  { name: "weather-listener", version: "1.0.0" },
  { versionNegotiation: { mode: "auto" } },
);

// Rotating resources return { state, alerts }; state resources return the array
const describe = async () => {
  const { contents } = await client.readResource({ uri });
  const data = JSON.parse(contents[0].text);
  return Array.isArray(data)
    ? `${data.length} active alerts`
    : `now ${data.state}, ${data.alertCount} active alerts`;
};

client.setNotificationHandler("notifications/resources/updated", async (n) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${n.params.uri} changed: ${await describe()}`);
});

await client.connect(new StreamableHTTPClientTransport(new URL(url)));
const subscription = await client.listen({ resourceSubscriptions: [uri] });

console.log("Protocol:", client.getNegotiatedProtocolVersion?.() ?? "unknown");
console.log("Listening to:", subscription.honoredFilter.resourceSubscriptions);
console.log(`${uri}: ${await describe()}. Waiting for changes, Ctrl+C to stop.`);

process.once("SIGINT", async () => {
  await subscription.close();
  await client.close();
  process.exit(0);
});
