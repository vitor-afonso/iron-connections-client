//jshint esversion:9
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { addFollower, getUser, getUsers } from "./../api";
import { NavLink } from "react-router-dom";
import { FilterUsers } from "../components/FilterUsers";

export const UsersPage = () => {

  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userFollowersId, setUserFollowersId] = useState([]);

  const getAllUsers = async () => {

    try {

      let response = await getUsers();
      setAllUsers(response.data);

    } catch (error) {

      console.log(
        "Something went wrong while trying to get users from DB =>",
        error
      );
    }
  };

  const getOneUser = async () => {

    try {

      let response = await getUser(user._id);
      setCurrentUser(response.data);
      setUserFollowersId(response.data.followers.map((user) => user._id));

    } catch (error) {

      console.log(
        "Something went wrong while trying to get user from DB =>",
        error
      );
    }
  };

  const handleAddFollower = async (followerId) => {

    if (userFollowersId.includes(followerId)) {
    return;
    }

    try {

      await addFollower(user._id, followerId);

      getOneUser();
      getAllUsers();

    } catch (error) {

      console.log("Something went wrong while trying add follower =>", error);
    }
  };

  useEffect(() => {

    if (user) {

      getAllUsers();
      getOneUser();
    }
    
  }, [user]);

  return (

    <div>

      <FilterUsers usersList={allUsers} currentUser={currentUser} userFollowersIds={userFollowersId} handleAddFollower={handleAddFollower}/>

    </div>
  );
};
