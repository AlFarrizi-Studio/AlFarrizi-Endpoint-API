const TARGET = "http://38.83.138.59:25893";

async function safeFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Upstream error ${res.status}`);
  return res;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    try {
      // GET /
      if (url.pathname === "/") {
        return Response.json({
          name: "Monitor API",
          endpoints: [
            "GET /ping",
            "GET /v4/stats",
            "GET /v4/info",
            "GET /version",
            "GET /all",
            "GET /health"
          ],
          websocket: "/v4/websocket"
        });
      }

      // GET /ping
      if (url.pathname === "/ping") {
        const start = Date.now();
        await safeFetch(`${TARGET}/ping`);
        const latency = Date.now() - start;

        return Response.json({
          status: "online",
          latency
        });
      }

      // GET /v4/stats
      if (url.pathname === "/v4/stats") {
        const res = await safeFetch(`${TARGET}/v4/stats`);
        return Response.json(await res.json());
      }

      // GET /v4/info
      if (url.pathname === "/v4/info") {
        const res = await safeFetch(`${TARGET}/v4/info`);
        return Response.json(await res.json());
      }

      // GET /version
      if (url.pathname === "/version") {
        const res = await safeFetch(`${TARGET}/version`);
        return Response.json(await res.json());
      }

      // GET /health
      if (url.pathname === "/health") {
        const res = await safeFetch(`${TARGET}/health`);
        return Response.json(await res.json());
      }

      // GET /all
      if (url.pathname === "/all") {
        const start = Date.now();

        const [stats, info, version, health] = await Promise.all([
          safeFetch(`${TARGET}/v4/stats`).then(r => r.json()),
          safeFetch(`${TARGET}/v4/info`).then(r => r.json()),
          safeFetch(`${TARGET}/version`).then(r => r.json()),
          safeFetch(`${TARGET}/health`).then(r => r.json())
        ]);

        return Response.json({
          status: "online",
          latency: Date.now() - start,
          stats,
          info,
          version,
          health
        });
      }

      // ❌ Not found
      return new Response("Not Found", { status: 404 });

    } catch (err) {
      return new Response(
        JSON.stringify({
          status: "offline",
          error: err.message
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" }
        }
      );
    }
  }
};
