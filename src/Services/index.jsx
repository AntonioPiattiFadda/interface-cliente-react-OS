const API = process.env.REACT_APP_PUBLIC_API_URL;
const VERSION = process.env.REACT_APP_PUBLIC_API_VERSION;

const endPoints = {
  //NOTE - Controlar porque no me fije bien como esta armada la base de datos
  auth: {
    login: `${API}/api/${VERSION}/auth/login`,
    profile: `${API}/api/${VERSION}/auth/profile`,
  },
  products: {
    getProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
    getAllProduct: `${API}/api/${VERSION}/products`,
    getProducts: (limit, offset) =>
      `${API}/api/${VERSION}/products?limit=${limit}&offset=${offset}`,
    addProducts: `${API}/api/${VERSION}/products`,
    updateProducts: (id) => `${API}/api/${VERSION}/products/${id}`,
    deleteProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
  },

  categories: {
    getCategoriesList: `${API}/api/${VERSION}/categories/`,
    getAllCategoryItems: `${API}/api/${VERSION}/categories/allItems`,

    getCategory: (id) => `${API}/api/${VERSION}/categories/${id}`,
    addCategory: `${API}/api/${VERSION}/categories`,
    updateCategory: (id) => `${API}/api/${VERSION}/categories/${id}`,
    deleteCategory: (id) => `${API}/api/${VERSION}/categories/${id}`,
  },

  files: {
    addImage: `${API}/api/${VERSION}/files/upload/`,
  },
};

export default endPoints;
