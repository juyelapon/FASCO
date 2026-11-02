import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-4"
          >
            My Wishlist
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm font-poppins text-gray-500"
          >
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-medium">Wishlist</span>
          </motion.nav>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiHeart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 font-poppins text-sm mb-8 max-w-md mx-auto">
              You haven&apos;t added any items to your wishlist yet. Browse our collection and save the items you love!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-poppins text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft size={18} />
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Item Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-poppins text-gray-500">
                <span className="font-medium text-gray-900">{wishlistItems.length}</span>{' '}
                {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm font-poppins text-gray-500 hover:text-black transition-colors"
              >
                <FiArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>

            {/* Wishlist Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {wishlistItems.map((item, index) => {
                  const discountedPrice = item.discountPercentage
                    ? (item.price * (1 - item.discountPercentage / 100)).toFixed(2)
                    : null;
                  const ProductLink = Number.isInteger(item.id) ? Link : 'div';
                  const productLinkProps = Number.isInteger(item.id)
                    ? { to: `/product/${item.id}` }
                    : {};

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Image */}
                      <ProductLink {...productLinkProps} className="block relative">
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        {item.discountPercentage > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-poppins font-semibold px-2.5 py-1 rounded-full">
                            -{Math.round(item.discountPercentage)}%
                          </span>
                        )}
                      </ProductLink>

                      {/* Info */}
                      <div className="p-4 space-y-3">
                        <ProductLink {...productLinkProps}>
                          <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 hover:text-black transition-colors">
                            {item.title}
                          </h3>
                        </ProductLink>

                        {item.category && (
                          <p className="text-xs font-poppins text-gray-400 capitalize">
                            {item.category}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          {discountedPrice ? (
                            <>
                              <span className="text-lg font-playfair font-bold text-gray-900">
                                ${discountedPrice}
                              </span>
                              <span className="text-sm font-poppins text-gray-400 line-through">
                                ${item.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-playfair font-bold text-gray-900">
                              ${item.price?.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-poppins text-xs font-medium hover:bg-gray-800 transition-colors"
                          >
                            <FiShoppingCart size={14} />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2.5 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                            title="Remove from Wishlist"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>
    </motion.div>
  );
};

export default WishlistPage;
