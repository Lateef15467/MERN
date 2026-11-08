import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiPlusSquare,
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiUsers,
  FiUserPlus,
  FiX,
  FiLayers,
  FiChevronRight,
} from "react-icons/fi";

const SideBar = ({ role, isOpen, onClose }) => {
  const isAdmin = role?.toLowerCase() === "admin";

  const commonLinks = [
    { name: "Add Product", path: "/add", icon: FiPlusSquare },
    { name: "Product List", path: "/list", icon: FiPackage },
    { name: "Orders", path: "/orders", icon: FiShoppingBag },
  ];

  const adminLinks = [
    { name: "Add Supplier", path: "/supplier", icon: FiTruck },
    { name: "Supplier List", path: "/suppliers", icon: FiLayers },
    { name: "Customers", path: "/users", icon: FiUsers },
    { name: "Add Vendor", path: "/addVendor", icon: FiUserPlus },
    { name: "Vendor List", path: "/vendorList", icon: FiGrid },
  ];

  const renderLink = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `group flex items-center justify-between rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all duration-200 ${
            isActive
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className="flex items-center gap-3">
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-500 group-hover:text-indigo-300"
                }
              />
              {item.name}
            </span>

            {isActive && <FiChevronRight size={16} />}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#111827] text-white shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-[72px] lg:z-20 lg:h-[calc(100vh-72px)] lg:shrink-0 lg:translate-x-0 lg:shadow-none`}
      >
        {/* Sidebar heading */}
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <FiGrid size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold tracking-wide text-white">
                Dashboard
              </h2>
              <p className="text-[10px] text-slate-500">Store management</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-slate-500">
            Workspace
          </p>

          <nav className="flex flex-col gap-1.5">
            {commonLinks.map(renderLink)}
          </nav>

          {isAdmin && (
            <>
              <div className="my-6 border-t border-white/10" />

              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-slate-500">
                Administration
              </p>

              <nav className="flex flex-col gap-1.5">
                {adminLinks.map(renderLink)}
              </nav>
            </>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs font-semibold text-white">
              {isAdmin ? "Administrator Access" : "Vendor Workspace"}
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
              {isAdmin
                ? "You have access to store administration."
                : "Manage your products and orders."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
