import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
import ReviewSection from "../components/ReviewSection";
import StarRating from "../components/StarRating";
import CartPopup from "../components/CartPopup";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, getCartCount, navigate } =
    useContext(ShopContext);
  const [producData, setproductData] = useState(false);
  const [image, setimage] = useState("");
  const [size, setsize] = useState("");
  const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0 });
  const [activeTab, setActiveTab] = useState("description");
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedSize, setAddedSize] = useState("");
  const tabsRef = useRef(null);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setproductData(item);
        setimage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
    setActiveTab("description");
    setShowCartPopup(false);
  }, [productId]);

  // Load the rating summary so the top rating is correct even before
  // the Reviews tab is opened.
  useEffect(() => {
    let cancelled = false;
    const loadSummary = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/review/summary/${productId}`,
        );
        if (data.success && !cancelled) setRatingSummary(data.summary);
      } catch (error) {
        console.log(error);
      }
    };
    if (backendUrl && productId) loadSummary();
    return () => {
      cancelled = true;
    };
  }, [backendUrl, productId]);

  // Open the Reviews tab and scroll to it
  const goToReviews = () => {
    setActiveTab("reviews");
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Add to cart, then show the popup (only if a size was chosen)
  const handleAddToCart = () => {
    if (!producData.inStock) return;

    // no size: addToCart shows its own "Select Product Size" toast
    if (!size) {
      addToCart(producData._id, size);
      return;
    }

    addToCart(producData._id, size);
    setAddedSize(size);
    setShowCartPopup(true);
  };

  const tabClass = (tab) =>
    `px-5 py-3 text-sm border cursor-pointer transition-colors ${
      activeTab === tab
        ? "font-bold border-b-2 border-b-black bg-white"
        : "text-gray-500 bg-gray-50 hover:bg-gray-100"
    }`;

  return producData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-500">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* product image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-auto sm:overflow-y-scroll justify-normal sm:w-[18.7%] w-full">
            {producData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setimage(item)}
                src={item}
                alt=""
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>

        {/* product info */}

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{producData.name}</h1>

          {/* real rating from reviews (click to open Reviews tab) */}
          <div
            onClick={goToReviews}
            className="flex items-center gap-2 mt-2 cursor-pointer w-fit"
          >
            <StarRating value={ratingSummary.average} size={18} />
            <p className="pl-1 text-sm">
              {ratingSummary.count > 0
                ? `${ratingSummary.average.toFixed(1)} (${ratingSummary.count} ${
                    ratingSummary.count === 1 ? "review" : "reviews"
                  })`
                : "No reviews yet"}
            </p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {producData.price}
            <span className="text-sm"> Pkr</span>
          </p>
          <p className="mt-2 text-sm font-semibold">
            {!producData.inStock ? (
              <span className="text-red-600">Out of Stock</span>
            ) : (
              <span className="text-green-600">In Stock</span>
            )}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {producData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p className="">Select Size</p>
            <div className="flex gap-2">
              {producData.Sizes.map((item, index) => (
                <button
                  disabled={!producData.inStock}
                  onClick={() => producData.inStock && setsize(item)}
                  className={`border py-2 px-4 bg-gray-100 transition-all duration-300 ${
                    !producData.inStock ? "opacity-80 cursor-not-allowed" : ""
                  } ${item === size ? "border-orange-500" : ""}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            disabled={!producData.inStock}
            onClick={handleAddToCart}
            className={`px-8 py-3 text-sm text-white transition-all duration-300 ${
              !producData.inStock
                ? "bg-gray-400 opacity-80 cursor-not-allowed"
                : "bg-black active:bg-gray-700"
            }`}
          >
            {!producData.inStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% original product.</p>
            <p>Cash on delivery is available.</p>
            <p>Easy exchange policy within 2 days.</p>
          </div>
        </div>
      </div>

      {/* description and reviews tabs */}
      <div className="mt-20" ref={tabsRef}>
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={tabClass("description")}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={tabClass("reviews")}
          >
            Reviews ({ratingSummary.count})
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            {producData.description ? <p>{producData.description}</p> : null}
            <p>
              Discover the perfect blend of style, comfort, and quality with
              this product. Designed with premium materials, it offers
              durability and everyday usability, making it an ideal choice for
              your wardrobe or lifestyle.
            </p>
            <p>
              Whether you’re looking for a modern look or a timeless classic,
              this piece is crafted to meet your needs. Enjoy reliable quality,
              affordable pricing, and a product that’s made to fit seamlessly
              into your daily life.
            </p>
          </div>
        ) : (
          <div className="border px-6 pb-6">
            <ReviewSection
              productId={productId}
              onSummaryChange={setRatingSummary}
            />
          </div>
        )}
      </div>

      {/* display related product */}
      <RelatedProduct
        category={producData.category}
        subCategory={producData.subCategory}
      ></RelatedProduct>

      {/* add to cart popup */}
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
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
