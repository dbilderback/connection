import React, { Fragment, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import Spinner from "../layout/Spinner";
import {
  getCurrentProfile,
  updTechnicalSkill,
  addTechnicalSkill,
  deleteTechnicalSkill,
} from "../../actions/profile";
import AddSkills from "./AddSkills";
import UpdateSkills from "./UpdateSkills";
import AddTechnicalSkill from "./TestAddSkills";

const initialState = {
  _id: "",
  skill: "",
  abilitylevel: "",
  yearsused: "",
  datelastused: "",
};

const TechnicalSkills = ({
  updTechnicalSkill,
  addTechnicalSkill,
  deleteTechnicalSkill,
  getCurrentProfile,
  profile: { profile, loading },
}) => {
  useEffect(
    () => {
      getCurrentProfile();
      setAddFormData(initialState);
    },
    [getCurrentProfile, loading],
    [initialState]
  );

  const [formData, setFormData] = useState({
    _id: "",
    skill: "",
    abilitylevel: "",
    yearsused: "",
    datelastused: "",
  });

  const [addFormData, setAddFormData] = useState(initialState);

  const {
    _id,
    skill,
    abilitylabel,
    abilitylevel,
    yearsused,
    datelastused,
  } = formData;

  const {
    add_id,
    addskill,
    addabilitylevel,
    addyearsused,
    adddatelastused,
  } = formData;

  const skillOptions = [
    ["Newbie", 1],
    ["Novice", 2],
    ["Competent", 3],
    ["Proficient", 4],
    ["Expert", 5],
  ];

  const onChange = e =>
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
    console.log(addFormData);
    addTechnicalSkill(addFormData).then(clearState);
  };

  const handleSave = (e, id) => {
    profile.technicalskills.map(row => {
      if (row._id === id) {
        const updFormData = {
          _id: row._id,
          skill: row.skill,
          abilitylevel: row.abilitylevel,
          yearsused: row.yearsused,
          datelastused: moment.utc(row.datelastused).format("YYYY-MM-DD"),
        };
        Object.assign(updFormData, { [e.target.name]: e.target.value });
        console.log(updFormData);
        updTechnicalSkill(updFormData, id);
      }
    });
  };

  const clearState = () => {
    console.log(formData);
    setFormData({ ...initialState });
    console.log(formData);
  };

  const handleDelete = id => {
    deleteTechnicalSkill(id);
  };

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Add or Update Technical Skills</h1>
          <p className="lead">
            <i className="fas fa-code-branch" /> Edit existing technical skills
            or add a new skill
          </p>
          <small>* = required field</small>

          <h2 className="text-primary">Skill Set</h2>

          <table id="skills" className="table center">
            <thead className="thead">
              <tr className="tr">
                <td className="td">Skill</td>
                <td className="td">Date Last Used</td>
                <td className="td">Years Used</td>
                <td className="td">Depth of Knowledge</td>
                <td className="td"></td>
              </tr>
            </thead>
            <tbody className="tbody">
              {profile.technicalskills.length > 0 ? (
                <Fragment>
                  {profile.technicalskills
                    .sort((a, b) => (a.datelastused < b.datelastused ? 1 : -1))
                    .map(skill => (
                      <tr key={skill._id}>
                        <td className="td" key={skill._id}>
                          <input
                            type="text"
                            placeholder="* Skill"
                            name="skill"
                            onChange={e => handleSave(e, skill._id)}
                            required
                            defaultValue={skill.skill}
                          />
                        </td>
                        <td className="td">
                          <input
                            type="date"
                            placeholder="* Year Last Used"
                            name="datelastused"
                            required
                            defaultValue={moment
                              .utc(skill.datelastused)
                              .format("YYYY-MM-DD")}
                            onChange={e => handleSave(e, skill._id)}
                          />
                        </td>
                        <td className="td">
                          <input
                            type="text"
                            placeholder="* Years Used"
                            name="yearsused"
                            required
                            defaultValue={skill.yearsused}
                            onChange={e => handleSave(e, skill._id)}
                          />
                        </td>
                        <td className="td">
                          <select
                            id={"abilitylabel"}
                            name={"abilitylevel"}
                            defaultValue={skill.abilitylevel}
                            onChange={e => handleSave(e, skill._id)}
                            className="form-control"
                          >
                            {skillOptions.map(option => {
                              return (
                                <option
                                  key={option[1]}
                                  value={option[1]}
                                  label={option[0]}
                                >
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="td">
                          <button
                            onClick={e => handleDelete(skill._id)}
                            className="btn btn-primary"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              ) : (
                <h4>No Skills Available</h4>
              )}
              <tr className="tr">
                <td className="td">
                  <input
                    type="text"
                    placeholder="* Skill"
                    name="skill"
                    required
                    value={addskill}
                    onChange={e => onChange(e)}
                  />
                </td>
                <td className="td">
                  <input
                    type="date"
                    name="datelastused"
                    required
                    value={adddatelastused}
                    onChange={e => onChange(e)}
                  />
                </td>
                <td className="td">
                  <input
                    type="text"
                    placeholder="Years Used"
                    name="yearsused"
                    required
                    value={addyearsused}
                    onChange={e => onChange(e)}
                  />
                </td>
                <td className="td">
                  <select
                    id={"abilitylabel"}
                    name={"abilitylevel"}
                    defaultValue={addabilitylevel}
                    onChange={e => onChange(e)}
                    className="form-control"
                  >
                    {skillOptions.map(option => {
                      return (
                        <option
                          key={option[1]}
                          value={option[1]}
                          label={option[0]}
                        >
                          {option}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="td">
                  <button
                    onClick={e => handleAdd(e)}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <Link className="btn btn-primary my-1" to="/dashboard">
            Go Back
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

TechnicalSkills.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  addTechnicalSkill: PropTypes.func.isRequired,
  updTechnicalSkill: PropTypes.func.isRequired,
  deleteTechnicalSkill: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  addTechnicalSkill,
  updTechnicalSkill,
  deleteTechnicalSkill,
})(TechnicalSkills);
