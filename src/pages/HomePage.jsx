import { motion } from 'framer-motion';
import HeroSlider from '../components/HeroSlider';
import BrandLogos from '../components/BrandLogos';
import DealsOfTheMonth from '../components/DealsOfTheMonth';
import NewArrivals from '../components/NewArrivals';
import FeaturedProduct from '../components/FeaturedProduct';
import InstagramSection from '../components/InstagramSection';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSlider />
      <BrandLogos />
      <DealsOfTheMonth />
      <NewArrivals />
      <FeaturedProduct />
      <InstagramSection />
      <Testimonials />
      <Newsletter />
    </motion.div>
  );
};

export default HomePage;
