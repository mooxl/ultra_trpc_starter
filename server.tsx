import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { type Context, createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

// Twind
import { createHeadInsertionTransformStream } from "ultra/stream.ts";
import { stringify, tw } from "./src/twind/twind.ts";

// React Router
import { StaticRouter } from "react-router-dom/server";

// TRPC
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./src/trpc/router.ts";
import { TRPCServerProvider } from "./src/trpc/server.tsx";
const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

function ServerApp({ context }: { context: Context }) {
  const requestUrl = new URL(context.req.url);
  return (
    <TRPCServerProvider>
      <StaticRouter location={new URL(context.req.url).pathname}>
        <App />
      </StaticRouter>
    </TRPCServerProvider>
  );
}

server.all("/api/trpc/:path", (context) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: context.req as Request,
    router: appRouter,
    createContext: () => ({}),
  });
});

server.get("*", async (context) => {
  let result = await server.render(<ServerApp context={context} />);
  const stylesInject = createHeadInsertionTransformStream(() => {
    if (Array.isArray(tw.target)) {
      return Promise.resolve(stringify(tw.target));
    }
    throw new Error("Expected tw.target to be an instance of an Array");
  });
  result = result.pipeThrough(stylesInject);
  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});
if (import.meta.main) {
  serve(server.fetch);
}
export default server;
