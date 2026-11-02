import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiTruck,
  FiCreditCard,
  FiTag,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const subtotal = getCartTotal ? getCartTotal() : 0;
  const [estimatedDelivery] = useState(() => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  });

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'cod',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shippingCost = shippingMethod === 'express' ? 15 : subtotal > 50 ? 0 : 5.99;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'FASCO20') {
      setDiscountPercent(20);
      setCouponSuccess('20% discount applied successfully!');
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'FASCO10') {
      setDiscountPercent(10);
      setCouponSuccess('10% discount applied successfully!');
      setCouponError('');
    } else {
      setDiscountPercent(0);
      setCouponError('Invalid coupon code. Try FASCO20 or FASCO10');
      setCouponSuccess('');
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.address) {
      alert('Please fill in your name, email and shipping address.');
      return;
    }

    const generatedId = `FAS-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setIsOrderPlaced(true);
    clearCart();
  };

  if (cartItems.length === 0 && !isOrderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 font-poppins text-sm mb-6 max-w-sm">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-black text-white text-sm font-poppins rounded-lg hover:bg-neutral-800 transition"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-50 min-h-screen py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-poppins text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-black">
            Cart
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">Checkout</span>
        </div>

        <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Customer Details */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-gray-100">
                <h2 className="text-lg font-playfair font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>1. Contact Information</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-poppins text-gray-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-poppins text-gray-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-gray-100">
                <h2 className="text-lg font-playfair font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTruck /> <span>2. Shipping Address</span>
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-poppins text-gray-600 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-poppins text-gray-600 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-poppins text-gray-600 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Fashion Blvd"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-poppins text-gray-600 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-poppins text-gray-600 mb-1">
                        Postal / ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-poppins text-gray-600 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-poppins bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-poppins font-semibold text-gray-900 mb-3">
                    Shipping Method
                  </h3>
                  <div className="space-y-2">
                    <label
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition ${
                        shippingMethod === 'standard'
                          ? 'border-black bg-gray-50/70'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="accent-black"
                        />
                        <div>
                          <p className="text-sm font-poppins font-medium text-gray-900">
                            Standard Delivery
                          </p>
                          <p className="text-xs text-gray-500">
                            Estimated 3-5 business days
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold font-poppins ${
                        subtotal > 50 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {subtotal > 50 ? 'FREE' : '$5.99'}
                      </span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition ${
                        shippingMethod === 'express'
                          ? 'border-black bg-gray-50/70'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="accent-black"
                        />
                        <div>
                          <p className="text-sm font-poppins font-medium text-gray-900">
                            Express Priority Air Delivery
                          </p>
                          <p className="text-xs text-gray-500">
                            Estimated 1-2 business days
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold font-poppins text-gray-900">
                        $15.00
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-gray-100">
                <h2 className="text-lg font-playfair font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCreditCard /> <span>3. Payment Method</span>
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition ${
                      formData.paymentMethod === 'card'
                        ? 'border-black bg-gray-50/70'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        disabled
                        className="accent-black disabled:cursor-not-allowed"
                      />
                      <span className="text-sm font-poppins font-medium text-gray-900">
                        Credit / Debit Card
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Unavailable in this demo
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition ${
                      formData.paymentMethod === 'cod'
                        ? 'border-black bg-gray-50/70'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="accent-black"
                      />
                      <span className="text-sm font-poppins font-medium text-gray-900">
                        Cash on Delivery (Demo)
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Not sent to a store</span>
                  </label>
                </div>
                <p className="mt-4 text-xs font-poppins text-gray-500">
                  Demo checkout only: orders are not submitted to a store. Card payments require a secure payment provider.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-black text-white text-base font-poppins font-semibold rounded-xl shadow-lg hover:bg-neutral-800 transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                Create Demo Order • ${total.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-gray-100 sticky top-24 space-y-6">
              <h2 className="text-lg font-playfair font-bold text-gray-900">
                Order Summary ({cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.thumbnail || (item.images && item.images[0])}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-poppins font-medium text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-poppins text-gray-500">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <span className="text-xs font-poppins font-semibold text-gray-900">
                      ${(
                        (item.price || 0) *
                        (1 - Math.min(100, Math.max(0, item.discountPercentage || 0)) / 100) *
                        (item.quantity || 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-4 border-t border-gray-100">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-3 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (e.g. FASCO20)"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs font-poppins uppercase tracking-wider focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-poppins font-medium hover:bg-black transition"
                  >
                    Apply
                  </button>
                </form>
                {couponSuccess && (
                  <p className="text-xs text-green-600 font-poppins mt-2">
                    {couponSuccess}
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-red-500 font-poppins mt-2">
                    {couponError}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs font-poppins text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span className="font-playfair text-lg">Total</span>
                  <span className="font-playfair text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Guarantee badges */}
              <div className="pt-4 border-t border-gray-100 text-center text-gray-500 text-[11px] font-poppins">
                Demo checkout · no payment is processed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <AnimatePresence>
        {isOrderPlaced && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={36} />
              </div>

              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                Demo Order Created
              </h2>
              <p className="text-xs font-poppins text-gray-500 mb-4">
                This order was created for demonstration only. It has not been submitted to a store and no payment was processed.
              </p>

              <div className="bg-gray-50 p-4 rounded-xl text-left text-xs font-poppins space-y-1.5 mb-6 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-bold text-black">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Delivery:</span>
                  <span className="font-semibold text-black">
                    {estimatedDelivery}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-semibold text-black capitalize">
                    {formData.paymentMethod === 'card'
                      ? 'Credit Card'
                      : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping To:</span>
                  <span className="font-semibold text-black truncate max-w-[200px]">
                    {formData.address}, {formData.city}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shop"
                  className="flex-1 py-3 px-4 bg-black text-white text-xs font-poppins font-medium rounded-lg hover:bg-neutral-800 transition"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/"
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 text-xs font-poppins font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CheckoutPage;
