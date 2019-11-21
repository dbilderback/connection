import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import { updTechnicalSkill } from "../../actions/profile";

const UpdateSkills = React.memo(({ technicalskill, key }) => {
  const [formData, setFormData] = useState({
    skill: "",
    abilitylabel: "",
    abilitylevel: "",
    yearsused: "",
    datelastused: "",
  });

  console.log(technicalskill);
  const skillOptions = [
    ["Newbie", 1],
    ["Novice", 2],
    ["Competent", 3],
    ["Proficient", 4],
    ["Expert", 5],
  ];

  const test = (
    <Moment format="YYYY/MM/DD">
      {moment.utc(technicalskill.datelastused)}
    </Moment>
  );

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = id => {
    console.log(formData);
    console.log(id);
    technicalskill.map(row => {
      if (row._id === id) {
        console.log(row);
        return setFormData({ displayData: row });
      }
      console.log(formData);
    });

    //updTechnicalSkill(formData, technicalskill._id);
  };

  return (
    <Fragment>
      <tr key={technicalskill._id}>
        <td className="td" key={key}>
          <input
            type="text"
            placeholder="* Skill"
            name="skill"
            required
            defaultValue={technicalskill.skill}
            onChange={e => onChange(e)}
          />
        </td>
        <td className="td">
          <input
            type="date"
            placeholder="* Year Last Used"
            name="datelastused"
            required
            defaultValue={moment
              .utc(technicalskill.datelastused)
              .format("YYYY-MM-DD")}
            onChange={e => handleSave(technicalskill._id)}
          />
        </td>
        <td className="td">
          <input
            type="text"
            placeholder="* Years Used"
            name="yearsused"
            required
            defaultValue={technicalskill.yearsused}
            onChange={e => onChange(e)}
          />
        </td>
        <td className="td">
          <select
            id={"abilitylabel"}
            name={"abilitylevel"}
            defaultValue={technicalskill.abilitylabel}
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
      </tr>
    </Fragment>
  );
});

UpdateSkills.propTypes = {
  technicalskill: PropTypes.object.isRequired,
  updTechnicalSkill: PropTypes.func.isRequired,
};

export default connect(null, { updTechnicalSkill })(withRouter(UpdateSkills));
