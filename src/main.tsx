import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./routes/root/home/Home.tsx";
import { Create } from "./routes/root/create/Create.tsx";
import { Root } from "./routes/root/Root.tsx";
import { TierList } from "./routes/root/tierList/TierList.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tierlists/:id",
        element: <TierList />,
      },
      {
        path: "/create",
        element: <Create />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// const appRouter = createBrowserRouter(createRoutesFromElements(
//   <Route path='/' element={ <Root/> }>
//     <Route path='home' element={ <Home/> }/>
//   </Route>
// ));
