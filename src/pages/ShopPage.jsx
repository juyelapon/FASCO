import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { fetchProducts, fetchAllProducts, searchProducts, fetchProductsByCategory, fetchCategories } from '../utils/api';

const ITEMS_PER_PAGE = 12;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialCategories = initialCategory ? initialCategory.split(',').filter(Boolean) : [];
  const discounted = searchParams.get('discounted') === 'true';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const requestIdRef = useRef(0);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Sync URL params
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      const search = searchParams.get('search') || '';
      const category = searchParams.get('category') || '';
      const categories = category ? category.split(',').filter(Boolean) : [];
      setSearchQuery(search);
      setSelectedCategories(categories);
      setCurrentPage(1);
    });
    return () => {
      active = false;
    };
  }, [searchParams]);

  // Fetch products
  const loadProducts = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setProductError('');
    try {
      let data;
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const needsClientFiltering = Boolean(
        searchQuery ||
        selectedCategories.length > 0 ||
        discounted ||
        priceRange.min !== '' ||
        priceRange.max !== '' ||
        ratingFilter > 0 ||
        sortBy !== 'default'
      );

      if (searchQuery) {
        data = await searchProducts(searchQuery);
      } else if (selectedCategories.length === 1) {
        data = await fetchProductsByCategory(selectedCategories[0]);
      } else if (needsClientFiltering) {
        data = await fetchAllProducts(200);
      } else {
        data = await fetchProducts(ITEMS_PER_PAGE, skip);
      }

      let filtered = data.products || [];

      if (discounted) {
        filtered = filtered.filter((p) => p.discountPercentage > 0);
      }

      // Filter by multiple categories if needed (client-side)
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((p) => selectedCategories.includes(p.category));
      }

      // Price range filter
      if (priceRange.min !== '') {
        filtered = filtered.filter((p) => p.price >= Number(priceRange.min));
      }
      if (priceRange.max !== '') {
        filtered = filtered.filter((p) => p.price <= Number(priceRange.max));
      }

      // Rating filter
      if (ratingFilter > 0) {
        filtered = filtered.filter((p) => p.rating >= ratingFilter);
      }

      // Sorting
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-az':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }

      // Client-side pagination for search/category results
      if (needsClientFiltering) {
        if (requestId === requestIdRef.current) setTotalProducts(filtered.length);
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        filtered = filtered.slice(start, start + ITEMS_PER_PAGE);
      } else {
        if (requestId === requestIdRef.current) {
          setTotalProducts(data.total || filtered.length);
        }
      }

      if (requestId === requestIdRef.current) setProducts(filtered);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (requestId === requestIdRef.current) {
        setProducts([]);
        setTotalProducts(0);
        setProductError('Products could not be loaded. Please try again.');
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [searchQuery, selectedCategories, priceRange, ratingFilter, sortBy, currentPage, discounted]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadProducts();
    });
    return () => {
      active = false;
    };
  }, [loadProducts]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
    if (discounted) params.discounted = 'true';
    setSearchParams(params);
  };

  const handleCategoryToggle = (categorySlug) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const handleRatingFilter = (rating) => {
    setCurrentPage(1);
    setRatingFilter(ratingFilter === rating ? 0 : rating);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setRatingFilter(0);
    setSortBy('default');
    setCurrentPage(1);
    setSearchParams({});
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-gray-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-black text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    );
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || priceRange.min || priceRange.max || ratingFilter > 0 || discounted;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Banner */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-4"
          >
            Our Shop
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
            <span className="text-black font-medium">Shop</span>
          </motion.nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg font-poppins text-sm"
          >
            <FiFilter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showFilters || typeof window !== 'undefined') && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`lg:w-64 flex-shrink-0 space-y-6 ${
                  showFilters ? 'block' : 'hidden lg:block'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-playfair font-bold text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-red-500 hover:text-red-700 font-poppins transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-poppins font-semibold text-sm text-gray-900 mb-3">
                    Categories
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const slug = typeof cat === 'string' ? cat : cat.slug;
                      const name = typeof cat === 'string' ? cat : cat.name;
                      return (
                        <label
                          key={slug}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(slug)}
                            onChange={() => handleCategoryToggle(slug)}
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                          />
                          <span className="text-sm font-poppins text-gray-600 group-hover:text-black transition-colors capitalize">
                            {name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-poppins font-semibold text-sm text-gray-900 mb-3">
                    Price Range
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange((prev) => ({ ...prev, min: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-poppins focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <span className="text-gray-400 text-sm">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange((prev) => ({ ...prev, max: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-poppins focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-poppins font-semibold text-sm text-gray-900 mb-3">
                    Rating
                  </h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatingFilter(rating)}
                        className={`flex items-center gap-1 w-full p-2 rounded-lg text-sm transition-colors ${
                          ratingFilter === rating
                            ? 'bg-gray-100 ring-1 ring-black'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={14}
                              className={
                                i < rating ? 'text-yellow-400' : 'text-gray-200'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-gray-500 font-poppins ml-1">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Area */}
          <div className="flex-1">
            {/* Search & Sort Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <form onSubmit={handleSearch} className="relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchParams({});
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </form>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg font-poppins text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-poppins text-gray-500">
                Showing{' '}
                <span className="font-medium text-gray-900">
                  {products.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-gray-900">{totalProducts}</span>{' '}
                products
              </p>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : productError ? (
              <div className="py-20 text-center" role="alert">
                <p className="mb-4 font-poppins text-sm text-red-600">
                  {productError}
                </p>
                <button
                  type="button"
                  onClick={loadProducts}
                  className="rounded-lg bg-black px-6 py-3 font-poppins text-sm text-white transition hover:bg-gray-800"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-6xl mb-4">🔍</p>
                <h3 className="text-xl font-playfair font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 font-poppins text-sm mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-black text-white rounded-lg font-poppins text-sm hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && renderPagination()}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ShopPage;
