import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Login from "./components/Login";

import Add from "./pages/Add";
import Order from "./pages/Order";
import List from "./pages/List";
import Supplier from "./pages/Supplier";
import SupplierList from "./pages/SupplierList";
import EditProduct from "./pages/EditProduct";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";
import AddVendor from "./pages/AddVendor";
import VendorList from "./pages/VendorList";

import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "Rs. ";

const App = () => {
  const [token, settoken] = useState(() => localStorage.getItem("token") || "");

  const [role, setRole] = useState(() => localStorage.getItem("role") || "");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setRole("");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    settoken("");
    setRole("");
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-800">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="light"
        pauseOnHover
      />

      {!token ? (
        <Login settoken={settoken} setRole={setRole} />
      ) : (
        <>
          <Navbar
            settoken={handleLogout}
            role={role}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <div className="flex min-h-[calc(100vh-72px)]">
            <SideBar
              role={role}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <main className="min-w-0 flex-1 px-3 py-5 sm:px-5 md:px-7 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-[1600px]">
                <Routes>
                  <Route path="/" element={<Navigate to="/add" replace />} />
                  <Route
                    path="/login"
                    element={<Navigate to="/add" replace />}
                  />

                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Order token={token} />} />

                  <Route path="/users" element={<UserList token={token} />} />
                  <Route
                    path="/users/:id"
                    element={<UserDetails token={token} />}
                  />

                  <Route
                    path="/supplier"
                    element={<Supplier token={token} />}
                  />
                  <Route
                    path="/suppliers"
                    element={<SupplierList token={token} />}
                  />

                  <Route
                    path="/product/edit/:id"
                    element={<EditProduct token={token} />}
                  />

                  <Route
                    path="/addVendor"
                    element={<AddVendor token={token} />}
                  />
                  <Route
                    path="/vendorList"
                    element={<VendorList token={token} />}
                  />

                  <Route path="*" element={<Navigate to="/add" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
