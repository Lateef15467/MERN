import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { search, setsearch, showsearch, setshowsearch } =
    useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    // Show search bar on home or collection page
    if (
      location.pathname.includes("/collection") ||
      location.pathname === "/"
    ) {
      setvisible(true);
    } else {
      setvisible(false);
    }
  }, [location.pathname]);

  // Redirect to collection when searching from homepage
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setsearch(value);

    if (location.pathname === "/" && value.trim() !== "") {
      navigate("/collection");
      setshowsearch(true);
    }
  };

  return showsearch && visible ? (
    <div className="border-y border-gray-100 bg-white px-3 py-4 sm:px-5">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
        {/* Search Input */}
        <div className="flex flex-1 items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-sm sm:px-5">
          <img
            src={assets.search_icon}
            className="h-4 w-4 shrink-0 object-contain opacity-60"
            alt="Search"
          />

          <input
            value={search}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search products..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
          />

          {search && (
            <button
              type="button"
              onClick={() => setsearch("")}
              className="shrink-0 text-xs font-medium text-gray-400 transition-colors hover:text-orange-600"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Close Search */}
        <button
          type="button"
          onClick={() => setshowsearch(false)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-orange-50"
          aria-label="Close search"
        >
          <img
            src={assets.cross_icon}
            className="h-3 w-3 object-contain"
            alt=""
          />
        </button>
      </div>
    </div>
  ) : null;
};

export default SearchBar;
