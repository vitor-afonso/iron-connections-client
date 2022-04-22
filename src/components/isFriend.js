//jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { Navigate, useParams } from 'react-router-dom';
import { getUser } from '../api';

export const IsFriend = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [allowedIds, setAllowedIds] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    (async () => {
      if (user) {
        let response = await getUser(user._id);
        setAllowedIds([user._id, ...response.data.followers.map((follower) => follower._id)]);
      }
    })();
  }, [user, userId]);

  if (allowedIds.length && !allowedIds.includes(userId)) {
    // If the user is not part of the allowedId, navigate to feed page
    return <Navigate to='/feed' />;
  } else {
    // If the user id is part of the allowedId, allow to see the page
    return children;
  }
};
