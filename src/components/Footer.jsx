import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiPaypal, SiApplepay } from 'react-icons/si';

const catalogLinks = [
  { name: 'Women’s Jewelry', path: '/shop?category=womens-jewellery' },
  { name: 'Women’s Bags', path: '/shop?category=womens-bags' },
  { name: 'Men’s Watches', path: '/shop?category=mens-watches' },
  { name: 'Men’s Shoes', path: '/shop?category=mens-shoes' },
];

const aboutLinks = [
  { name: 'Our Story', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Shop', path: '/shop' },
];

const serviceLinks = [
  { name: 'FAQ', path: '/contact?topic=FAQ' },
  { name: 'Shipping', path: '/contact?topic=Shipping' },
  { name: 'Returns', path: '/contact?topic=Returns' },
  { name: 'Track Order', path: '/contact?topic=Order%20Tracking' },
];

const socialLinks = [
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold font-playfair tracking-wide">FASCO</h2>
            </Link>
            <p className="text-gray-400 text-sm font-poppins leading-relaxed mb-6 max-w-xs">
              Discover the latest trends in fashion. We bring you curated collections 
              from the world's finest designers, crafted for the modern lifestyle.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Catalog */}
          <div>
            <h3 className="text-base font-semibold font-poppins mb-5 tracking-wide">
              Catalog
            </h3>
            <ul className="space-y-3">
              {catalogLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm font-poppins text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h3 className="text-base font-semibold font-poppins mb-5 tracking-wide">
              About Us
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm font-poppins text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Service */}
          <div>
            <h3 className="text-base font-semibold font-poppins mb-5 tracking-wide">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm font-poppins text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-poppins text-gray-500 text-center md:text-left">
              © {currentYear} FASCO. All rights reserved.
            </p>
            <div className="flex items-center space-x-5">
              <SiVisa className="w-8 h-6 text-gray-500 hover:text-white transition-colors duration-200" title="Visa" />
              <SiMastercard className="w-8 h-6 text-gray-500 hover:text-white transition-colors duration-200" title="Mastercard" />
              <SiPaypal className="w-8 h-6 text-gray-500 hover:text-white transition-colors duration-200" title="PayPal" />
              <SiApplepay className="w-8 h-6 text-gray-500 hover:text-white transition-colors duration-200" title="Apple Pay" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
