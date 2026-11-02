import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
    <p className="font-poppins text-sm font-semibold uppercase tracking-widest text-gray-400">
      404 · Page not found
    </p>
    <h1 className="mt-3 font-playfair text-3xl font-bold text-gray-900 sm:text-4xl">
      We couldn’t find that page
    </h1>
    <p className="mt-3 max-w-md font-poppins text-sm text-gray-500">
      The link may be incorrect or the page may have moved.
    </p>
    <div className="mt-8 flex gap-3">
      <Link
        to="/"
        className="rounded-lg border border-gray-300 px-5 py-3 font-poppins text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Home
      </Link>
      <Link
        to="/shop"
        className="rounded-lg bg-black px-5 py-3 font-poppins text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        Shop
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
