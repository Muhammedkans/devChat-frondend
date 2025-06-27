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

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setAbout(profile.about || "");
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
    mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      about: about.trim(),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="about" className="block text-sm font-medium mb-1">About</label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="4"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
