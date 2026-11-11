import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigationType } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { FiFilter, FiShoppingBag, FiChevronDown } from "react-icons/fi";

const FILTER_STORAGE_KEY = "collection-filters";

const DEFAULT_FILTERS = {
  category: [],
  subCategory: [],
  sortType: "relevant",
};

// Read saved filters (used only when coming back with Back / Forward)
const readSavedFilters = () => {
  try {
    const raw = sessionStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return DEFAULT_FILTERS;

    const parsed = JSON.parse(raw);

    return {
      category: Array.isArray(parsed?.category) ? parsed.category : [],
      subCategory: Array.isArray(parsed?.subCategory) ? parsed.subCategory : [],
      sortType:
        typeof parsed?.sortType === "string" ? parsed.sortType : "relevant",
    };
  } catch (error) {
    return DEFAULT_FILTERS;
  }
};

const Collection = () => {
  const { products, search, showsearch } = useContext(ShopContext);
  const navigationType = useNavigationType();

  // Back / Forward keeps the previous filters; a fresh visit starts clean
  const [initialFilters] = useState(() =>
    navigationType === "POP" ? readSavedFilters() : DEFAULT_FILTERS,
  );

  const [showFilters, setshowFilters] = useState(false);
  const [category, setCategory] = useState(initialFilters.category);
  const [subCategory, setsubCategory] = useState(initialFilters.subCategory);
  const [sortType, setsortType] = useState(initialFilters.sortType);

  const isSearchMode = Boolean(showsearch);

  const categories = [
    "Men",
    "Women",
    "Kids",
    "Electronics",
    "Mobile & Accessories",
    "Home & Living",
    "Furniture",
    "Beauty & Personal Care",
    "Footwear",
    "Bags & Accessories",
    "Sports & Outdoors",
    "Kitchen & Dining",
    "Grocery",
    "Watches",
    "Toys & Games",
    "Books & Stationery",
    "Automotive",
  ];

  const subCategories = [
    "Topwear",
    "Bottomwear",
    "Winterwear",
    "Smartphones",
    "Laptops",
    "Headphones",
    "Accessories",
    "Home Decor",
    "Furniture",
    "Kitchen Appliances",
    "Skincare",
    "Makeup",
    "Shoes",
    "Bags",
    "Sports Equipment",
    "Food & Beverages",
    "Watches",
    "Toys",
    "Books & Stationery",
    "Stationery",
    "Automotive Accessories",
  ];

  // Save filters so Back can restore them
  useEffect(() => {
    try {
      sessionStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify({ category, subCategory, sortType }),
      );
    } catch (error) {
      // Storage can be unavailable; ignore
    }
  }, [category, subCategory, sortType]);

  // Toggle category
  const toggleCategory = (e) => {
    const value = e.target.value;

    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  // Toggle product type
  const togglesubCategory = (e) => {
    const value = e.target.value;

    if (subCategory.includes(value)) {
      setsubCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setsubCategory((prev) => [...prev, value]);
    }
  };

  // Apply filters and sorting (calculated during render, so the list is
  // ready on the very first paint and the page height never jumps)
  const filterProducts = useMemo(() => {
    let productsCopy = Array.isArray(products) ? [...products] : [];

    // Search filter
    if (showsearch && search?.trim()) {
      productsCopy = productsCopy.filter((item) =>
        item?.name?.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }

    // Category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    // Product type filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      );
    }

    // Sorting
    if (sortType === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    return productsCopy;
  }, [products, search, showsearch, category, subCategory, sortType]);

  // Clear all filters
  const clearFilters = () => {
    setCategory([]);
    setsubCategory([]);
    setsortType("relevant");
  };

  const activeFilterCount = category.length + subCategory.length;

  return (
    <section className="mx-auto max-w-[1600px] px-3 pb-12 pt-5 sm:px-6 sm:pt-8 lg:px-10">
      {/* Collection Banner */}
      {!isSearchMode && (
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gray-900 px-5 py-9 text-white sm:mb-10 sm:px-10 sm:py-12 lg:px-14">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-7 sm:flex-row">
            <div className="max-w-xl text-center sm:text-left">
              <span className="mb-3 inline-block rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-orange-300 sm:text-xs">
                Discover BaltiMart
              </span>

              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Find Your Next
                <span className="block text-orange-400">Favorite Thing.</span>
              </h1>

              <p className="mt-4 max-w-lg text-xs leading-6 text-gray-300 sm:text-sm sm:leading-7">
                Explore a wide range of products for your everyday needs.
                Discover more choices and enjoy convenient shopping in one
                place.
              </p>
            </div>

            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 sm:h-36 sm:w-36 lg:h-40 lg:w-40">
              <FiShoppingBag className="text-orange-400" size={60} />
            </div>
          </div>
        </div>
      )}

      {/* Main Collection Area */}
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-7">
        {/* Filter Sidebar */}
        <aside className="w-full shrink-0 self-start lg:sticky lg:top-24 lg:w-64">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Filter Header */}
            <button
              type="button"
              onClick={() => setshowFilters(!showFilters)}
              className="flex w-full items-center justify-between bg-gray-900 px-5 py-4 text-white transition-colors hover:bg-gray-800"
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <FiFilter size={18} />
                Filter Products
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>

              <FiChevronDown
                className={`transition-transform duration-300 lg:hidden ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filter Content */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } max-h-[55vh] overflow-y-auto lg:block`}
            >
              {/* Categories */}
              <div className="border-b border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">Categories</p>
                  <span className="text-xs text-gray-400">
                    {category.length} selected
                  </span>
                </div>

                <div className="space-y-3">
                  {categories.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 text-xs text-gray-600 transition-colors hover:text-orange-500 sm:text-sm"
                    >
                      <input
                        onChange={toggleCategory}
                        type="checkbox"
                        checked={category.includes(item)}
                        className="h-4 w-4 cursor-pointer accent-orange-500"
                        value={item}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              <div className="border-b border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">
                    Product Type
                  </p>
                  <span className="text-xs text-gray-400">
                    {subCategory.length} selected
                  </span>
                </div>

                <div className="space-y-3">
                  {subCategories.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 text-xs text-gray-600 transition-colors hover:text-orange-500 sm:text-sm"
                    >
                      <input
                        onChange={togglesubCategory}
                        type="checkbox"
                        checked={subCategory.includes(item)}
                        className="h-4 w-4 cursor-pointer accent-orange-500"
                        value={item}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="p-5">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <main className="min-w-0 flex-1">
          {/* Heading and Sorting */}
          <div className="mb-5 flex flex-col justify-between gap-3 border-b border-gray-200 pb-4 sm:mb-6 sm:flex-row sm:items-center sm:pb-5">
            <div>
              <Title
                text1={isSearchMode ? "Search" : "Explore"}
                text2={isSearchMode ? "Results" : "Collections"}
              />

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {isSearchMode && search
                  ? `Results for "${search}"`
                  : "Discover products selected for you."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-xs font-medium text-gray-500">
                Sort by
              </span>

              <select
                value={sortType}
                onChange={(e) => setsortType(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none transition focus:border-orange-400 sm:flex-none sm:px-4 sm:text-sm"
              >
                <option value="relevant">Most Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Count */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-gray-500 sm:text-sm">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filterProducts.length}
              </span>{" "}
              products
            </p>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-orange-500 transition-colors hover:text-orange-600 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filterProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-7 md:grid-cols-3 xl:grid-cols-4">
              {filterProducts.map((item) => (
                <ProductItem
                  key={item._id}
                  name={item.name}
                  id={item._id}
                  image={item.image}
                  price={item.price}
                  inStock={item.inStock}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                <FiShoppingBag size={30} className="text-orange-400" />
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                No Products Found
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-6 text-gray-500 sm:text-sm">
                We couldn't find products matching your search or selected
                filters. Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Collection;
