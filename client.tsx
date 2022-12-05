import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";
import { TRPCClientProvider } from "./src/trpc/client.tsx";
// React Router
import { BrowserRouter } from "react-router-dom";

function ClientApp() {
  return (
    <TRPCClientProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TRPCClientProvider>
  );
}

hydrate(document, <ClientApp />);
