import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import useAsset from "ultra/hooks/use-asset.js";
import { tw } from "./twind/twind.ts";
import { trpc } from "./trpc/trpc.ts";
import useServerContext from "ultra/hooks/use-server-context.js";
import Layout from "./layout.tsx";

const HomePage = lazy(() => import("./pages/Home.tsx"));
const AboutPage = lazy(() => import("./pages/About.tsx"));

const RouteNotFound = () => {
  useServerContext((context) => {
    context.status(404);
  });
  return <div>Not found</div>;
};

export default function App() {
  let res;
  res = trpc.userById.useQuery("hallo");
  return res?.isLoading ? (
    <div></div>
  ) : (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        <Suspense fallback={<div>Page is Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<RouteNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </body>
    </html>
  );
}
