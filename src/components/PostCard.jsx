import React from 'react'

const PostCard = ({post}) => {
  return (
    <div>
      <div className="border rounded-lg p-4 w-full max-w-md shadow">
      <p className="text-gray-800">post content</p>
      <p className="text-xs text-gray-500 mt-2">Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
    </div>
    </div>
  )
}

export default PostCard