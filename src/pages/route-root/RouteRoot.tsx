import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

const RouteRoot = () => {
  const location = useLocation();

  return (
    <div className="max-h-screen overflow-hidden">
      <div
        style={{
          height: "6vh",
        }}
      >
        <Navbar />
      </div>
      <div className="flex" style={{ height: "94.5vh" }}>
        {location.pathname.includes("watch") ? "" : <Sidebar />}
        <Outlet />
      </div>
    </div>
  );
};

export default RouteRoot;
