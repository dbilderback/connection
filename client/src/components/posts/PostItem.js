import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";

const PostItem = ({ auth, post: { avatar, name, text, user } }) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <img src={avatar} alt="" className="round-img" />
      <h4>{name}</h4>
    </div>
    <div>
      <p>{text}</p>
    </div>
  </div>
);

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PostItem);
