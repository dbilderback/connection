import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment'
import Slider from '../layout/Slider'

const ProfileTechnicalSkills = ({
  skill: { skill, abilitylabel, abilitylevel, yearsused, datelastused }
}) => {
  return (
    <tr>
      <td>{skill}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{moment.utc(datelastused)}</Moment>
      </td>
      <td>{yearsused}</td>
      <td>
        <Slider
          type='secondary'
          value={abilitylevel}
          min={1}
          max={5}
          className='slider'
        />
      </td>
      <td>{abilitylabel}</td>
    </tr>
  )
}

ProfileTechnicalSkills.propTypes = {
  skill: PropTypes.object.isRequired
}

export default ProfileTechnicalSkills
