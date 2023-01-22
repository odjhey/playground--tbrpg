import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import EventPage from "./pages/EventPage/EventPage";
import ParticipantsPage from "./pages/ParticipantsPage/ParticipantsPage";
import LongPollPage from "./pages/LongPollPage/LongPollPage";
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
          { path: "/event-form", element: <EventPage /> },
          { path: "/parts-form", element: <ParticipantsPage /> },
          { path: "/long-poll", element: <LongPollPage /> },
        ],
      },
    ],
  },
]);
