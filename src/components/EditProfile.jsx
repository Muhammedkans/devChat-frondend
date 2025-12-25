import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useMyProfile from "../hooks/useMyProfile";

const EditProfile = () => {
  const { data: profile, isLoading } = useMyProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [careerStatus, setCareerStatus] = useState("Just Exploring");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setAbout(profile.about || "");
      setCareerStatus(profile.careerStatus || "Just Exploring");
    }
  }, [profile]);

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: (updatedData) => API.patch("/profile/edit", updatedData),
    onSuccess: () => {
      toast.success("✅ Profile updated successfully!");
      queryClient.invalidateQueries(["my-profile"]);
      navigate("/profile");
    },
    onError: () => {
      toast.error("❌ Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedAbout = about.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedAbout) {
      toast.error("All fields are required.");
      return;
    }

    mutate({
      firstName: trimmedFirst,
      lastName: trimmedLast,
      about: trimmedAbout,
      careerStatus
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-blue-600 font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-purple-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ✏️ Edit Profile
        </h2>

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-700">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-700">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="careerStatus" className="block text-sm font-medium mb-1 text-gray-700">
            Career Status
          </label>
          <select
            id="careerStatus"
            value={careerStatus}
            onChange={(e) => setCareerStatus(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          >
            <option value="Just Exploring">Just Exploring 🧐</option>
            <option value="Open to Work">Open to Work ✅</option>
            <option value="Hiring">Hiring 💼</option>
            <option value="Mentoring">Mentoring 🤝</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="about" className="block text-sm font-medium mb-1 text-gray-700">
            About
          </label>
          <textarea
            id="about"
            rows="4"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

