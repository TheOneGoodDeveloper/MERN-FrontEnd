// import axios from "axios";

// // Base URL for your API

// export const API_BASE_URL = "http://192.168.20.5:3000/";


// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Retrieve token from local storage
//     const token = localStorage.getItem('authToken');

//     // If token exists, set it in the Authorization header
//     if (token) {
//       config.headers['Authorization'] = token;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// axiosInstance.interceptors.response.use(
//   async(response) => {
//     // Check if the token is expired (statusCode === 700)
//     if (response.data?.statusCode === 700) {
//       // Remove the auth token from local storage
//       await localStorage.removeItem('authToken');
//       await localStorage.removeItem('userData');
      
//       // Redirect the user to the login page
//       window.location.href = "/Signin";
//     }

//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

import axios from "axios";

// Base URL for your API

// export const API_BASE_URL = "http://192.168.20.7:3000/";

// export const API_BASE_URL = "http://192.168.31.166:3000/";
// export const API_BASE_URL = "http://172.20.10.7:3000/"; 
export const API_BASE_URL = "http://192.168.109.90:3000/";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response) => {
    try {
      if (response.data?.statusCode === 700 || response.status === 500) {
        // Remove the auth token from local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth-token')
        localStorage.removeItem('userData');
        alert("Session expired. Please log in again.");
        window.location.href = "/Signin";
      }
    } catch (error) {
      console.error("Error handling token expiration:", error);
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);



// User Registration function
export const registerUser = async (userData) => {
  try {
    // console.log(userData);
    const response = await axiosInstance.post(`${API_BASE_URL}register`, userData);
    return response.data; // Return the response data (e.g., user details)

  } catch (error) {
    throw error.response ? error.response.data.message : new Error("Registration failed");
  }
};


// Login.......
export const userLogin = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}login`, userData);
    console.log(response);
    return response.data; // Return the response data (e.g., user details)
  } catch (error) {
    return error.response ? error.response.data : new Error("Sign In Failed");
  }
}

// get All Categories(admin)
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}getAllCategory`); // Fetches categories from the backend
    return response.data; // Assuming the categories are in response.data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getAdminCategories = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}admin/getAllCategory`); // Fetches categories from the backend
    return response.data; // Assuming the categories are in response.data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// fetch all userlist(admin)
export const getAllUser = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}admin/getAllUsers`); // Fetches categories from the backend
    return response.data; // Assuming the categories are in response.data
  } catch (error) {
    console.error('Error fetching AllUserslist:', error);
    throw error;
  }
};


export const deleteUser = async (userId) => {
  console.log(userId)
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}admin/deleteuser`
      , { userId });
    return response.data;
  } catch (error) {
    console.error('Error deleting UserDetails:', error);
    throw error; // You can handle this error in your component
  }
};


// fetch all vendorlist(admin)
export const getAllVendors = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}admin/listVendors`); // Fetches categories from the backend
    return response.data; // Assuming the categories are in response.data
  } catch (error) {
    console.error('Error fetching AllVendorlist:', error);
    throw error;
  }
};

// fetch all Products List(admin)
export const getallProducts = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}admin/productList`); // Fetches categories from the backend
    return response.data; // Assuming the categories are in response.data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


// Vendor Product Creation
export const createProduct = async (formData) => {
  try {
      const response = await axiosInstance.post(`${API_BASE_URL}vendor/productCreate`, formData,
    );
      return response.data; // Return the created product data
  } catch (error) {
      console.error("Error creating product:", error);
      throw error; // Rethrow the error for handling in the component
  }
};

export const editProduct = async (id, formData) => {
  try {
    // Create a new FormData object
    const productData = new FormData();

    // Append product fields to FormData
    for (const key in formData) {
      productData.append(key, formData[key]);
    }

    // Append the 'id'
    productData.append('id', id);

    // Send the POST request
    const response = await axiosInstance.post(`${API_BASE_URL}admin/updateProduct`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure image upload is handled correctly
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};


export const EditProduct = async ( productData) => { // Make sure to pass the id as an argument
  try {
      // Log FormData entries for debugging
   

      const response = await axiosInstance.post(`${API_BASE_URL}vendor/updateProduct`, productData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      return response.data;
  } catch (error) {
      console.error('Error updating product:', error);
      throw error;
  }
};


// Product Delete
export const deleteProduct = async (productId) => {
  console.log(productId)
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}admin/deleteproduct`
      , { productId });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error; // You can handle this error in your component
  }
};


// CategoryCreation
export const createCategory = async (formData) => {
  console.log("Category Name with sub Category",formData)

  const response = await axiosInstance.post(`${API_BASE_URL}admin/categoryCreate`, formData);
  return response.data;
};

// Get all Products List For Vendor
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}vendor/productList`); // Fetches categories from the backend
    return response.data; // Assuming the categories are in response.data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


// Delete Category
export const deleteCategory = async (id) => {
  console.log(id)
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}admin/deleteCategory`
      , { id });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error; // You can handle this error in your component
  }
};


// Update  or Edit Category

export const editCategory = async (categoryId, formData) => {
  try {
    // Append categoryId to formData
    formData.append('categoryId', categoryId);

    const response = await axiosInstance.post(`${API_BASE_URL}admin/updateCategory`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // This ensures FormData is handled correctly
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error updating category:', error);
    throw error; // Rethrow the error to be handled in the component
  }
};

// api.js or within the component

export const fetchSubcategories = async (categoryId) => {
  console.log("category id",categoryId)
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}vendor/subCategorybyCategory`,{categoryId});
    console.log("SubCategory",response)
    return response;

  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return []; // Return an empty array on failure
  }
};


// Get User Address by UserID
// export const fetchUserAddresses = async (userId) => {
//   try {
//     // Make a POST request to the API with the userId
//     const response = await axiosInstance.get(`${API_BASE_URL}getAddressesByUser`, { userId });
    
//     // Return the data directly, as Axios handles JSON parsing
//     return response;
//   } catch (error) {
//     console.error("Failed to fetch addresses:", error);
//     throw new Error("Failed to fetch addresses");
//   }
// };

export const fetchUserAddresses = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}getAddressesByUser`, { userId });
    console.log("api::::",response)
    return response.data; // Assuming the addresses are inside 'data' property
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    throw new Error("Failed to fetch addresses");
  }
};


export const addAddress = async (userId, address) => {
  const response = await axiosInstance.post(`${API_BASE_URL}addAddress`, address);
  return response.data;
};

export const setDefaultAddress = async ( addressId) => {
  console.log("apiservices:",addressId)
  try {
    const url = `${API_BASE_URL}setDefault`;

    // Send addressId in the request body
    const response = await axiosInstance.put(url, {
      addressId: addressId, // or simply `addressId` in ES6 shorthand
    });

    return response.data;
  } catch (error) {
    console.error("Error setting default address:", error.message);
    throw error;
  }
};


// Update/Edit address
export const updateAddress = async (userId, addressId, updatedAddress) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}updateAddress`,
      updatedAddress, // Axios automatically converts JS object to JSON
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // Return the updated address from the API
  } catch (error) {
    console.error("Error updating address:", error.message);
    throw error;
  }
};

// Remove address
export const removeAddress = async (addressId) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}deleteAddress`, {
      data: { addressId }, // Pass addressId in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error removing address:", error.message);
    throw error;
  }
};



//  Get User Profile for User Side

export const getUserProfile = async (UserId) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}getUserById`, {
      UserId, // Pass categoryName as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update or Edit User Profile

export const updateUserProfile = async (user) => {
    try {
      const payload = {
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        // defaultAddress: user.addresses.find((address) => address.isDefault),
      };
    const response = await axiosInstance.put(`${API_BASE_URL}updateUser`, payload);
    return response; // Ensure this matches the backend response format
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Get All Products



//  User Side Product list by Category
export const getProductsByCategory = async (categoryName) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}productByCategory`,{
      params: { category: categoryName }, // Pass categoryName as a query parameter
    });
    return response; // Return the response
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};



//  // Get products by gender
export const getProductsByGender = async (gender) => {
  // console.log("..............",gender)
  try {
    // console.log("Fetching products from:", `${API_BASE_URL}productByGender`);

    const response = await axios.get(`${API_BASE_URL}productByGender`, {
      params: { gender }, // Pass gender as a query parameter
    });
    return response;
  } catch (error) {
    console.error('Error fetching products by gender:', error);
    throw error;
  }
};



export const getProductById = async (productId) => {
  try {
    console.log(productId)
    const response = await axiosInstance.get(`${API_BASE_URL}getProductById`, {
      params: { productId }, // Pass categoryName as a query parameter
    });
    return response; // Return the response
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};

// Product Detail get by Id
export const getProductsById = async (productId) => {
  try {
    console.log(productId)
    const response = await axiosInstance.get(`${API_BASE_URL}vendor/getProductById`, {
      params: { productId }, // Pass categoryName as a query parameter
    });
    return response; // Return the response
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};


// newly added products
export const newlyaddedProducts = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}latestProducts`);
    return response.data; // Assuming the categories are in response.data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


// Vendor Registration
export const registerVendor = async (finalvendorData) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}vendor/registerVendor`, finalvendorData); // Axios will automatically stringify the vendorData
    console.log(response)
    return response.data; // Axios automatically parses JSON responses
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
};


// VendorLogin

export const vendorLogin = async (vendor) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}vendor/loginVendor`, vendor);
    return response.data; // Return the data from the response
  } catch (error) {
    // Handle error response
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request
      throw new Error(error.message);
    }
  }
};

// Product Detail get by Id
export const getVendorById = async (vendorId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}getVendorById`, {
      params: { vendorId }, // Pass categoryName as a query parameter
    });
    return response; // Return the response
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};


// Get all Cart items For Admin
export const getCartItems = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}listCartById`); // Fetches categories from the backend
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}deleteCart`,{id});
    return response.data;
  } catch (error) {
    console.error('Failed to delete item:', error);
    throw error;
  }
};


// Vendor status update in admin side
export const updateVendorStatus = (vendorId, status) => {
  const vendorStatus = {
    vendorId,
    status,
  };
  const response = axiosInstance.post(`${API_BASE_URL}admin/approveVendor`,vendorStatus);
  return response;
};

export const addCart = async (cartItem) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}createcart`, cartItem); // Change endpoint based on your API
    return response.data; // Return response data
  } catch (error) {
    throw error.response?.data || 'Error adding to cart';
  }
};

// Apply Filters
export const applyFilters = async (filters ,categoryId) => {
  try {
    console.log("before send",filters)
    const response = await axios.post(`${API_BASE_URL}filterProducts`, {
      // params: {
        categoryId,
        // categoryName, // Add categoryName to the params
        ...filters, // Spread the filter options
      // }
    });
    // const response = await axios.post(`${API_BASE_URL}filterProducts`, filters);
    return response.data;
  } catch (error) {
    console.error('Error applying filters:', error);
    throw error;
  }
};



export const getProductsByFilter = async ({ category, gender }) => {
  try {
    const params = {};
    if (category) params.category = category;
    if (gender) params.gender = gender;
    const response = await axios.get(`${API_BASE_URL}filterProducts`, { params });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw new Error("Failed to fetch products");
  }
};

// Shop By Price
export const getProductsByPrice = async (price) => {
  try {
    console.log("before send",price)
    const response = await axios.post(`${API_BASE_URL}productByPrice`, { price });
    return response; // Return the response data to be handled by the calling function
  } catch (error) {
    console.error('Error sending price:', error);
    throw error; // Re-throw the error to be handled in the component
  }
};

// Update Cart Item
export const updateCartItemQuantity = async (cartId,id, quantity) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}updateCart`, {cartId, id,quantity });
    if (response.status === 200) {
      console.log("Cart updated:", response.data);
    } else {
      throw new Error("Failed to update cart item");
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
  }
};

// order creation
export const confirmPayment = async (cartId,address_id) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}createOrder`, { cartId ,address_id});
    return response.data; // Return the response data to the caller
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
};
//  Admin Get Orders
export const getallOrders = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}admin/allOrders`);
    console.log(response)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order details');
  }
};


export const fetchDashboardStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}admin/profile`);
    return response.data; // Return the API response data
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error; // Throw error for the component to handle
  }
};

export const getOrdersByUser = async (userId) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}getOrdersByUser`,{userId});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order details');
  }
};




export const addToWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}createWishlist`, {
      productId,
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Error adding to wishlist:", error.response?.data || error.message);
    throw error;
  }
};
export const removeFromWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}removeWishlistItem`, { productId });
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};


export const fetchuserWishlist = async (userId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}getWishlist`,{userId});
      console.log("2121212121",response.data.wishlist)
      return response.data.wishlist;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  }

// export const checkIfWishlisted = async (productId) => {
//   try {
//     const response = await axiosInstance.get(`${API_BASE_URL}checkWishlist`,{productId});
//     return response.data;
//   } catch (error) {
//     console.error("Error checking wishlist status:", error);
//     return false;
//   }
// };

export const checkIfWishlisted = async (productId) => {
  try {
    // const token = localStorage.getItem("authToken"); // Get auth token
    // if (!token) return false; // If not logged in, return false

    const response = await axiosInstance.get(`${API_BASE_URL}checkWishlist`,{productId})
   

    return response.data.isWishlisted; // Ensure API returns { isWishlisted: true/false }
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false; // Return false on error
  }
};

export const submitReview = async (orderId, productId, rating, reviewText) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}createreview`, {
      orderId,
      productId,
      rating,
      reviewText,
    });
    return response.data; // return the response data
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};


