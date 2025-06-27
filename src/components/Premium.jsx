import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/constant";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/premium/verify`, {
        withCredentials: true,
      });
      setIsUserPremium(res.data?.isPremium || false);
    } catch (err) {
      console.error("Premium check failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = async (type) => {
    try {
      const order = await axios.post(
        `${API_URL}/payment/create`,
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, currency, notes, orderId, keyId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevChat",
        description: "Connect to other developers",
        order_id: orderId,

        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: { color: "#F37254" },
        handler: verifyPremiumUser, // callback after payment success
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err.message);
      alert("❌ Payment failed. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-20 text-gray-500 font-medium text-lg">
        Checking premium status...
      </div>
    );
  }

  if (isUserPremium) {
    return (
      <div className="flex justify-center text-2xl my-20 text-green-600 font-bold">
        🎉 You are already a Premium User!
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-11/12 mx-auto my-20">
      {/* Silver Card */}
      <div className="flex-1 bg-[#C0C0C0] text-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Silver Membership</h1>
        <ul className="text-base space-y-1 font-medium">
          <li>• Chat with other people</li>
          <li>• 100 connections per day</li>
          <li>• 3 months</li>
          <li>• Blue tick</li>
        </ul>
        <div className="flex justify-center pt-4">
          <button
            onClick={() => handlePayClick("silver")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition"
          >
            Pay Now ₹300
          </button>
        </div>
      </div>

      {/* Gold Card */}
      <div className="flex-1 bg-[#FFD700] text-black rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Gold Membership</h1>
        <ul className="text-base space-y-1 font-medium">
          <li>• Chat with other people</li>
          <li>• 1000 connections per day</li>
          <li>• 6 months</li>
          <li>• Blue tick</li>
        </ul>
        <div className="flex justify-center pt-4">
          <button
            onClick={() => handlePayClick("gold")}
            className="bg-black hover:bg-gray-900 text-white px-5 py-2 rounded-full transition"
          >
            Pay Now ₹700
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
