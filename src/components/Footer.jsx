import React from 'react'

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-[#0B0E13] text-white border-t border-[#1F2937] backdrop-blur-md shadow-[0_-2px_15px_#0f82ff33] z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-400"
          >
            <path d="M22.672 15.226l-2.432.811..."></path>
          </svg>
          <p className="text-gray-400">
            © {new Date().getFullYear()} devChat. All rights reserved.
          </p>
        </div>

        <div className="flex gap-4">
          {/* Twitter */}
          <a href="#" className="hover:text-blue-400 transition">
            <svg
              width="22"
              height="22"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="text-gray-400 hover:text-blue-400"
            >
              <path d="M24 4.557c-.883.392-1.832..."></path>
            </svg>
          </a>

          {/* YouTube */}
          <a href="#" className="hover:text-red-500 transition">
            <svg
              width="22"
              height="22"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="text-gray-400 hover:text-red-500"
            >
              <path d="M19.615 3.184c-3.604..."></path>
            </svg>
          </a>

          {/* Facebook */}
          <a href="#" className="hover:text-blue-600 transition">
            <svg
              width="22"
              height="22"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="text-gray-400 hover:text-blue-600"
            >
              <path d="M9 8h-3v4h3v12h5v..."></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
