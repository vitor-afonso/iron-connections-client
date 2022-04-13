//jshint esversion:9

import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from '../context/auth.context';
import { NavLink } from "react-router-dom";

import { AddComment } from "./AddComment";
import { CommentCard } from "./CommentCard";

export const PostCard = ({post, refreshPosts}) => {

    const { user } = useContext(AuthContext);
    
    const toggleComments = useRef(null);

    let date = new Date(post.createdAt);
    let dateYear = date.getFullYear();
    let dateMonth = date.getMonth() + 1;
    let dateDay = date.getDate();
    let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

    let likesNum = post.likes.length; 
    
    useEffect(() => {

        toggleComments.current.style.display = "none";
        
    }, []);

    const showComments = () => {

        if (toggleComments.current.style.display === "none") {

            toggleComments.current.style.display = "block";

        } else {
            
            toggleComments.current.style.display = "none";
        }
    };

    return (

        <div style={{marginTop: "30px"}}>

            <div className="post-header">
                <small>
                    <img src={post.userId.imageUrl} alt="Author" style={{width: "30px"}}/>
                    <span> {post.userId.username} </span>
                    <span> {postDate} </span>
                    {post.userId._id === user._id && <NavLink to={`/post/${post._id}/edit`}><button>Edit</button></NavLink>}
                </small>

            </div>

            <p>{post.body}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="Post" style={{width: "300px"}}/>}

            <div>
                <span>💙 </span><span>{likesNum}</span>
                <span onClick={showComments}> <b>Comment</b> </span><span>{post.comments.length}</span>
                <span> <b>Share</b> </span>
            </div>

            <div className="comment-area" ref={toggleComments}>

                <AddComment post={post} refreshAllPosts={refreshPosts}/>

                {post.comments.map((oneComment) => {

                    return (
                        
                        <CommentCard comment={oneComment} key={oneComment._id}/>
                    
                    )
                })}

            </div>

            <hr/>
        </div>
    )
}
