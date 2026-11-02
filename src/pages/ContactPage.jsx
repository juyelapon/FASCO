import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: searchParams.get('topic') || '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white min-h-screen py-12 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-poppins font-semibold uppercase tracking-widest text-gray-500">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gray-900 mt-2 mb-4">
            We Would Love to Hear From You
          </h1>
          <p className="text-xs md:text-sm font-poppins text-gray-500">
            Have questions about an order, styling advice, or press inquiries? Our dedicated atelier team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 space-y-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900">
                Atelier Headquarters
              </h2>

              <div className="flex items-start gap-4 text-xs font-poppins text-gray-600">
                <div className="p-3 bg-white rounded-xl shadow-xs text-black mt-0.5">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                    Flagship Store
                  </h3>
                  <p>742 Fifth Avenue, 18th Floor</p>
                  <p>New York, NY 10019, USA</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs font-poppins text-gray-600">
                <div className="p-3 bg-white rounded-xl shadow-xs text-black mt-0.5">
                  <FiPhone size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                    Concierge Line
                  </h3>
                  <p>+1 (800) 555-FASCO</p>
                  <p className="text-gray-400">Mon - Fri: 9am - 7pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs font-poppins text-gray-600">
                <div className="p-3 bg-white rounded-xl shadow-xs text-black mt-0.5">
                  <FiMail size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                    Client Care Email
                  </h3>
                  <p>support@fasco-fashion.com</p>
                  <p>press@fasco-fashion.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs font-poppins text-gray-600">
                <div className="p-3 bg-white rounded-xl shadow-xs text-black mt-0.5">
                  <FiClock size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                    Customer Support Hours
                  </h3>
                  <p>24/7 Live Assistance for VIP Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-8 text-center bg-green-50 rounded-xl border border-green-200 space-y-3">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-playfair font-bold text-green-900">
                  Demo Message Prepared
                </h3>
                <p className="text-xs font-poppins text-green-700">
                  This preview is not connected to a support inbox, so your message was not sent.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-5 py-2 bg-black text-white text-xs font-poppins rounded-lg"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-poppins text-gray-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-poppins focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-poppins text-gray-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-poppins focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-poppins text-gray-600 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Product inquiry, sizing advice, etc."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-poppins focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-poppins text-gray-600 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us what you are looking for..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-poppins focus:outline-none focus:border-black resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-black text-white text-xs font-poppins font-semibold rounded-lg hover:bg-neutral-800 transition shadow-md cursor-pointer"
                >
                  <FiSend size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
