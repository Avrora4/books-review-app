import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { store } from "./store"

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </Provider>
    </StrictMode>
  );
} else {
  console.error("Root element not found.");
};