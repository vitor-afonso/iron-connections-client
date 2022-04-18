//jshint esversion:9

import { NavLink } from "react-router-dom";
import { deleteComment } from './../api';
import { useContext } from "react";
import { AuthContext } from '../context/auth.context';

export const CommentCard = ({postId, comment, refreshAllPosts, refreshProfileUser}) => {

  const { user } = useContext(AuthContext);

  let date = new Date(comment.createdAt);
  let dateYear = date.getFullYear();
  let dateMonth = date.getMonth() + 1;
  let dateDay = date.getDate();
  let commentDate = `${dateDay}-${dateMonth}-${dateYear}`;

  const handleDelete = async () => {

    await deleteComment(postId, comment._id);
    refreshAllPosts();
    refreshProfileUser();
  };
    
  return (

    <div className="CommentCard">
      <div className="comment-header">
              
        <small>
        <NavLink to={`/profile/${comment.userId._id}`} style={{display: "inline-block"}}> <img src={comment.userId.imageUrl} alt="Author" style={{width: "30px"}}/> </NavLink>
            <span> {comment.userId.username} </span>
            <span> {commentDate} </span>
        </small>

      </div>

      <p>{comment.content}</p> {user._id === comment.userId._id && <button onClick={handleDelete} >Delete</button>}

      {comment.imageUrl && <img src={comment.imageUrl} alt="Comment" style={{width: "300px"}}/>}

    </div>
  )
}
