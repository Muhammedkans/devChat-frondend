import React from 'react'

const UserData = ({user}) => {
   const {photoUrl,firstName,lastName,about,age,gender} = user;

  return (
    <div className='flex justify-center'>
    <div className="card bg-base-300 w-96 shadow-xl ">
  <figure>
    <img
      src={photoUrl}
      alt="photo" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{firstName} {lastName}</h2>
    
    {age && gender && <p>{age + "" + gender}</p> }
    <p>{about}</p>
    <div className="card-actions justify-center my-4">
      <button className="btn btn-primary">Ignore</button>
      <button className="btn btn-secondary">Interested</button>
    </div>
  </div>
</div>
</div>
  )
}

export default UserData;