import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import NotFound from "../pages/notFound/NotFound";
import RouteRoot from "../pages/route-root/RouteRoot";
import Search from "../pages/search/Search";
import Watch from "../pages/watch/Watch";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteRoot />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "watch/:id",
        element: <Watch />,
      },
    ],
  },
]);
