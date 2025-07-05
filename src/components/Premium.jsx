import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/constant";
import { FaCrown, FaCheckCircle, FaUserFriends } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

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
        handler: verifyPremiumUser, // payment success callback
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
      <div className="text-center my-24 text-lg text-gray-600 animate-pulse">
        ⏳ Checking your premium status...
      </div>
    );
  }

  if (isUserPremium) {
    return (
      <div className="flex flex-col items-center text-center my-24 space-y-4">
        <FaCheckCircle className="text-green-500 text-5xl" />
        <h2 className="text-2xl font-bold text-green-700">
          🎉 You are already a Premium User!
        </h2>
        <p className="text-gray-600">Enjoy unlimited features and networking.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-11/12 mx-auto my-16">
      {/* Silver Card */}
      <div className="flex-1 bg-gradient-to-tr from-gray-300 to-gray-100 text-gray-900 rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <FaUserFriends className="text-blue-600" /> Silver Membership
        </h1>
        <ul className="text-sm space-y-2 font-medium pl-4">
          <li>• Chat with other developers</li>
          <li>• 100 connections per day</li>
          <li>• 3 months validity</li>
          <li className="flex items-center gap-2">
            • Blue Tick <MdVerified className="text-blue-500" />
          </li>
        </ul>
        <div className="pt-4">
          <button
            onClick={() => handlePayClick("silver")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold transition"
          >
            Pay ₹300 Now
          </button>
        </div>
      </div>

      {/* Gold Card */}
      <div className="flex-1 bg-gradient-to-tr from-yellow-300 to-yellow-100 text-gray-900 rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <FaCrown className="text-yellow-700" /> Gold Membership
        </h1>
        <ul className="text-sm space-y-2 font-medium pl-4">
          <li>• Chat with all developers</li>
          <li>• 1000 connections per day</li>
          <li>• 6 months validity</li>
          <li className="flex items-center gap-2">
            • Blue Tick <MdVerified className="text-blue-500" />
          </li>
        </ul>
        <div className="pt-4">
          <button
            onClick={() => handlePayClick("gold")}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-full font-semibold transition"
          >
            Pay ₹700 Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;

