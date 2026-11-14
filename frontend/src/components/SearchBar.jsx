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
    if (
      location.pathname.includes("/collection") ||
      location.pathname === "/"
    ) {
      setvisible(true);
    } else {
      setvisible(false);
    }
  }, [location.pathname]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setsearch(value);

    if (location.pathname === "/" && value.trim() !== "") {
      navigate("/collection");
      setshowsearch(true);
    }
  };

  return showsearch && visible ? (
    <div className="border-y border-gray-100 bg-white px-2 py-2 sm:px-5 sm:py-3">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 transition-all duration-200 focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-sm sm:gap-3 sm:px-5 sm:py-3">
          <img
            src={assets.search_icon}
            className="h-3.5 w-3.5 shrink-0 object-contain opacity-60 sm:h-4 sm:w-4"
            alt="Search"
          />

          <input
            value={search}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search products..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
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
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-orange-50 sm:h-10 sm:w-10"
          aria-label="Close search"
        >
          <img
            src={assets.cross_icon}
            className="h-2.5 w-2.5 object-contain sm:h-3 sm:w-3"
            alt=""
          />
        </button>
      </div>
    </div>
  ) : null;
};

export default SearchBar;
