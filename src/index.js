const TARGET = "http://212.132.120.102:12115";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    try {
      // GET /ping
      if (url.pathname === "/ping") {
        const start = Date.now();
        await fetch(`${TARGET}/ping`);
        const latency = Date.now() - start;

        return new Response(
          JSON.stringify({ status: "online", latency }),
          { headers: { "content-type": "application/json" } }
        );
      }

      // GET /v4/stats
      if (url.pathname === "/v4/stats") {
        const res = await fetch(`${TARGET}/v4/stats`);
        const data = await res.json();

        return Response.json(data);
      }

      // GET /health
      if (url.pathname === "/health") {
        const res = await fetch(`${TARGET}/health`);
        const data = await res.json();

        return Response.json(data);
      }

      // default
      return new Response("Not Found", { status: 404 });

    } catch (err) {
      return new Response(
        JSON.stringify({ status: "offline", error: err.message }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
  }
};
