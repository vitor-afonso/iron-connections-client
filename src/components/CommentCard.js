//jshint esversion:9

export const CommentCard = ({comment}) => {

    let date = new Date(comment.createdAt);
    let dateYear = date.getFullYear();
    let dateMonth = date.getMonth() + 1;
    let dateDay = date.getDate();
    let commentDate = `${dateDay}-${dateMonth}-${dateYear}`;
    
  return (
    <div className="CommentCard">
        <div className="comment-header">
                
            <small>
                <img src={comment.userId.imageUrl} alt="Author" style={{width: "30px"}}/>
                <span> {comment.userId.username} </span>
                <span> {commentDate} </span>
            </small>

        </div>

        <p>{comment.content}</p>

        {comment.imageUrl && <img src={comment.imageUrl} alt="Comment" style={{width: "300px"}}/>}

    </div>
  )
}
