const TARGET = "http://38.83.138.59:25893";

async function safeFetch(env, path) {
  const res = await fetch(`${TARGET}${path}`, {
    headers: {
      "Authorization": env.LAVALINK_PASSWORD,
      "User-Agent": "monitor-api"
    }
  });

  if (!res.ok) {
    throw new Error(`Upstream error ${res.status}`);
  }

  return res;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      // GET /
      if (url.pathname === "/") {
        return Response.json({
          name: "NodeLink / Lavalink Monitor API",
          endpoints: [
            "GET /ping",
            "GET /v4/stats",
            "GET /v4/info",
            "GET /version",
            "GET /health",
            "GET /all"
          ],
          websocket: "/v4/websocket"
        });
      }

      // GET /ping
      if (url.pathname === "/ping") {
        const start = Date.now();
        await safeFetch(env, "/ping");

        return Response.json({
          status: "online",
          latency: Date.now() - start
        });
      }

      // GET /v4/stats
      if (url.pathname === "/v4/stats") {
        return Response.json(
          await (await safeFetch(env, "/v4/stats")).json()
        );
      }

      // GET /v4/info
      if (url.pathname === "/v4/info") {
        return Response.json(
          await (await safeFetch(env, "/v4/info")).json()
        );
      }

      // GET /version
      if (url.pathname === "/version") {
        return Response.json(
          await (await safeFetch(env, "/version")).json()
        );
      }

      // GET /health
      if (url.pathname === "/health") {
        return Response.json(
          await (await safeFetch(env, "/health")).json()
        );
      }

      // GET /all
      if (url.pathname === "/all") {
        const start = Date.now();

        const [stats, info, version, health] = await Promise.all([
          safeFetch(env, "/v4/stats").then(r => r.json()),
          safeFetch(env, "/v4/info").then(r => r.json()),
          safeFetch(env, "/version").then(r => r.json()),
          safeFetch(env, "/health").then(r => r.json())
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

      return new Response("Not Found", { status: 404 });

    } catch (err) {
      return Response.json(
        { status: "offline", error: err.message },
        { status: 500 }
      );
    }
  }
};
