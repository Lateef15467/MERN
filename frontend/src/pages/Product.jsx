import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
import ReviewSection from "../components/ReviewSection";
import StarRating from "../components/StarRating";
import CartPopup from "../components/CartPopup";
import {
  FiShoppingBag,
  FiShield,
  FiRefreshCw,
  FiTruck,
  FiPackage,
} from "react-icons/fi";

const Product = () => {
  const { productId } = useParams();

  const { products, currency, addToCart, backendUrl, getCartCount, navigate } =
    useContext(ShopContext);

  const [producData, setproductData] = useState(false);
  const [image, setimage] = useState("");
  const [size, setsize] = useState("");

  const [ratingSummary, setRatingSummary] = useState({
    average: 0,
    count: 0,
  });

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedSize, setAddedSize] = useState("");

  // Load selected product
  useEffect(() => {
    const product = products.find((item) => item._id === productId);

    if (product) {
      setproductData(product);
      setimage(product.image?.[0] || "");
    } else {
      setproductData(false);
      setimage("");
    }

    setsize("");
    setShowCartPopup(false);
    setRatingSummary({ average: 0, count: 0 });
  }, [productId, products]);

  // Load product rating summary
  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/review/summary/${productId}`,
        );

        if (data.success && !cancelled) {
          setRatingSummary(data.summary);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (backendUrl && productId) {
      loadSummary();
    }

    return () => {
      cancelled = true;
    };
  }, [backendUrl, productId]);

  // Scroll directly to reviews
  const goToReviews = () => {
    document.getElementById("product-reviews")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Add product to cart
  const handleAddToCart = () => {
    if (!producData.inStock) return;

    if (!size) {
      addToCart(producData._id, size);
      return;
    }

    addToCart(producData._id, size);
    setAddedSize(size);
    setShowCartPopup(true);
  };

  return producData ? (
    <main className="w-full bg-white text-gray-800">
      <div className="border-t border-gray-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-10 pb-12">
        {/* Product details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Product gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto sm:w-[88px] sm:max-h-[570px] pb-1 sm:pb-0">
              {producData.image?.map((item, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setimage(item)}
                  aria-label={`View product image ${index + 1}`}
                  className={`w-[72px] h-[82px] sm:w-full sm:h-[100px] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    image === item
                      ? "border-orange-500 shadow-sm"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={item}
                    alt={`${producData.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              <div className="aspect-[4/5] sm:aspect-[4/5] w-full">
                <img
                  src={image || producData.image?.[0]}
                  alt={producData.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col pt-1 lg:pt-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                BaltiMart Collection
              </span>

              <span className="w-1 h-1 rounded-full bg-gray-300" />

              <span className="text-xs text-gray-400">
                {producData.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
              {producData.name}
            </h1>

            {/* Rating */}
            <button
              type="button"
              onClick={goToReviews}
              className="flex items-center gap-2 mt-4 w-fit group"
              aria-label="View product reviews"
            >
              <StarRating value={ratingSummary.average} size={18} />

              <span className="text-sm text-gray-500 group-hover:text-orange-600 transition-colors">
                {ratingSummary.count > 0
                  ? `${ratingSummary.average.toFixed(1)} (${ratingSummary.count} ${
                      ratingSummary.count === 1 ? "review" : "reviews"
                    })`
                  : "No reviews yet"}
              </span>
            </button>

            {/* Price */}
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                {currency}
                {producData.price}
              </p>

              <span className="text-sm text-gray-400 font-medium">PKR</span>
            </div>

            {/* Stock status */}
            <div className="mt-4">
              {producData.inStock ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-3 py-1.5 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Size selection */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Select Size</h3>

                {size && (
                  <span className="text-xs text-orange-600 font-semibold">
                    Selected: {size}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {producData.Sizes?.map((item, index) => (
                  <button
                    type="button"
                    key={index}
                    disabled={!producData.inStock}
                    onClick={() => producData.inStock && setsize(item)}
                    className={`min-w-[48px] h-11 px-4 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                      item === size
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 bg-white text-gray-700 hover:border-orange-400"
                    } ${
                      !producData.inStock ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              disabled={!producData.inStock}
              onClick={handleAddToCart}
              className={`mt-8 w-full sm:w-fit min-w-[210px] flex items-center justify-center gap-3 px-8 py-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                !producData.inStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] shadow-md shadow-orange-100"
              }`}
            >
              <FiShoppingBag size={18} />
              {producData.inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Product assurances */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <FiShield size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    100% Original
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Quality products</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <FiTruck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Pay when you receive
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <FiRefreshCw size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Easy Exchange
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Within 2 days</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <FiPackage size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Secure Shopping
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Shop with confidence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <section className="mt-16 sm:mt-20">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Product Description
            </h2>
          </div>

          <div className="border border-t-0 border-gray-200 rounded-b-xl p-5 sm:p-8 space-y-4 text-sm leading-7 text-gray-500">
            {producData.description && <p>{producData.description}</p>}

            <p>
              Discover the perfect blend of style, comfort, and quality with
              this product. Designed with premium materials, it offers
              durability and everyday usability, making it an ideal choice for
              your wardrobe or lifestyle.
            </p>

            <p>
              Whether you're looking for a modern look or a timeless classic,
              this piece is crafted to meet your needs. Enjoy reliable quality,
              affordable pricing, and a product that's made to fit seamlessly
              into your daily life.
            </p>
          </div>
        </section>

        {/* Ratings and Reviews directly below description */}
        <section id="product-reviews" className="mt-12 sm:mt-16 scroll-mt-24">
          <ReviewSection
            productId={productId}
            onSummaryChange={setRatingSummary}
          />
        </section>

        {/* Related products */}
        <section className="mt-16 sm:mt-20">
          <RelatedProduct
            category={producData.category}
            subCategory={producData.subCategory}
          />
        </section>
      </div>

      {/* Add to cart popup */}
      <CartPopup
        open={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        onView={() => {
          setShowCartPopup(false);
          navigate("/cart");
        }}
        product={producData}
        size={addedSize}
        cartCount={getCartCount()}
        currency={currency}
      />
    </main>
  ) : (
    <div className="min-h-[50vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-9 h-9 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Loading product...</p>
      </div>
    </div>
  );
};

export default Product;
