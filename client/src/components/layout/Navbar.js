import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link id="oppositeHover" to="/profiles">
          Developer Profiles
        </Link>
      </li>
      <li>
        <Link id="oppositeHover" to="/posts">
          Bulletin Board
        </Link>
      </li>
      <li>
        <Link id="oppositeHover" to="/dashboard">
          <i className="fas fa-user"></i>{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm" id="oppositeHover">
            Logout
          </span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developer Profiles</Link>
      </li>
      <li>
        <i className="fas fa-user-plus"></i>{" "}
        <Link to="/register">Register </Link>
      </li>
      <li>
        <i className="fas fa-sign-in-alt"></i> <Link to="/login">Login </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-primary">
      <h1>
        <Link to="/">
          <i className="fab fa-connectdevelop"></i> Connection
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
