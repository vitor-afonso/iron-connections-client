//jshint esversion:9

import { useContext } from "react";
import { AuthContext } from '../context/auth.context';



export const PostCard = ({post}) => {

    const { user } = useContext(AuthContext);

    let date = new Date(post.createdAt);
    let dateYear = date.getFullYear();
    let dateMonth = date.getMonth() + 1;
    let dateDay = date.getDate();
    let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

    let likesNum = post.likes.length; 
    
    /* console.log('onePost =>', post);
    console.log('user in session =>', user); */


  return (

    <div style={{marginTop: "30px"}}>

        <div id="post-header">
            <small>
                <img src={post.userId.imageUrl} alt="Author" style={{width: "30px"}}/>
                <span> {post.userId.username} </span>
                <span> {postDate} </span>
                {post.userId._id === user._id && <button>Edit</button>}
            </small>

        </div>

        <h5>{post.title}</h5>
        <p>{post.body}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="Post" style={{width: "200px"}}/>}

        <div>
            <span>💙 </span><span>{likesNum}</span>
            <span> <b>Comment</b> </span><span>{post.comments.length}</span>
            <span> <b>Share</b> </span>
        </div>
        <hr/>
    </div>
  )
}
