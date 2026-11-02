import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
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
            Shopping Cart
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
            <span className="text-black font-medium">Cart</span>
          </motion.nav>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 font-poppins text-sm mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Start shopping and find something you love!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-poppins text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft size={18} />
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-poppins font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Subtotal</div>
                <div className="col-span-1" />
              </div>

              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => {
                  const itemPrice = item.discountPercentage
                    ? item.price * (1 - item.discountPercentage / 100)
                    : item.price;
                  const itemSubtotal = itemPrice * item.quantity;
                  const ProductLink = Number.isInteger(item.id) ? Link : 'div';
                  const productLinkProps = Number.isInteger(item.id)
                    ? { to: `/product/${item.id}` }
                    : {};

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Desktop Row */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-100">
                        {/* Product */}
                        <div className="col-span-5 flex items-center gap-4">
                          <ProductLink {...productLinkProps} className="flex-shrink-0">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                            />
                          </ProductLink>
                          <div>
                            <ProductLink
                              {...productLinkProps}
                              className="font-poppins font-medium text-gray-900 hover:text-black transition-colors text-sm line-clamp-2"
                            >
                              {item.title}
                            </ProductLink>
                            <p className="text-xs font-poppins text-gray-400 capitalize mt-1">
                              {item.category}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <span className="font-poppins text-sm text-gray-900">
                            ${itemPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-10 text-center font-poppins text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 text-center">
                          <span className="font-poppins text-sm font-semibold text-gray-900">
                            ${itemSubtotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Remove */}
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div className="md:hidden flex gap-4 p-4 border-b border-gray-100">
                        <ProductLink {...productLinkProps} className="flex-shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                          />
                        </ProductLink>
                        <div className="flex-1 min-w-0">
                          <ProductLink
                            {...productLinkProps}
                            className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 hover:text-black transition-colors"
                          >
                            {item.title}
                          </ProductLink>
                          <p className="text-xs font-poppins text-gray-400 capitalize mt-0.5">
                            {item.category}
                          </p>
                          <p className="font-poppins text-sm font-semibold text-gray-900 mt-2">
                            ${itemPrice.toFixed(2)}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="w-8 text-center font-poppins text-xs">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-100 transition-colors"
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Clear Cart */}
              <div className="flex items-center justify-between mt-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-sm font-poppins text-gray-500 hover:text-black transition-colors"
                >
                  <FiArrowLeft size={16} />
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="px-4 py-2 text-sm font-poppins text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:w-80"
            >
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-playfair font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm font-poppins">
                    <span className="text-gray-500">
                      Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-poppins">
                    <span className="text-gray-500">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs font-poppins text-gray-400">
                      Free shipping on orders over $50
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-base font-poppins font-bold text-gray-900">Total</span>
                  <span className="text-xl font-playfair font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-black text-white rounded-lg font-poppins text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/shop"
                  className="block text-center text-sm font-poppins text-gray-500 hover:text-black transition-colors mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default CartPage;
