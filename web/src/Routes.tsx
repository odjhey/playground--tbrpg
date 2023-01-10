import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import { Nav } from "./components/Nav";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Nav />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/about", element: <AboutPage /> },
        ],
      },
    ],
  },
]);
