import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchAllProducts, fetchProductsByCategory } from '../utils/api';
import { newArrivalsProducts } from '../data/newArrivalsProducts';

const tabs = [
  "Men's Fashion",
  "Women's Fashion",
  "Women Accessories",
  "Men Accessories",
  "Discount Deals",
];

const tabCategories = {
  "Men's Fashion": ['mens-shirts', 'mens-shoes'],
  'Women Accessories': ['womens-bags', 'womens-jewellery'],
  'Men Accessories': ['mens-watches', 'sunglasses'],
};

const tabShopLinks = {
  "Men's Fashion": '/shop?category=mens-shirts,mens-shoes',
  "Women's Fashion": '/shop?category=womens-dresses',
  'Women Accessories': '/shop?category=womens-bags,womens-jewellery',
  'Men Accessories': '/shop?category=mens-watches,sunglasses',
  'Discount Deals': '/shop?discounted=true',
};

const NewArrivals = () => {
  const [activeTab, setActiveTab] = useState("Women's Fashion");
  const [addedId, setAddedId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const categories = tabCategories[activeTab];
    if (!categories && activeTab !== 'Discount Deals') return undefined;

    let cancelled = false;

    const loadProducts = activeTab === 'Discount Deals'
      ? fetchAllProducts(200).then(({ products: items }) =>
          items
            .filter((item) => item.discountPercentage > 0)
            .sort((a, b) => b.discountPercentage - a.discountPercentage)
        )
      : Promise.all(categories.map((category) => fetchProductsByCategory(category)))
          .then((results) => results.flatMap((result) => result.products || []));

    loadProducts
      .then((items) => {
        if (cancelled) return;
        setProducts(items.map((item) => ({
          ...item,
          brand: item.brand || 'FASCO',
          reviews: `(${item.reviews?.length || 0}) Customer Reviews`,
          status: item.stock <= 10 ? 'Almost Sold Out' : 'In Stock',
          image: item.thumbnail || item.images?.[0],
        })));
      })
      .catch((loadError) => {
        if (cancelled) return;
        console.error('Failed to load New Arrivals:', loadError);
        setError('Products could not be loaded. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, retryCount]);

  const visibleProducts = activeTab === "Women's Fashion"
    ? newArrivalsProducts
    : products.slice(0, 6);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (tab === "Women's Fashion") {
      setProducts([]);
      setError('');
      setLoading(false);
    } else {
      setLoading(true);
      setError('');
    }
  };

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...item, thumbnail: item.image });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="new-arrivals" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4"
          >
            New Arrivals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-poppins text-xs sm:text-sm text-gray-500 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis
            ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
          </motion.p>
        </div>

        {/* Category Tabs matching Figma */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                aria-pressed={isSelected}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-poppins font-medium transition duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid matching Figma (3x2 on desktop) */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {loading ? (
            <p className="col-span-full py-12 text-center text-sm text-gray-500" role="status">
              Loading products...
            </p>
          ) : error ? (
            <div className="col-span-full py-8 text-center" role="alert">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError('');
                  setRetryCount((count) => count + 1);
                }}
                className="text-sm font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : visibleProducts.length === 0 ? (
            <p className="col-span-full py-12 text-center text-sm text-gray-500">
              No products found in this category.
            </p>
          ) : visibleProducts.map((prod, index) => {
            const wishlisted = isInWishlist(prod.id);
            const isAdded = addedId === prod.id;

            return (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Image Container with zoom & wishlist heart */}
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-neutral-100 mb-4">
                    <Link to={`/product/${prod.id}`} aria-label={`View ${prod.title} details`}>
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </Link>

                    {prod.discountPercentage > 0 && (
                      <span className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                        -{Math.round(prod.discountPercentage)}%
                      </span>
                    )}

                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist({ ...prod, thumbnail: prod.image });
                      }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition"
                      aria-label="Wishlist"
                    >
                      {wishlisted ? (
                        <FaHeart className="text-red-500 text-sm" />
                      ) : (
                        <FaRegHeart className="text-gray-600 text-sm" />
                      )}
                    </button>

                    {/* Quick Add to Cart button on hover */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition duration-200 p-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, prod)}
                        className={`w-full py-2.5 text-xs font-poppins font-semibold rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2 ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-black text-white hover:bg-neutral-800'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <FaCheck size={12} /> Added to Cart!
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Title & Stars row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <Link
                        to={`/product/${prod.id}`}
                        className="font-poppins font-semibold text-base text-gray-900 leading-snug hover:underline"
                      >
                        <h3>{prod.title}</h3>
                      </Link>
                      <p className="text-xs font-poppins text-gray-400">
                        {prod.brand}
                      </p>
                    </div>

                    {/* 5 Stars */}
                    <div className="flex text-amber-400 text-xs mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>

                  {/* Reviews count */}
                  <p className="text-[11px] font-poppins text-gray-400 mb-3">
                    {prod.reviewsLabel || `(${prod.reviews?.length || 0}) Customer Reviews`}
                  </p>
                </div>

                {/* Price and Status row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Link
                    to={`/product/${prod.id}`}
                    className="flex w-full items-center justify-between"
                    aria-label={`View ${prod.title} details and price`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-poppins font-bold text-lg text-gray-900">
                        ${(prod.price * (1 - (prod.discountPercentage || 0) / 100)).toFixed(2)}
                      </span>
                      {prod.discountPercentage > 0 && (
                        <span className="font-poppins text-xs text-gray-400 line-through">
                          ${prod.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className={`font-poppins font-medium text-xs ${
                      prod.status === 'Almost Sold Out' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {prod.status}
                    </span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View More Button */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            to={tabShopLinks[activeTab]}
            className="inline-block px-10 py-3.5 bg-black text-white text-xs font-poppins font-semibold rounded-xl shadow-lg hover:bg-neutral-800 active:scale-95 transition"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
