import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import "./index.scss";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store"
import { CookiesProvider } from 'react-cookie';

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
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
}

