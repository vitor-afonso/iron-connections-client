//jshint esversion:9

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export const FilterUsers = ({
  usersList,
  userFollowersIds,
  currentUser,
  handleAddFollower,
  handleRemoveFollower,
}) => {
  const [users, setUsers] = useState("");
  const [str, setStr] = useState("");

  useEffect(() => {
    let sortedUsersList = usersList.sort((a, b) =>
      a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1
    );

    if (str === "") {
      setUsers(sortedUsersList);
    } else {
      let filteredUsers = sortedUsersList.filter((user) =>
        user.username.toLowerCase().includes(str.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  }, [str, usersList, currentUser]);

  return (
    <div>
      {" "}
      FilterUsers:
      <label>
        <input
          type="text"
          name="search"
          value={str}
          onChange={(e) => setStr(e.target.value)}
        />
      </label>
      {users.length &&
        users.map((oneUser) => {
          return (
            <div key={oneUser._id}>
              {!oneUser._id.includes(currentUser._id) && (
                <>
                  <NavLink to={`/profile/${oneUser._id}`}>
                    <img
                      src={oneUser.imageUrl}
                      alt={oneUser.username}
                      style={{ width: "50px" }}
                    />
                  </NavLink>

                  <span>{oneUser.username}</span>

                  {currentUser._id !== oneUser._id &&
                  !userFollowersIds.includes(oneUser._id) ? (
                    <button onClick={() => handleAddFollower(oneUser._id)}>
                      Follow
                    </button>
                  ) : (
                    <button onClick={() => handleRemoveFollower(oneUser._id)}>
                      Unfollow
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};
