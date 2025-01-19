import axios from "axios";
import { API_URL } from "../utils/constant.js";
import { useEffect } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { addConnection} from "../utils/connectionSlice.js";
 
const Connections = () => {
  const connections = useSelector((store) => store.connections);
  console.log(connections)
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(API_URL + "/user/connection", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
      console.log(res);
    } catch (err) {
      // Handle Error Case
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) return <h1 className="text-center text-2xl"> No Connections Found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl">Connections</h1>

      {connections.filter((connection) => connection && connection._id).map((connection) => {
         const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection

        return (
          <div
            key={_id}
            className=" flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-4 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Connections;