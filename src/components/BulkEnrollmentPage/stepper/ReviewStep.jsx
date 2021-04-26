import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import {
  Card, Pagination, Table, IconButton, Icon
} from '@edx/paragon';
import { Delete } from '@edx/paragon/icons';
import { BulkEnrollContext, removeAction } from '../BulkEnrollmentContext';
import { REVIEW_TITLE } from './constants';


const EnrollmentListItem = ({ text, onClick }) => {
  return (
    <li><Card style={{}}>
      <Card.Body className='d-flex justify-content-between'>
        <Card.Text>
          {text}
        </Card.Text>
        <IconButton src={Delete} iconAs={Icon} alt='Delete' onClick={onClick} variant="primary" />

      </Card.Body>
    </Card>
    </li>
  )
}

const ReviewStep = () => {
  const { emails: [selectedEmails], courses: [selectedCourses] } = useContext(BulkEnrollContext);
  console.log(selectedCourses)
  return (
    <>
      <h2>{REVIEW_TITLE}</h2>
      <h3>Emails</h3>
      <ul>
        {selectedEmails.map((email) => <EnrollmentListItem key={email} text={email} onClick={dispatch(removeAction())} />)}
      </ul>
      <h3>Courses</h3>
      <ul>
        {selectedCourses.map((course) => <EnrollmentListItem key={course.key} text={course.title} onClick={dispatch(removeAction())} />)}
      </ul>
    </>
  );
};

export default ReviewStep;
