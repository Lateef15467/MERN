import React from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiLogOut, FiShield, FiUser } from "react-icons/fi";
import { assets } from "../../../frontend/src/assets/frontend_assets/assets";
const Navbar = ({ settoken, role, onMenuClick }) => {
  const isAdmin = role?.toLowerCase() === "admin";

  return (
    <header className="sticky top-0 z-40 h-[72px] w-full border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <FiMenu size={21} />
          </button>

          <Link to="/add" className="flex items-center">
            <img
              src={assets.logo}
              alt="Logo"
              className="h-9 w-auto max-w-[145px] object-contain sm:h-10"
            />
          </Link>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight text-gray-800">
              Management Portal
            </p>
            <p className="text-[11px] text-gray-400">
              Manage your store efficiently
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Role */}
          <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              {isAdmin ? <FiShield size={15} /> : <FiUser size={15} />}
            </span>

            <div>
              <p className="text-xs font-semibold capitalize text-gray-800">
                {role || "User"}
              </p>
              <p className="text-[10px] text-gray-400">Account</p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={settoken}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:px-4 sm:text-sm"
          >
            <FiLogOut size={16} />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
