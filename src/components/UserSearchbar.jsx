import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useQueryClient } from "@tanstack/react-query";
import { Search, UserPlus, UserCheck, Loader2 } from "lucide-react";
import useMyProfile from "../hooks/useMyProfile";

const UserSearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const { data: myProfile } = useMyProfile();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        setShowResults(true);
        try {
          const res = await API.get(`/search/users?q=${query}`);
          setResults(res.data.data || []);
        } catch (err) {
          console.error("Search error:", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* 🔍 Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 text-[#0F82FF] animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-[#0F82FF] transition-colors" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border-none rounded-2xl leading-5 bg-gray-100 dark:bg-[#1A1B1F] text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0F82FF]/50 focus:bg-white dark:focus:bg-[#15171E] transition-all text-xs font-bold shadow-inner"
          placeholder="Find developers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
        />
      </div>

      {/* 📋 Results Dropdown */}
      {showResults && (
        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-[#15171E] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2F2F3A] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <ul className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
              {results.map((user) => {
                if (user._id === myProfile?._id) return null;
                return (
                  <li key={user._id}>
                    <Link
                      to={`/users/${user._id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#0F82FF]/10 transition-colors group"
                      onClick={() => setShowResults(false)}
                    >
                      <img
                        src={user.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`}
                        alt={user.firstName}
                        className="h-10 w-10 rounded-full border border-gray-200 dark:border-[#2F2F3A] object-cover group-hover:border-[#0F82FF] transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-[#0F82FF] transition-colors">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {user.about || "Developer"}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              {loading ? (
                <p className="text-xs font-bold animate-pulse">Searching the network...</p>
              ) : (
                <p className="text-xs">No developers found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;























