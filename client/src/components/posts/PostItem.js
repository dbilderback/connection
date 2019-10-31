import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deletePost, addLike, removeLike } from "../../actions/post";

const PostItem = ({
  auth,
  deletePost,
  addLike,
  removeLike,
  post: { _id, avatar, name, text, user, likes, comments, date },
  showActions,
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img src={avatar} alt="" className="round-img" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{text}</p>
      <p className="post-date">
        Posted On <Moment format="DD/MM/YYYY">{date}</Moment>
      </p>
      {showActions && (
        <Fragment>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addLike(_id)}
          >
            <i className="fas fa-thumbs-up"></i>{" "}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => removeLike(_id)}
          >
            <i className="fas fa-thumbs-down"></i>
          </button>
          <Link to={`/posts/${_id}`} className="btn btn-primary">
            Discussion{" "}
            {comments.length > 0 && (
              <span className="comment-count">{comments.length}</span>
            )}
          </Link>
          {!auth.loading && user === auth.user._id && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deletePost(_id)}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike }
)(PostItem);
