import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FiHeart, FiMinus, FiPlus, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchProductById, fetchProductsByCategory } from '../utils/api';
import { newArrivalsProducts } from '../data/newArrivalsProducts';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const featuredProduct = newArrivalsProducts.find((item) => item.id === id);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const isInWishlist = product
    ? wishlistItems.some((item) => item.id === product.id)
    : false;

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      setProductError('');
      setProduct(null);
      setRelatedProducts([]);
      setSelectedImage(0);
      setQuantity(1);
      try {
        const data = featuredProduct || await fetchProductById(id);
        if (!active) return;
        setProduct(data);

        if (data.category) {
          try {
            const related = await fetchProductsByCategory(data.category);
            if (!active) return;
            const filtered = (related.products || []).filter((p) => p.id !== data.id);
            setRelatedProducts(filtered.slice(0, 8));
          } catch (relatedError) {
            console.error('Failed to fetch related products:', relatedError);
          }
        }
      } catch (err) {
        if (active) {
          console.error('Failed to fetch product:', err);
          setProduct(null);
          setProductError('The product could not be loaded. Check your connection and try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
    return () => {
      active = false;
    };
  }, [id, retryCount, featuredProduct]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product && next > product.stock) return Math.max(1, product.stock);
      return next;
    });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" size={16} />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" size={16} />);
    }
    const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" size={16} />);
    }
    return stars;
  };

  const discountedPrice =
    product && product.discountPercentage
      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        {/* Skeleton */}
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2 space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-500 font-poppins mb-6">
          {productError || 'The product you are looking for does not exist.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {productError && (
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="inline-block rounded-lg border border-gray-300 px-6 py-3 font-poppins text-sm transition-colors hover:bg-gray-50"
            >
              Try Again
            </button>
          )}
          <Link
            to="/shop"
            className="inline-block rounded-lg bg-black px-6 py-3 font-poppins text-sm text-white transition-colors hover:bg-gray-800"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm font-poppins text-gray-500 flex-wrap">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-black transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-black font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-crosshair mb-4"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={product.images?.[selectedImage] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  style={
                    isZoomed
                      ? {
                          transform: 'scale(2)',
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : {}
                  }
                />
              </AnimatePresence>

              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-black ring-1 ring-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-1/2 space-y-5"
          >
            {/* Brand & Category */}
            <div className="flex items-center gap-3">
              {product.brand && (
                <span className="text-sm font-poppins text-gray-500">{product.brand}</span>
              )}
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-poppins rounded-full capitalize">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm font-poppins text-gray-500">
                ({product.rating?.toFixed(1)})
              </span>
              {product.reviews && (
                <span className="text-sm font-poppins text-gray-400">
                  · {product.reviews.length} reviews
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-playfair font-bold text-gray-900">
                    ${discountedPrice}
                  </span>
                  <span className="text-xl font-poppins text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-poppins font-semibold rounded">
                    Save {Math.round(product.discountPercentage)}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-playfair font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 font-poppins text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span
                className={`text-sm font-poppins font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-poppins font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FiMinus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(Math.max(1, val), Math.max(1, product.stock)));
                  }}
                  className="w-14 text-center font-poppins text-sm border-x border-gray-300 py-3 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-3 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-poppins text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <FiShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'
                }`}
              >
                {isInWishlist ? <FaHeart size={20} /> : <FiHeart size={20} />}
              </button>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-200 pt-5 space-y-2">
              {product.sku && (
                <div className="flex items-center gap-2 text-sm font-poppins">
                  <span className="text-gray-500">SKU:</span>
                  <span className="text-gray-700">{product.sku}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm font-poppins">
                <span className="text-gray-500">Category:</span>
                <Link
                  to={`/shop?category=${product.category}`}
                  className="text-gray-700 capitalize hover:text-black transition-colors"
                >
                  {product.category}
                </Link>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2 text-sm font-poppins flex-wrap">
                  <span className="text-gray-500">Tags:</span>
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 text-center mb-10">
              Related Products
            </h2>

            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  prevEl: '.related-prev',
                  nextEl: '.related-next',
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
              >
                {relatedProducts.map((p) => (
                  <SwiperSlide key={p.id}>
                    <ProductCard product={p} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button className="related-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <FiChevronLeft size={20} />
              </button>
              <button className="related-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <FiChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        </section>
      )}
    </motion.div>
  );
};

export default ProductDetailPage;
