import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";

import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiLayout,
  FiHome,
  FiInfo,
  FiMail,
} from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuRef = useRef(null);
  const location = useLocation();

  const {
    setshowsearch,
    getCartCount,
    navigate,
    token,
    settoken,
    setCartItems,
    user,
    setUser,
  } = useContext(ShopContext);

  // Admin dashboard URL
  const ADMIN_URL =
    import.meta.env.VITE_ADMIN_URL ||
    "https://baltimart-admins.vercel.app/login";

  // Check user role
  const isAdmin = ["admin", "vendor"].includes(user?.role);

  // Navigation links
  const navLinks = [
    { path: "/", label: "Home", icon: <FiHome /> },
    {
      path: "/collection",
      label: "Collection",
      icon: <FiShoppingBag />,
    },
    { path: "/about", label: "About", icon: <FiInfo /> },
    { path: "/contact", label: "Contact", icon: <FiMail /> },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus when changing pages
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    settoken("");
    setUser(null);
    setCartItems({});

    setMenuOpen(false);
    setMobileOpen(false);

    navigate("/login");
  };

  // Search products
  const openSearch = () => {
    setshowsearch(true);
    setMenuOpen(false);
    setMobileOpen(false);
    navigate("/collection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close all menus
  const closeMenus = () => {
    setMobileOpen(false);
    setMenuOpen(false);
  };

  // Reusable logo
  const Logo = ({ mobile = false }) => (
    <Link
      to="/"
      onClick={() => {
        closeMenus();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`flex items-center flex-shrink-0 ${
        mobile ? "h-[60px]" : "h-full"
      }`}
    >
      <img
        src={assets.logo}
        alt="BaltiMart Logo"
        className={`
          block object-contain object-left
          h-auto max-h-full
          transition-transform duration-300 hover:scale-[1.03]
          ${
            mobile
              ? "w-[130px] max-h-[48px]"
              : "w-[105px] sm:w-[125px] md:w-[140px] lg:w-[155px] max-h-[58px]"
          }
        `}
      />
    </Link>
  );

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}

      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[70px] sm:h-[76px] md:h-[82px]">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-9">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `relative py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-black" : "text-gray-500 hover:text-black"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}

                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                          isActive ? "w-full" : "w-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}

              {/* Dashboard */}
              {isAdmin && (
                <a
                  href={ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  <FiLayout size={16} />
                  Dashboard
                </a>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
              {/* Search */}
              <button
                onClick={openSearch}
                aria-label="Search products"
                className="text-gray-700 hover:text-black hover:scale-110 transition-all duration-300"
              >
                <FiSearch size={21} strokeWidth={1.8} />
              </button>

              {/* Profile */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    if (token) {
                      setMenuOpen((prev) => !prev);
                    } else {
                      navigate("/login");
                    }
                  }}
                  aria-label="User account"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-1 text-gray-700 hover:text-black transition-all duration-300"
                >
                  <FiUser size={21} strokeWidth={1.8} />

                  {token && (
                    <FiChevronDown
                      size={13}
                      className={`transition-transform duration-300 ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Profile Dropdown */}
                {token && (
                  <div
                    className={`absolute right-0 top-10 w-56 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden origin-top-right transition-all duration-200 ${
                      menuOpen
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible pointer-events-none"
                    }`}
                  >
                    {/* User Information */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.name || "My Account"}
                      </p>

                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {user?.role || "Customer"}
                      </p>
                    </div>

                    <div className="p-2">
                      {/* Profile */}
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-black rounded-lg transition-all"
                      >
                        <FiUser size={17} />
                        My Profile
                      </button>

                      {/* Orders */}
                      <button
                        onClick={() => navigate("/orders")}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-black rounded-lg transition-all"
                      >
                        <FiPackage size={17} />
                        My Orders
                      </button>

                      {/* Dashboard */}
                      {isAdmin && (
                        <a
                          href={ADMIN_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-black rounded-lg transition-all"
                        >
                          <FiLayout size={17} />
                          Dashboard
                        </a>
                      )}

                      <div className="border-t border-gray-100 my-2" />

                      {/* Logout */}
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FiLogOut size={17} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label="Shopping cart"
                className="relative text-gray-700 hover:text-black hover:scale-110 transition-all duration-300"
              >
                <FiShoppingBag size={22} strokeWidth={1.8} />

                <span className="absolute -top-2 -right-2 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-black text-white text-[10px] font-semibold">
                  {getCartCount()}
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                className="md:hidden text-gray-800 hover:text-black transition-colors"
              >
                <FiMenu size={25} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}

      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* ================= MOBILE SIDEBAR ================= */}

      <aside
        className={`fixed top-0 right-0 bottom-0 z-[70] flex flex-col w-[85%] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 min-h-[70px]">
          {/* Mobile Logo */}
          <Logo mobile />

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <FiX size={21} />
          </button>
        </div>

        {/* User Information */}
        {token && (
          <div className="px-5 py-5 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
                <FiUser size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Welcome Back"}
                </p>

                <p className="text-xs text-gray-500 capitalize mt-1">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[2px] text-gray-400">
            Navigation
          </p>

          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={closeMenus}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Dashboard */}
          {isAdmin && (
            <div className="mt-3">
              <a
                href={ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gray-100 text-gray-800 hover:bg-black hover:text-white text-sm font-medium transition-all duration-200"
              >
                <FiLayout size={19} />
                Dashboard
              </a>
            </div>
          )}

          {/* Account Links */}
          {token && (
            <div className="mt-6">
              <div className="border-t border-gray-100 mb-5" />

              <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[2px] text-gray-400">
                My Account
              </p>

              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
                >
                  <FiUser size={19} />
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={closeMenus}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
                >
                  <FiPackage size={19} />
                  My Orders
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all text-left"
                >
                  <FiLogOut size={19} />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Login */}
          {!token && (
            <Link
              to="/login"
              onClick={closeMenus}
              className="flex items-center justify-center gap-2 mt-5 py-3.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
            >
              <FiUser size={18} />
              Login / Register
            </Link>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="px-5 py-5 border-t border-gray-100 bg-gray-50">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} BaltiMart. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
