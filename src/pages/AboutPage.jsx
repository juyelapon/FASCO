import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAward, FiHeart, FiGlobe, FiTruck, FiArrowRight } from 'react-icons/fi';

const stats = [
  { label: 'Founded', value: '2019' },
  { label: 'Happy Customers', value: '150K+' },
  { label: 'Countries Shipped', value: '45+' },
  { label: 'Five-Star Reviews', value: '99.4%' },
];

const values = [
  {
    icon: <FiAward className="w-6 h-6 text-black" />,
    title: 'Artisanal Craftsmanship',
    description:
      'Every stitch and silhouette is engineered with precision, celebrating both heritage tailoring and avant-garde fashion.',
  },
  {
    icon: <FiHeart className="w-6 h-6 text-black" />,
    title: 'Sustainable Sourcing',
    description:
      'We partner with certified mills to ensure ethical labor, minimal environmental footprint, and zero toxic chemicals.',
  },
  {
    icon: <FiGlobe className="w-6 h-6 text-black" />,
    title: 'Global Community',
    description:
      'Fashion without borders. We celebrate diversity, empowering trendsetters across continents to express their unique identity.',
  },
  {
    icon: <FiTruck className="w-6 h-6 text-black" />,
    title: 'Express Delivery',
    description:
      'From our runway atelier straight to your doorstep with guaranteed prompt shipping and 30-day effortless returns.',
  },
];

const team = [
  {
    name: 'Elena Rostova',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
  },
  {
    name: 'Marcus Vance',
    role: 'Head of Haute Couture',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    name: 'Sophia Laurent',
    role: 'Sustainable Materials Lead',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
  },
];

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white"
    >
      {/* Hero Banner */}
      <section className="relative py-20 md:py-32 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
            alt="Fashion runway"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] text-gray-300 font-poppins mb-4"
          >
            Our Heritage & Vision
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold leading-tight mb-6"
          >
            Redefining Contemporary Elegance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-200 font-poppins max-w-2xl mx-auto leading-relaxed"
          >
            FASCO was established to bridge timeless sophistication with modern street luxury, empowering individuals to embody effortless confidence.
          </motion.p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-poppins font-semibold uppercase tracking-widest text-gray-500">
              The FASCO Story
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mt-2 mb-6">
              Crafted for Those Who Dare to Stand Out
            </h2>
            <div className="space-y-4 text-sm font-poppins text-gray-600 leading-relaxed">
              <p>
                Founded in 2019, FASCO emerged from a fundamental question: Why should timeless luxury be confined to exclusive fashion houses? We set out to democratize high-end tailoring, marrying classic European craftsmanship with cutting-edge silhouettes.
              </p>
              <p>
                From hand-selected cashmere to ethically sourced organic cotton, each garment in our collection is curated to transcend fast-fashion seasons. We believe clothing is an extension of personality — an armor of elegance in the modern world.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white text-xs font-poppins font-semibold rounded-lg hover:bg-neutral-800 transition"
              >
                <span>Explore The Shop</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
                alt="Model fashion 1"
                className="rounded-2xl shadow-md w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80"
                alt="Model fashion 2"
                className="rounded-2xl shadow-md w-full h-44 object-cover"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                alt="Model fashion 3"
                className="rounded-2xl shadow-md w-full h-44 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80"
                alt="Model fashion 4"
                className="rounded-2xl shadow-md w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-neutral-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl md:text-4xl font-playfair font-bold">
                {stat.value}
              </div>
              <div className="text-xs font-poppins text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-poppins font-semibold uppercase tracking-widest text-gray-500">
              What Defines Us
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mt-2">
              Our Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white p-7 rounded-2xl shadow-xs hover:shadow-md transition duration-300 border border-gray-100 flex flex-col items-start"
              >
                <div className="p-3 bg-gray-100 rounded-xl mb-4">{v.icon}</div>
                <h3 className="text-base font-playfair font-bold text-gray-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-xs font-poppins text-gray-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Team */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-poppins font-semibold uppercase tracking-widest text-gray-500">
            The Visionaries
          </span>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mt-2">
            Meet the Creative Minds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group text-center">
              <div className="overflow-hidden rounded-2xl mb-4 bg-gray-100 aspect-3/4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="text-lg font-playfair font-bold text-gray-900">
                {member.name}
              </h3>
              <p className="text-xs font-poppins text-gray-500 mt-0.5">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
