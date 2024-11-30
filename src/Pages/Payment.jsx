import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

import { fetchUserAddresses } from '../api/apiServices';
import { setDefaultAddress } from '../api/apiServices';
import { addAddress } from '../api/apiServices';
import { updateAddress } from '../api/apiServices';
import { removeAddress } from '../api/apiServices';


const Payment = ({ userId }) => {

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [upiID, setUpiID] = useState('');
  const { totalPrice, grandTotal } = location.state || {};



  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const [addresses, setAddresses] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // ID of the address being edited
  const [currentAddress, setCurrentAddress] = useState(null); // Address currently being edited
  const [newAddress, setNewAddress] = useState({
    street: '',
    area: '',
    landmark: '',
    city: '',
    
postalCode:'',
    state: '',
    country: 'India',
    isDefault: false,
  });

 


  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        let data = await fetchUserAddresses(userId);
        console.log("Data received from API:", data);
        setAddresses(data || []);
      } catch (error) {
        console.error("Error fetching addresses:", error.message);
        setAddresses([]); // Set empty array on error to maintain array structure
      }
    };

    fetchAddresses();
  }, [userId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setCurrentAddress((prev) => ({ ...prev, [name]: value })); // Update currentAddress
    } else if(isAddingNew) {
      setNewAddress((prev) => ({ ...prev, [name]: value })); // Update newAddress
    }
  };

  // Add a new address
  const handleAddNewAddress = async () => {
    try {
      const newAddr = await addAddress(userId, newAddress);
      setAddresses((addresses) =>{
        if (!Array.isArray(addresses)) {
          console.error("Current addresses state is not an array:", addresses);
          return [newAddr]; // Replace invalid state with a new array
        }
        return [...addresses, newAddr]; // Append the new address to the existing array
      });
      setShowForm(false); // Hide form after adding the address
      setNewAddress({
        street: '',
        area: '',
        landmark: '',
        city: '',
postalCode: '',
        state: '',
        country: 'India',
        isDefault: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };
  // Set an address as the default
  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      setAddresses((prev) =>{
        if (!Array.isArray(prev)) {
          // console.error("State is not an array:", prev);
          return prev; // Safeguard against invalid state
        }
        return prev.map((addr) => ({
          ...addr,
          isDefault: addr._id === addressId,
        }));
      });
      window.location.reload();
      // console.log("addresspage:",addressId)
    } catch (error) {
      console.error("Error setting default address:", error.message);
    }
  };


  const handleEditAddress = (address) => {
    setIsEditing(address);
    setCurrentAddress(address); 
    console.log("Current address for editing:", address); // Debug log

  };


//   const handleSave = () => {
//   console.log("Addresses before saving:", addresses);

//   if (!Array.isArray(addresses)) {
//     console.error("Addresses is not an array:", addresses);
//     return; // Exit the function to prevent the error
//   }

//   setAddresses(
//     addresses.map((addr) =>
//       addr._id === currentAddress._id ? currentAddress : addr
//     )
//   );
//   setIsEditing(null); // Exit edit mode
//   setCurrentAddress(null);
// };



  // Handle canceling the edit
  
  const handleSave = async () => {
    if (!currentAddress || !currentAddress._id) {
      console.error("Invalid address data:", currentAddress);
      return;
    }

    try {
      // Call API to update the address
      const updatedAddress = await updateAddress(userId, currentAddress._id, currentAddress);
  
      // Update the local state with the updated address
      setAddresses((prevAddresses) => {
        if (!Array.isArray(prevAddresses)) {
          console.error("Addresses state is invalid:", prevAddresses);
          return [];
        }
        return prevAddresses.map((addr) =>
          addr._id === updatedAddress._id ? updatedAddress : addr
        );
      });
      setIsEditing(null);
      // setCurrentAddress(null);

      console.log("Address updated successfully:", updatedAddress);
    } catch (error) {
      console.error("Error saving address:", error.message);
      // alert("Failed to save the address. Please try again.");
    }
  };
  
  
  
  
  const handleCancel = () => {
    setIsEditing(null);
    setCurrentAddress(null);
  };

  
  const handleRemoveAddress = async (addressId) => {
    try {
      await removeAddress(addressId);
      setAddresses((prevAddresses) => {
        if (!Array.isArray(prevAddresses)) {
          console.error("Invalid addresses state:", prevAddresses);
          return [];
        }
        return prevAddresses.filter((address) => address._id !== addressId);
      });
      console.log(`Address with ID ${addressId} removed successfully.`);
    } catch (error) {
      console.error("Error removing address:", error.message);
      alert("Failed to remove address. Please try again.");
    }
  };
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleUpiIDChange = (e) => {
    setUpiID(e.target.value);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 mt-14">Payment Details</h2>
        <h3 className="text-xl font-semibold mb-2">Select Shipping Address</h3>
        {/* List of addresses */}
        {addresses.addresses && addresses.addresses.map((address) => (
          <div key={address._id} 
          className={`border p-4 mb-4 ${address.isDefault ? 'border-blue-500' : 'border-gray-300'} rounded-lg`}>
            {isEditing === address && currentAddress ? (
              <form className="space-y-2 ">
                <input
                  type="text"
                  name="street"
                  value={currentAddress.street || ''}
                  onChange={handleInputChange}
                  placeholder="state"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="area"
                  value={currentAddress.area}
                  onChange={handleInputChange}
                  placeholder="area"
                  className="w-full border p-2 rounded"
                />
                   <input
                  type="text"
                  name="landmark"
                  value={currentAddress.landmark}
                  onChange={handleInputChange}
                  placeholder="Landmark(optional)"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="city"
                  value={currentAddress.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="state"
                  value={currentAddress.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={currentAddress.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="country"
                  value={currentAddress.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="w-full border p-2 rounded"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
            <div className="flex text-l justify-between">
              <div className='flex'>
                <p className="">{address.street}</p>
                <p>{address.area}, {address.city}, {address.state}</p>
                <p>{address.postalCode}, {address.country}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveAddress(address)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleSetDefaultAddress(address._id)}
                  className=" text-blue-500 hover:underline"
                >
                  {address.isDefault ? 'Default Address' : 'Set as Default'}
                </button>
              </div>
            </div>
            )}
          </div>
        ))}

        {/* Button to add new address */}
        <button
          onClick={() => setIsAddingNew(true)}
          className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Add New Address
        </button>

        {/* Form to add new address */}
        {isAddingNew && (
          <form onSubmit={handleAddNewAddress} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">New Address</h3>
            <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="street"
              value={newAddress.street}
              onChange={handleInputChange}
              placeholder="street"
              className="p-2 border rounded-lg"
            />
            <input
              type="text"
              name="area"
              value={newAddress.area}
              onChange={handleInputChange}
              placeholder="Area"
              className="p-2 border rounded-lg"
            />
            <input
              type="text"
              name="landmark"
              value={newAddress.landmark}
              onChange={handleInputChange}
              placeholder="Landmark (Optional)"
              className="p-2 border rounded-lg"
            />
            <input
              type="text"
              name="city"
              value={newAddress.city}
              onChange={handleInputChange}
              placeholder="City"
              className="p-2 border rounded-lg"
            />
            <input
              type="text"
              name="state"
              value={newAddress.state}
              onChange={handleInputChange}
              placeholder="State"
              className="p-2 border rounded-lg"
            />

            <input
              type="number"
              name="pin"
              value={newAddress.postalCode}
              onChange={handleInputChange}
              placeholder="PIN"
              className="p-2 border rounded-lg"
            />
            <input
              type="text"
              name="country"
              value={newAddress.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="p-2 border rounded-lg"
            />
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }))
                }
                className="form-checkbox h-5 w-5 text-blue-600 "
              />
              <span className="ml-2">Set as Default</span>
            </label>
            {/* <button
              onClick={handleAddNewAddress}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Submit Address
            </button> */}
          </div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
            >
              Save Address
            </button>
          </form>
        )}
        <div className=' flex flex-row  place-content-between'>
          <div className='bg-green-20 w-3/5'>
            <h3 className="text-xl font-semibold mt-6 mb-2">Payment Method</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={handlePaymentMethodChange}
                  className="mr-2"
                />
                <label htmlFor="creditCard">Credit/Debit Card</label>
              </div>

              {/* UPI */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={handlePaymentMethodChange}
                  className="mr-2"
                />
                <label htmlFor="debitCard">UPI(GPay/PhonePe)</label>
              </div>
              {/* PayPal */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                  className="mr-2"
                />
                <label htmlFor="paypal">PayPal</label>
              </div>

              {/* COD */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={selectedPaymentMethod === 'cod'}
                  onChange={handlePaymentMethodChange}
                  className="mr-2"
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
            </div>


            {/* Conditionally render payment details based on selected method */}
            {selectedPaymentMethod === 'card' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Card Details</h3>
                <input
                  type="text"
                  name="cardName"
                  placeholder="Card Holder Name"
                  value={cardDetails.cardName}
                  onChange={handleCardDetailsChange}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="Expiry Date (MM/YY)"
                  value={cardDetails.expiryDate}
                  onChange={handleCardDetailsChange}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}

            {selectedPaymentMethod === 'upi' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">UPI Details</h3>
                <input
                  type="text"
                  name="upiID"
                  placeholder="Enter UPI ID"
                  value={upiID}
                  onChange={handleUpiIDChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}

            {selectedPaymentMethod === 'paypal' && (
              <div className="mt-6">
                <p className="text-lg font-semibold">You will be redirected to PayPal for payment.</p>
              </div>
            )}


            <button
              type="submit"
              className="mt-6 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
            >
              Confirm Payment
            </button>
          </div>
          <div className='ml-0 w-2/5'>
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg text-right">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                {/* Total Items */}
                <div className="text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-0">
                  Order Detaills:
                </div>

                {/* Subtotal Price */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  Subtotal:{totalPrice}
                  {/* <span className="text-blue-600">₹{calculateTotalPrice()}</span> */}
                </h3>
              </div>

              {/* Shipping Fee */}
              <div className="flex md:flex-row justify-end items-center gap-2 mb-6">
                <p className="text-lg md:text-xl font-semibold text-gray-700 mb-1 ">Shipping Fee:</p>
                {/* <span className="text-lg md:text-xl font-semibold text-blue-600">₹{shippingFee}</span> */}
              </div>

              {/* Grand Total Price */}
              <div className="flex flex-col md:flex-row justify-end items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Grand Total:{grandTotal}
                  {/* <span className="text-blue-600">₹{calculateGrandTotal()}</span> */}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
