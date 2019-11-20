import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ProfileTechnicalSkills from './ProfileTechnicalSkills'

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { firstname, lastname },
    technicalskills
  }
}) => {
  return (
    <div className='profile-about bg-light p-2'>
      {bio && (
        <Fragment>
          <h2 className='text-primary'>{firstname}'s Bio</h2>
          <p>{bio}</p>
          <div className='line' />
        </Fragment>
      )}
      <h2 className='text-primary'>Skill Set</h2>

      <table id='skills' className='table center'>
        <tbody>
          <tr>
            <th>Skill</th>
            <th>Date Last Used</th>
            <th>Years Used</th>
            <th colSpan='2'>Depth of Knowledge</th>
          </tr>
          {technicalskills.length > 0 ? (
            <Fragment>
              {technicalskills
                .sort((a, b) => (a.datelastused < b.datelastused ? 1 : -1))
                .map(skill => (
                  <ProfileTechnicalSkills key={skill._id} skill={skill} />
                ))}
            </Fragment>
          ) : (
            <h4>No Skills Available</h4>
          )}
        </tbody>
      </table>
    </div>
  )
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
}

export default ProfileAbout
