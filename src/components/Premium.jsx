import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/constant";
import { Crown, Check, ShieldCheck, Zap, Sparkles } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0F82FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#0F82FF] font-bold tracking-widest uppercase text-xs">Verifying Status...</p>
        </div>
      </div>
    );
  }

  if (isUserPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white/70 dark:bg-[#10131A]/80 border border-white/20 dark:border-[#2F2F3A] p-12 rounded-[3rem] shadow-2xl backdrop-blur-3xl text-center max-w-lg w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-orange-400/20 to-transparent opacity-50 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 animate-pulse">
              <Crown className="w-12 h-12 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Welcome to the Elite Club!
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              You have unlocked all premium features. Enjoy limitless networking and exclusive tools.
            </p>
            <div className="px-6 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full font-bold text-sm border border-yellow-200 dark:border-yellow-700/50 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Official Crown Member
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16 pb-32">
      {/* 🏷️ Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] mb-6 filter drop-shadow-sm">
          Upgrade Your Experience
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          Unlock exclusive tools, stand out with a verified badge, and connect with more developers than ever before.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
        {/* 🥈 Silver Card */} //
        <div className="flex-1 w-full max-w-md bg-white/70 dark:bg-[#10131A]/80 border border-white/20 dark:border-[#2F2F3A] rounded-[2.5rem] p-8 shadow-xl backdrop-blur-3xl relative hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-100 dark:bg-[#1A1B1F] rounded-2xl">
              <Zap className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Silver</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Starter Pack</p>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-black text-gray-900 dark:text-white">₹300</span>
            <span className="text-gray-500 font-medium"> / 3 months</span>
          </div>

          <hr className="border-gray-100 dark:border-[#2F2F3A] mb-8" />

          <ul className="space-y-4 mb-8">
            {[
              "Chat with other developers",
              "100 connections per day",
              "3 months validity",
              "Standard Blue Tick"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handlePayClick("silver")}
            className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-[#1A1B1F] text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-[#2F2F3A] transition-all active:scale-95"
          >
            Get Silver
          </button>
        </div>

        {/* 👑 Gold Card */}
        <div className="flex-1 w-full max-w-md bg-gradient-to-br from-[#1a1a1a] to-black border border-yellow-500/30 rounded-[2.5rem] p-1 shadow-2xl relative transform hover:scale-[1.02] transition-transform duration-300 order-first lg:order-none z-10">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-yellow-500/20 blur-3xl -z-10 rounded-[2.5rem]"></div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-[10px] uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
            Most Popular
          </div>

          <div className="bg-[#10131A] rounded-[2.4rem] p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
                <Crown className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Gold Elite</h3>
                <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Maximum Power</p>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-black text-white">₹700</span>
              <span className="text-gray-400 font-medium"> / 6 months</span>
            </div>

            <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 mb-8">
              <p className="text-xs text-yellow-500 font-bold text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Save 15% vs Silver
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Chat with ALL developers",
                "1000 connections per day",
                "6 months validity",
                "Premium Gold Badge",
                "Priority Support",
                "Early Access Features"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-medium">
                  <div className="p-1 rounded-full bg-yellow-500 text-black">
                    <Check className="w-3 h-3" strokeWidth={4} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayClick("gold")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:brightness-110 transition-all active:scale-95"
            >
              Get Gold Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;

