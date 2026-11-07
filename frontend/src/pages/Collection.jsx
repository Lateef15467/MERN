import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { FiFilter, FiShoppingBag, FiChevronDown } from "react-icons/fi";

const Collection = () => {
  const { products, search, showsearch } = useContext(ShopContext);

  const [showFilters, setshowFilters] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setsubCategory] = useState([]);
  const [sortType, setsortType] = useState("relevant");

  // Search mode: activated from Navbar
  const isSearchMode = Boolean(showsearch);

  // Category options
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

  // Product types matching Admin Add.jsx
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

  // Apply filters and sorting
  const applyFilter = () => {
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

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showsearch, products, sortType]);

  // Clear all filters
  const clearFilters = () => {
    setCategory([]);
    setsubCategory([]);
    setsortType("relevant");
  };

  return (
    <div className="pt-3 sm:pt-10">
      {/* COLLECTION HERO BANNER */}
      <div
        className={`relative mb-9 overflow-hidden rounded-3xl bg-[#172033] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-12 ${
          isSearchMode ? "hidden sm:block" : ""
        }`}
      >
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-7 sm:flex-row">
          <div className="max-w-xl text-center sm:text-left">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-orange-300">
              Discover BaltiMart
            </span>

            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Find Your Next
              <span className="block text-orange-400">Favorite Thing.</span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-300 sm:text-base">
              Explore a wide range of products for your everyday needs. Discover
              more choices and enjoy convenient shopping in one place.
            </p>
          </div>

          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 sm:h-40 sm:w-40">
            <FiShoppingBag className="text-orange-400" size={65} />
          </div>
        </div>
      </div>

      {/* MAIN COLLECTION AREA */}
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-7">
        {/* FILTER SIDEBAR */}
        <aside
          className={`w-full self-start lg:sticky lg:top-24 lg:w-64 lg:shrink-0 ${
            isSearchMode ? "hidden lg:block" : ""
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* FILTER HEADER */}
            <button
              onClick={() => setshowFilters(!showFilters)}
              className="flex w-full items-center justify-between bg-gray-900 px-5 py-4 text-white"
            >
              <span className="flex items-center gap-2 font-semibold">
                <FiFilter size={18} />
                Filter Products
              </span>

              <FiChevronDown
                className={`transition-transform duration-300 lg:hidden ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* SCROLLABLE FILTER CONTENT */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block max-h-[55vh] overflow-y-auto pr-2 custom-filter-scroll`}
            >
              {/* CATEGORY */}
              <div className="border-b border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">Categories</p>

                  <span className="text-xs text-gray-400">
                    {category.length > 0 ? category.length : "01"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  {categories.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 transition hover:text-orange-500"
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

              {/* PRODUCT TYPE */}
              <div className="border-b border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">
                    Product Type
                  </p>

                  <span className="text-xs text-gray-400">
                    {subCategory.length > 0 ? subCategory.length : "02"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  {subCategories.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 transition hover:text-orange-500"
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

              {/* CLEAR FILTERS */}
              <div className="border-t border-gray-100 p-5">
                <button
                  onClick={clearFilters}
                  className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-500"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCTS SECTION */}
        <main className="min-w-0 flex-1">
          {/* TITLE AND SORT */}
          <div className="mb-5 flex flex-col justify-between gap-3 border-b border-gray-200 pb-4 sm:mb-6 sm:flex-row sm:items-center sm:pb-5">
            <div>
              <Title
                text1={isSearchMode ? "Search" : "Explore"}
                text2={isSearchMode ? "Results" : "Collections"}
              />

              <p className="mt-1 text-xs text-gray-500">
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
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-orange-400 sm:w-auto"
              >
                <option value="relevant">Most Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* PRODUCT COUNT */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filterProducts.length}
              </span>{" "}
              products
            </p>

            {(category.length > 0 || subCategory.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-orange-500 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* PRODUCTS GRID */}
          {filterProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 xl:grid-cols-4">
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
            /* EMPTY STATE */
            <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 text-center">
              <FiShoppingBag size={40} className="mb-4 text-gray-300" />

              <h3 className="text-lg font-bold text-gray-800">
                No Products Found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                We couldn't find products matching your search or selected
                filters. Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Collection;
