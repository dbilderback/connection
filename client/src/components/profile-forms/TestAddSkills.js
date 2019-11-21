import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addTechnicalSkill } from "../../actions/profile";

const AddTechnicalSkill = ({ addTechnicalSkill, history }) => {
  const [formData, setFormData] = useState({
    skill: "",
    abilitylabel: "",
    abilitylevel: "",
    yearsused: "",
    datelastused: "",
  });

  // const [toDateDisabled, toggleDisabled] = useState(false);

  const {
    skill,
    abilitylabel,
    abilitylevel,
    yearsused,
    datelastused,
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    console.log(formData);
    addTechnicalSkill(formData);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Add a Technical Skill</h1>
      <p className="lead">
        <i className="fas fa-code-branch" /> Add any Technical Skill
      </p>
      <small>* = required field</small>

      <h2 className="text-primary">Skill Set</h2>

      <table id="skills" className="table center">
        <tbody>
          <tr>
            <th>Skill</th>
            <th>Date Last Used</th>
            <th>Years Used</th>
            <th>Depth of Knowledge</th>
            <th>Level of Knowledge 1-5</th>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                placeholder="* Skill"
                name="skill"
                required
                value={skill}
                onChange={e => onChange(e)}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="* Ability"
                name="abilitylabel"
                required
                value={abilitylabel}
                onChange={e => onChange(e)}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Ability Level"
                name="abilitylevel"
                required
                value={abilitylevel}
                onChange={e => onChange(e)}
              />
            </td>
            <td>
              <input
                type="date"
                name="datelastused"
                required
                value={datelastused}
                onChange={e => onChange(e)}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Years Used"
                name="yearsused"
                required
                value={yearsused}
                onChange={e => onChange(e)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={e => handleAdd(e)} className="btn btn-primary">
        Save
      </button>
      <Link className="btn btn-primary my-1" to="/dashboard">
        Go Back
      </Link>
    </Fragment>
  );
};

AddTechnicalSkill.propTypes = {
  addTechnicalSkill: PropTypes.func.isRequired,
};

export default connect(null, { addTechnicalSkill })(
  withRouter(AddTechnicalSkill)
);
