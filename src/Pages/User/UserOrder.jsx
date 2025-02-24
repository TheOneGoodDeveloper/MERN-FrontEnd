
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import ReviewModal from "../../Components/ReviewModal";
import GoBackButton from "../../Components/GoBackButton";
import { API_BASE_URL, getOrdersByUser, submitReview } from "../../api/apiServices";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData || !userData.id) {
          throw new Error("User not found");
        }
        const fetchedOrders = await getOrdersByUser(userData.id);
        setOrders(fetchedOrders);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="absolute top-2 mt-28 left-2">
        <GoBackButton />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-14">My Orders</h1>

      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [hover, setHover] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [ratedProducts, setRatedProducts] = useState({});

  const handleStarClick = (productId, rating) => {
    setSelectedProductId(productId);
    setRatings((prev) => ({ ...prev, [productId]: rating }));
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const rating = ratings[selectedProductId];
    const reviewText = reviews[selectedProductId];
    const orderId = order.razorpayOrderId;
    const productId = selectedProductId;

    console.log("Review Submitted:", { rating, reviewText });

    try {
      const response = await submitReview(orderId, productId, rating, reviewText);
      console.log("Review submitted successfully:", response);

      setRatedProducts((prev) => ({
        ...prev,
        [selectedProductId]: true,
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-w-[320px] max-w-4xl">
      <h2 className="text-lg font-semibold text-gray-800">
        Order ID: {order.razorpayOrderId}
      </h2>
      <p className="text-gray-600">Delivery Date: {order.deliveryDate}</p>
      <span
        className={`px-3 py-1 rounded-full text-white inline-block my-2 text-sm sm:text-base ${
          order.orderStatus === "Delivered"
            ? "bg-green-500"
            : order.orderStatus === "Shipped"
            ? "bg-blue-500"
            : "bg-yellow-500"
        }`}
      >
        {order.orderStatus}
      </span>

      <div className="mt-4">
        {Array.isArray(order.products) && order.products.length > 0 ? (
          order.products.map((product) => (
            <div
              key={product.productId._id}
              className="border flex flex-col sm:flex-row items-center sm:items-start p-4 rounded-lg mb-4 gap-6"
            >
              <img
                src={`${API_BASE_URL}${product.productDetails.images?.[0]}`}
                alt={product.name}
                className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-md"
              />
              <div className="w-full sm:w-2/3 text-center sm:text-left">
                <h3 className="text-md font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">Price: ₹{product.price?.toFixed(2)}</p>
                <p className="text-gray-600">Qty: {product.quantity}</p>
                <div className="flex justify-center sm:justify-start mt-2">
                  <span className="mr-2">
                    {ratedProducts[product.productId._id] ? "You Rated" : "Rate This Product:"}
                  </span>
                  {[...Array(5)].map((_, index) => {
                    const currentRating = index + 1;
                    return (
                      <FaStar
                        key={index}
                        className={`cursor-pointer text-xl ${
                          currentRating <= (hover[product.productId] || ratings[product.productId])
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(product.productId, currentRating)}
                        onMouseEnter={() => setHover((prev) => ({ ...prev, [product.productId]: currentRating }))}
                        onMouseLeave={() => setHover((prev) => ({ ...prev, [product.productId]: null }))}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No products in this order.</p>
        )}
      </div>

      {isModalOpen && selectedProductId && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          rating={ratings[selectedProductId] || 0}
          reviewText={reviews[selectedProductId] || ""}
          setReviewText={(text) =>
            setReviews((prev) => ({ ...prev, [selectedProductId]: text }))
          }
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default UserOrder;


// const OrderCard = ({ order }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [ratings, setRatings] = useState({}); // Store ratings per product

//   const [rating, setRating] = useState({});
//   const [reviews, setReviews] = useState({}); // Store reviews per product
//   const [hover, setHover] = useState(null);
//   const [reviewText, setReviewText] = useState("");
//   const [ratedProducts, setRatedProducts] = useState({}); // Track rated products
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   const handleSubmit = () => {
//     console.log("Review Submitted:", { rating, reviewText });
//     setReviews((prev) => ({ ...prev, [selectedProductId]: reviewText })); // Save per-product review
//     setRatedProducts((prev) => ({
//       ...prev,
//       [selectedProductId]: true, // Mark the product as rated
//     }));   
//     setIsModalOpen(false);
//   };
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 bg-red-200 min-w-[320px] max-w-4xl">
//       <h2 className="text-lg font-semibold text-gray-800">
//         Order ID: {order.razorpayOrderId}
//       </h2>
//       <p className="text-gray-600">Delivery Date: {order.deliveryDate}</p>
//       <span
//         className={`px-3 py-1 rounded-full text-white inline-block my-2 text-sm sm:text-base ${
//           order.orderStatus === "Delivered"
//             ? "bg-green-500"
//             : order.orderStatus === "Shipped"
//             ? "bg-blue-500"
//             : "bg-yellow-500"
//         }`}
//       >
//         {order.orderStatus}
//       </span>
//       <div className="mt-4">
//         {Array.isArray(order.products) && order.products.length > 0 ? (
//           order.products.map((product) => (
//             <div
//               key={product.id}
//               className="border flex flex-col sm:flex-row items-center sm:items-start p-4 rounded-lg mb-4 gap-6"
//             >
//               <img
//                 src={`${API_BASE_URL}${product.productId.images}`}
//                 alt={product.name}
//                 className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-md"
//               />
//               <div className="w-full sm:w-2/3 text-center sm:text-left">
//                 <h3 className="text-md font-semibold mt-2">{product.name}</h3>
//                 <p className="text-gray-600">Price: ₹{product.price?.toFixed(2)}</p>
//                 <p className="text-gray-600">Qty: {product.quantity}</p>
//                 <div className="flex justify-center sm:justify-start mt-2">
//                   <span className="mr-2">
//                     {ratedProducts[product.id] ? "You Rated" : "Rate This Product:"}
//                   </span>
//                  {[...Array(5)].map((_, index) => {
//                     const currentRating = index + 1;
//                     return (
//                       <FaStar
//                         key={index}
//                         className={`cursor-pointer text-xl ${
//                           currentRating <= (hover || rating)
//                             ? "text-yellow-500"
//                             : "text-gray-300"
//                         }`}
//                         onClick={() => {
//                           setSelectedProductId(product.id); // Set selected product
//                           setRatings((prev) => ({ ...prev, [product.id]: currentRating })); // Store per-product rating
//                           setIsModalOpen(true);
//                         }}
//                         onMouseEnter={() => setHover(currentRating)}
//                         onMouseLeave={() => setHover(null)}
//                       />
//                     );
//                   })} 
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-600 text-center">No products in this order.</p>
//         )}
//       </div>
//       {/* Rating Modal */}
//       {isModalOpen && selectedProductId && (
//   <ReviewModal
//     isOpen={isModalOpen}
//     onClose={() => setIsModalOpen(false)}
//     rating={ratings[selectedProductId] || 0}
//     reviewText={reviews[selectedProductId] || ""}
//     setReviewText={(text) =>
//       setReviews((prev) => ({ ...prev, [selectedProductId]: text }))
//     }
//     onSubmit={handleSubmit}
//   />
// )}
//     </div>
//   );
// };
// const OrderCard = ({ order }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [ratings, setRatings] = useState({}); // Store ratings per product
//   const [reviews, setReviews] = useState({}); // Store reviews per product
//   const [hover, setHover] = useState(null);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [ratedProducts, setRatedProducts] = useState({}); // Track rated products

//   const handleSubmit = () => {
//     console.log("Review Submitted:", {
//       rating: ratings[selectedProductId],
//       reviewText: reviews[selectedProductId],
//     });

//     setRatedProducts((prev) => ({
//       ...prev,
//       [selectedProductId]: true, // Mark product as rated
//     }));

//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 bg-red-200 min-w-[320px] max-w-4xl">
//       <h2 className="text-lg font-semibold text-gray-800">
//         Order ID: {order.razorpayOrderId}
//       </h2>
//       <p className="text-gray-600">Delivery Date: {order.deliveryDate}</p>
//       <span
//         className={`px-3 py-1 rounded-full text-white inline-block my-2 text-sm sm:text-base ${
//           order.orderStatus === "Delivered"
//             ? "bg-green-500"
//             : order.orderStatus === "Shipped"
//             ? "bg-blue-500"
//             : "bg-yellow-500"
//         }`}
//       >
//         {order.orderStatus}
//       </span>
//       <div className="mt-4">
//         {Array.isArray(order.products) && order.products.length > 0 ? (
//           order.products.map((product) => (
//             <div
//               key={product.id}
//               className="border flex flex-col sm:flex-row items-center sm:items-start p-4 rounded-lg mb-4 gap-6"
//             >
//               <img
//                 src={`${API_BASE_URL}${product.productId.images}`}
//                 alt={product.name}
//                 className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-md"
//               />
//               <div className="w-full sm:w-2/3 text-center sm:text-left">
//                 <h3 className="text-md font-semibold mt-2">{product.name}</h3>
//                 <p className="text-gray-600">Price: ₹{product.price?.toFixed(2)}</p>
//                 <p className="text-gray-600">Qty: {product.quantity}</p>
//                 <div className="flex justify-center sm:justify-start mt-2">
//                   <span className="mr-2">
//                     {ratedProducts[product.id] ? "You Rated" : "Rate This Product:"}
//                   </span>
//                   {[...Array(5)].map((_, index) => {
//                     const currentRating = index + 1;
//                     return (
//                       <FaStar
//                         key={index}
//                         className={`cursor-pointer text-xl ${
//                           currentRating <= (hover || ratings[product.id] || 0)
//                             ? "text-yellow-500"
//                             : "text-gray-300"
//                         }`}
//                         onClick={() => {
//                           setSelectedProductId(product.id); // Set selected product
//                           setRatings((prev) => ({ ...prev, [product.id]: currentRating })); // Store per-product rating
//                           setIsModalOpen(true);
//                         }}
//                         onMouseEnter={() => setHover(currentRating)}
//                         onMouseLeave={() => setHover(null)}
//                       />
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-600 text-center">No products in this order.</p>
//         )}
//       </div>

//       {/* Rating Modal */}
//       {isModalOpen && selectedProductId && (
//         <ReviewModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           rating={ratings[selectedProductId] || 0}
//           reviewText={reviews[selectedProductId] || ""}
//           setReviewText={(text) =>
//             setReviews((prev) => ({ ...prev, [selectedProductId]: text }))
//           }
//           onSubmit={handleSubmit}
//         />
//       )}
//     </div>
//   );
// };

// const OrderCard = ({ order }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [ratings, setRatings] = useState({}); // Store ratings per product
//   const [reviews, setReviews] = useState({}); // Store reviews per product
//   const [hover, setHover] = useState(null);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [ratedProducts, setRatedProducts] = useState({}); // Track rated products

//   const handleSubmit = () => {
//     console.log("Review Submitted:", {
//       rating: ratings[selectedProductId],
//       reviewText: reviews[selectedProductId],
//     });

//     setRatedProducts((prev) => ({
//       ...prev,
//       [selectedProductId]: true, // Mark product as rated
//     }));

//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 bg-red-200 min-w-[320px] max-w-4xl">
//       <h2 className="text-lg font-semibold text-gray-800">
//         Order ID: {order.razorpayOrderId}
//       </h2>
//       <p className="text-gray-600">Delivery Date: {order.deliveryDate}</p>
//       <span
//         className={`px-3 py-1 rounded-full text-white inline-block my-2 text-sm sm:text-base ${
//           order.orderStatus === "Delivered"
//             ? "bg-green-500"
//             : order.orderStatus === "Shipped"
//             ? "bg-blue-500"
//             : "bg-yellow-500"
//         }`}
//       >
//         {order.orderStatus}
//       </span>

//       <div className="mt-4">
//         {Array.isArray(order.products) && order.products.length > 0 ? (
//           order.products.map((product) => (
//             <div
//               key={product.id}
//               className="border flex flex-col sm:flex-row items-center sm:items-start p-4 rounded-lg mb-4 gap-6"
//             >
//               <img
//                 src={`${API_BASE_URL}${product.productId.images}`}
//                 alt={product.name}
//                 className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-md"
//               />
//               <div className="w-full sm:w-2/3 text-center sm:text-left">
//                 <h3 className="text-md font-semibold mt-2">{product.name}</h3>
//                 <p className="text-gray-600">Price: ₹{product.price?.toFixed(2)}</p>
//                 <p className="text-gray-600">Qty: {product.quantity}</p>
//                 <div className="flex justify-center sm:justify-start mt-2">
//                   <span className="mr-2">
//                     {ratedProducts[product.id] ? "You Rated" : "Rate This Product:"}
//                   </span>
//                   {[...Array(5)].map((_, index) => {
//                     const currentRating = index + 1;
//                     return (
//                       <FaStar
//                         key={index}
//                         className={`cursor-pointer text-xl ${
//                           currentRating <= (hover || ratings[product.id] || 0)
//                             ? "text-yellow-500"
//                             : "text-gray-300"
//                         }`}
//                         onClick={() => {
//                           setSelectedProductId(product.id); // Set selected product
//                           setRatings((prev) => ({
//                             ...prev,
//                             [product.id]: currentRating, // Store rating for this specific product
//                           }));
//                           setIsModalOpen(true);
//                         }}
//                         onMouseEnter={() => setHover(currentRating)}
//                         onMouseLeave={() => setHover(null)}
//                       />
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-600 text-center">No products in this order.</p>
//         )}
//       </div>

//       {/* Rating Modal */}
//       {isModalOpen && selectedProductId && (
//         <ReviewModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           rating={ratings[selectedProductId] || 0}
//           reviewText={reviews[selectedProductId] || ""}
//           setReviewText={(text) =>
//             setReviews((prev) => ({ ...prev, [selectedProductId]: text }))
//           }
//           onSubmit={handleSubmit}
//         />
//       )}
//     </div>
//   );
// };




//     <div className="bg-white rounded-lg shadow-md p-4 bg-red-200 w-58">
//       <h2 className="text-lg font-semibold text-gray-800">Order ID: {order.razorpayOrderId}</h2>
//       <p className="text-gray-600">Delivery Date: {order.deliveryDate}</p>
//       <span
//         className={`px-2 py-1 rounded-full text-white inline-block my-2 ${
//           order.orderStatus === "Delivered"
//             ? "bg-green-500"
//             : order.orderStatus === "Shipped"
//             ? "bg-blue-500"
//             : "bg-yellow-500"
//         }`}
//       >
//         {order.orderStatus}
//       </span>
// <div className="mt-4">
//   {Array.isArray(order.products) && order.products.length > 0 ? (
//     order.products.map((product) => (
//       <div key={product.id} className="border flex justify-between p-2 rounded-lg mb-2 gap-4">
//         <img
//           src={`${API_BASE_URL}${product.productId.images}`}
//           alt={product.name}
//           className="w-1/3 h-32 object-cover rounded-md"
//         />
//         <div className="w-2/3">
//         <h3 className="text-md font-semibold mt-2">{product.name}</h3>
//         <p className="text-gray-600">Price: ₹{product.price?.toFixed(2)}</p>
//         <p className="text-gray-600">Qty: {product.quantity}</p>
//         <div className="flex mt-2" >Give Ratings: 
//           {[...Array(5)].map((_, index) => {
//             const currentRating = index + 1;
//             return ( 
//               <FaStar 
//                 key={index}
//                 className={`cursor-pointer text-xl ${
//                   currentRating <= (hover || rating) ? "text-yellow-500" : "text-gray-300"
//                 }`}
//                 onClick={() => {
//                   setRating(currentRating);
//                   setIsModalOpen(true);
//                 }}
//                 onMouseEnter={() => setHover(currentRating)}
//                 onMouseLeave={() => setHover(null)}
//               />
//             );
//           })}
//         </div>
//       </div>
//       </div>
//     ))
//   ) : (
//     <p className="text-gray-600">No products in this order.</p>
//   )}
// </div>
// </div>

//  <div className="bg-white rounded-lg shadow-md p-6 bg-red-200 min-w-[320px] max-w-4xl">
//       <h2 className="text-lg font-semibold text-gray-800">
//         Order ID: {order.razorpayOrderId}
//       </h2>
//       <p className="text-gray-600">Delivery Date: {order.deliveryDate}</p>
//       <span
//         className={`px-3 py-1 rounded-full text-white inline-block my-2 text-sm sm:text-base ${
//           order.orderStatus === "Delivered"
//             ? "bg-green-500"
//             : order.orderStatus === "Shipped"
//             ? "bg-blue-500"
//             : "bg-yellow-500"
//         }`}
//       >
//         {order.orderStatus}
//       </span>
//       <div className="mt-4">
//         {Array.isArray(order.products) && order.products.length > 0 ? (
//           order.products.map((product) => (
//             <div
//               key={product.id}
//               className="border flex flex-col sm:flex-row items-center sm:items-start p-4 rounded-lg mb-4 gap-6"
//             >
//               <img
//                 src={`${API_BASE_URL}${product.productId.images}`}
//                 alt={product.name}
//                 className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-md"
//               />
//               <div className="w-full sm:w-2/3 text-center sm:text-left">
//                 <h3 className="text-md font-semibold mt-2">{product.name}</h3>
//                 <p className="text-gray-600">Price: ₹{product.price?.toFixed(2)}</p>
//                 <p className="text-gray-600">Qty: {product.quantity}</p>
//                 <div className="flex justify-center sm:justify-start mt-2">
//                   <span className="mr-2">
//     {ratedProducts[product.id] ? "You Rated" : "Rate This Product:"}
//   </span>
//                   {[...Array(5)].map((_, index) => {
//                     const currentRating = index + 1;
//                     return (
//                       <FaStar
//                         key={index}
//                         className={`cursor-pointer text-xl ${
//                           currentRating <= (hover || rating)
//                             ? "text-yellow-500"
//                             : "text-gray-300"
//                         }`}
//                         onClick={() => {
//                           setRating(currentRating);
//                           setIsModalOpen(true);
//                         }}
//                         onMouseEnter={() => setHover(currentRating)}
//                         onMouseLeave={() => setHover(null)}
//                       />
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-600 text-center">No products in this order.</p>
//         )}
//       </div>
      
//     {/* Rating Modal */}
//     <ReviewModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         rating={rating}
//         reviewText={reviewText}
//         setReviewText={setReviewText}
//         onSubmit={handleSubmit}
//       />
//     </div>

