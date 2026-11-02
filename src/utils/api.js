const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = (limit = 20, skip = 0) =>
  fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  });

export const fetchProductById = (id) =>
  fetch(`${BASE_URL}/products/${id}`).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  });

export const fetchProductsByCategory = (category) =>
  fetch(`${BASE_URL}/products/category/${category}`).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  });

export const searchProducts = (query) =>
  fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  });

export const fetchCategories = () =>
  fetch(`${BASE_URL}/products/categories`).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  });

export const fetchAllProducts = (limit = 100) =>
  fetch(`${BASE_URL}/products?limit=${limit}`).then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  });
