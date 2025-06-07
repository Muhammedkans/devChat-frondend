

import React from 'react'
import FeedPosts from './FeedPosts'
import DeveloperSuggestions from './DeveloperSuggestions' // add this right sidebar component
import FeedSidebar from './FeedSidebar'


const FeedPage = () => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-1/4 border-r p-4">
        <FeedSidebar />
      </div>

      {/* Feed Center */}
      <div className="w-2/4 p-4">
        <FeedPosts />
      </div>

      {/* Right Sidebar (Suggestions) */}
      <div className="w-1/4 border-l p-4">
        <DeveloperSuggestions />
      </div>
    </div>
  )
}

export default FeedPage
