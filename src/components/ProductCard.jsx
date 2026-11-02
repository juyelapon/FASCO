import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaCheck } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const renderStars = (rating = 5) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  }
  if (hasHalf) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }
  const remaining = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));
  for (let i = 0; i < remaining; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
  }
  return stars;
};

const ProductCard = ({ product, index = 0 }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);
  const discount = product.discountPercentage || 0;
  const discountedPrice = (
    product.price -
    product.price * (discount / 100)
  ).toFixed(2);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col justify-between"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          {imgError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 px-4 text-center font-poppins text-xs text-gray-500">
              Image unavailable
            </div>
          ) : (
            <img
              src={product.thumbnail || (product.images && product.images[0])}
              alt={product.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-poppins font-semibold px-2 py-0.5 rounded shadow-xs">
              -{Math.round(discount)}%
            </span>
          )}

          {/* Add to Cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button
              onClick={handleAddToCart}
              className={`w-full font-poppins text-xs font-semibold py-3 transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {added ? (
                <>
                  <FaCheck size={12} /> Added!
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="p-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-poppins mb-1">
            {product.category || 'Fashion'}
          </p>
          <h3 className="font-poppins text-sm font-medium text-gray-900 truncate mb-1.5 title-clamp">
            {product.title}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-xs">{renderStars(product.rating)}</div>
            <span className="text-[11px] text-gray-400 font-poppins ml-1">
              ({product.rating})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-poppins font-semibold text-sm text-gray-900">
              ${discountedPrice}
            </span>
            {discount > 0 && (
              <span className="font-poppins text-xs text-gray-400 line-through">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wishlisted ? (
          <FaHeart className="text-red-500 text-sm" />
        ) : (
          <FaRegHeart className="text-gray-600 text-sm" />
        )}
      </button>
    </motion.div>
  );
};

export default ProductCard;
