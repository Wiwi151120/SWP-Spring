import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./Page/Authenticator/404/PageNotFound";
import Login from "./Page/Authenticator/Login/Login";
import TableUser from "./Page/Authenticator/Admin2/TableUser";
import Home from "./Page/Authenticator/Home/Home";
import Logout from "./Page/Authenticator/Logout/Logout";


export const routers = createBrowserRouter([ 
  { 
    path: "*", 
    element: <PageNotFound />, 
  }, 
  { 
    path: "/login", 
    element: <Login />, 
  },

  { 
    path: "/", 
    element: <Home />, 
  },  

  { 
    path: "/Table", 
    element: <TableUser />, 
  },
 
  { 
    path: "/logout", 
    element: <Logout />, 
  },
  {
    path: "/admin/tableUser",
    element: <TableUser />,
  },
 
]); 
