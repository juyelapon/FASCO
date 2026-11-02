import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaCreditCard,
  FaShippingFast,
  FaGift,
  FaCheck,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

const sizes = ["S", "M", "L", "XL"];
const colors = [
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#6B7280" },
  { name: "Brown", value: "#92400E" },
];

const features = [
  { icon: FaTruck, title: "Free Delivery", desc: "For all orders over $50" },
  { icon: FaCreditCard, title: "Online Payment", desc: "Secure payment methods" },
  { icon: FaShippingFast, title: "Fast Delivery", desc: "2-3 business days" },
  { icon: FaGift, title: "Gift Cards", desc: "Available for all budgets" },
];

const FeaturedProduct = () => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddFeatured = () => {
    addToCart({
      id: `featured-suit-${selectedSize}-${selectedColor.slice(1)}`,
      title: `Peaky Blinders Suit (${selectedSize}, ${colors.find((color) => color.value === selectedColor)?.name || 'Black'})`,
      price: 100.0,
      thumbnail:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      category: "mens-shirts",
      size: selectedSize,
      color: selectedColor,
      discountPercentage: 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left side - Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
                alt="Peaky Blinders Collection"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Right side - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <span className="text-xs font-poppins uppercase tracking-widest text-gray-400 font-semibold">
              Women / Men Collection
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mt-2 mb-4">
              Peaky Blinders
            </h3>
            <p className="text-2xl md:text-3xl font-poppins font-semibold text-gray-900 mb-6">
              $100.00
            </p>
            <p className="text-gray-600 font-poppins text-sm md:text-base leading-relaxed mb-8">
              Embrace the iconic style of the roaring twenties with our Peaky
              Blinders collection. Crafted from premium fabrics with meticulous
              attention to detail, this piece brings timeless elegance to your
              wardrobe. Perfect for those who appreciate classic sophistication
              with a modern twist.
            </p>

            {/* Size selector */}
            <div className="mb-6">
              <h4 className="font-poppins text-xs uppercase tracking-wider font-semibold text-gray-700 mb-3">
                Size
              </h4>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`w-11 h-11 rounded-lg font-poppins text-sm font-medium flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                      selectedSize === size
                        ? "bg-black text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color selector */}
            <div className="mb-8">
              <h4 className="font-poppins text-xs uppercase tracking-wider font-semibold text-gray-700 mb-3">
                Color
              </h4>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    aria-label={color.name}
                    aria-pressed={selectedColor === color.value}
                    className={`w-9 h-9 rounded-full transition-transform duration-200 cursor-pointer ${
                      selectedColor === color.value
                        ? "ring-2 ring-offset-2 ring-black scale-110"
                        : "hover:scale-110 opacity-80"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddFeatured}
              className={`w-full sm:w-auto font-poppins text-sm font-semibold px-12 py-4 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:bg-neutral-800 active:scale-95"
              }`}
            >
              {added ? (
                <>
                  <FaCheck /> Added to Cart!
                </>
              ) : (
                "Add to Cart • $100.00"
              )}
            </button>
          </motion.div>
        </div>

        {/* Bottom features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-gray-100"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon className="text-xl text-black" />
                </div>
                <div>
                  <h4 className="font-poppins text-sm font-semibold text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="font-poppins text-xs text-gray-500 mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
