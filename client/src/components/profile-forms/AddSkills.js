import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Input from "../basic/Input";
import Button from "../basic/Button";
import { addTechnicalSkill } from "../../actions/profile";

const AddSkills = () => {
  const [formData, setFormData] = useState({
    skill: "",
    abilitylabel: "",
    abilitylevel: "",
    yearsused: "",
    datelastused: "",
  });

  const handleSave = () => {
    console.log(formData);
    addTechnicalSkill(formData);
  };

  const {
    skill,
    abilitylabel,
    abilitylevel,
    yearsused,
    datelastused,
  } = formData;

  const skillOptions = [
    ["Newbie", 1],
    ["Novice", 2],
    ["Competent", 3],
    ["Proficient", 4],
    ["Expert", 5],
  ];

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <td className="td">
        <input
          type="text"
          placeholder="* Skill"
          name="skill"
          required
          value={skill}
          onChange={e => onChange(e)}
        />
      </td>
      <td className="td">
        <input
          type="date"
          name="datelastused"
          required
          value={datelastused}
          onChange={e => onChange(e)}
        />
      </td>
      <td className="td">
        <input
          type="text"
          placeholder="Years Used"
          name="yearsused"
          required
          value={yearsused}
          onChange={e => onChange(e)}
        />
      </td>
      <td className="td">
        <select
          id={"abilitylabel"}
          name={"abilitylevel"}
          defaultValue={abilitylabel}
          onChange={e => onChange(e)}
          className="form-control"
        >
          {skillOptions.map(option => {
            return (
              <option key={option[1]} value={option[1]} label={option[0]}>
                {option}
              </option>
            );
          })}
        </select>
      </td>
      <td className="td">
        <button onClick={handleSave} className="btn btn-primary">
          Save
        </button>
      </td>
    </Fragment>
  );
};

AddSkills.propTypes = {
  addTechnicalSkill: PropTypes.func.isRequired,
};

export default connect(null, { addTechnicalSkill })(withRouter(AddSkills));
