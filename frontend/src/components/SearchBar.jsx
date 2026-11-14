import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const popularKeywords = [
  "Shirt",
  "Shoes",
  "T-Shirts",
  "Watches",
  "Jeans",
  "Hoodies",
  "Jackets",
  "Bags",
  "Sneakers",
  "Dresses",
  "Trousers",
  "Sweaters",
  "Sunglasses",
  "Backpacks",
  "Wallets",
  "Belts",
  "Caps",
  "Sandals",
  "Headphones",
  "Smartphones",
  "Electronics",
  "Accessories",
  "Sportswear",
  "Blazers",
  "Shorts",
  "Skirts",
  "Boots",
  "Handbags",
  "Jewelry",
  "Perfumes",
  "Furniture",
  "Home Decor",
  "Earbuds",
  "Speakers",
  "Leggings",
  "Coats",
  "Sweatshirts",
  "Slippers",
  "Smartwatch",
  "Bracelets",
];

const SearchBar = () => {
  const { search, setsearch, showsearch, setshowsearch } =
    useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [visible, setvisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Show search bar on Home and Collection pages
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

  // Handle Search Input
  const handleSearchChange = (e) => {
    const value = e.target.value;

    setsearch(value);
    setShowSuggestions(true);

    if (location.pathname === "/" && value.trim() !== "") {
      navigate("/collection");
      setshowsearch(true);
    }
  };

  // Handle Suggestion Click
  const handleSuggestionClick = (keyword) => {
    setsearch(keyword);
    setShowSuggestions(false);

    if (location.pathname !== "/collection") {
      navigate("/collection");
    }
  };

  // Clear Search
  const handleClearSearch = () => {
    setsearch("");
    setShowSuggestions(true);
  };

  // Close Search
  const handleCloseSearch = () => {
    setshowsearch(false);
    setShowSuggestions(true);
  };

  // Filter Matching Keywords
  const filteredKeywords = search.trim()
    ? popularKeywords.filter((keyword) =>
        keyword.toLowerCase().startsWith(search.trim().toLowerCase()),
      )
    : [];

  return showsearch && visible ? (
    <div className="border-y border-gray-100 bg-white px-2 py-2 sm:px-5 sm:py-3">
      <div className="mx-auto w-full max-w-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-2 sm:gap-3">
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
                onClick={handleClearSearch}
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
            onClick={handleCloseSearch}
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

        {/* Vertical Keyword Suggestions */}
        {showSuggestions &&
          search.trim() !== "" &&
          filteredKeywords.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="max-h-40 overflow-y-auto">
                {filteredKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handleSuggestionClick(keyword)}
                    className="flex w-full items-center gap-3 border-b border-gray-50 px-3 py-2.5 text-left text-xs text-gray-600 transition-colors last:border-b-0 hover:bg-orange-50 hover:text-orange-600 sm:text-sm"
                  >
                    <img
                      src={assets.search_icon}
                      alt=""
                      className="h-3 w-3 object-contain opacity-40"
                    />

                    <span>{keyword}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  ) : null;
};

export default SearchBar;
