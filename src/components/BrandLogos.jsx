import { motion } from 'framer-motion';

const brands = [
  { name: 'CHANEL', className: 'font-sans font-bold tracking-[0.2em] text-xl sm:text-2xl text-black' },
  { name: 'LOUIS VUITTON', className: 'font-serif tracking-[0.18em] text-lg sm:text-xl font-semibold text-black' },
  { name: 'PRADA', className: 'font-serif font-black tracking-[0.25em] text-xl sm:text-2xl text-black' },
  { name: 'Calvin Klein', className: 'font-sans font-normal tracking-[0.08em] text-lg sm:text-xl text-black' },
  { name: 'DENIM', className: 'font-sans font-black tracking-[0.35em] text-xl sm:text-2xl text-black' },
];

const BrandLogos = () => {
  return (
    <div className="bg-white py-8 sm:py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 md:gap-12"
        >
          {brands.map((brand, i) => (
            <div
              key={i}
              className="flex-1 min-w-[120px] flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <span className={brand.className}>{brand.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BrandLogos;
