import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Icon, Modal } from '@edx/paragon';

import TextAreaAutoSize from '../TextAreaAutoSize';
import StatusAlert from '../StatusAlert';

import { validateEmailTemplateFields } from '../../utils';
import emailTemplate from './emailTemplate';
import NewRelicService from '../../data/services/NewRelicService';

class LicenseRemindModal extends React.Component {
  constructor(props) {
    super(props);

    this.errorMessageRef = React.createRef();
    this.modalRef = React.createRef();

    this.validateFormData = this.validateFormData.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
  }

  componentDidMount() {
    const { current: { firstFocusableElement } } = this.modalRef;

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
    this.props.initialize({
      'email-template-greeting': emailTemplate.greeting,
      'email-template-body': emailTemplate.body,
      'email-template-closing': emailTemplate.closing,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      submitFailed,
      submitSucceeded,
      onClose,
      error,
    } = this.props;

    const errorMessageRef = this.errorMessageRef && this.errorMessageRef.current;

    if (submitSucceeded && submitSucceeded !== prevProps.submitSucceeded) {
      onClose();
    }

    if (submitFailed && error !== prevProps.error && errorMessageRef) {
      // When there is an new error, focus on the error message status alert
      errorMessageRef.focus();
    }
  }

  validateFormData(formData) {
    const emailTemplateKey = 'email-template-body';

    /* eslint-disable no-underscore-dangle */
    // The 'subject' field is not required here
    const errors = validateEmailTemplateFields(formData, false);

    if (!formData[emailTemplateKey]) {
      const message = 'An email template is required.';
      errors[emailTemplateKey] = message;
      errors._error.push(message);
    }

    if (errors._error.length > 0) {
      throw new SubmissionError(errors);
    }
    /* eslint-enable no-underscore-dangle */
  }

  handleModalSubmit(formData) {
    const {
      isBulkRemind,
      user,
      subscriptionUUID,
      searchQuery,
      sendLicenseReminder,
      fetchSubscriptionDetails,
      fetchSubscriptionUsers,
      currentPage,
    } = this.props;
    // Validate form data
    this.validateFormData(formData);
    // Configure the options to send to the assignment reminder API endpoint
    const options = {
      greeting: formData['email-template-greeting'],
      closing: formData['email-template-closing'],
    };

    if (!isBulkRemind && user) {
      options.user_email = user.userEmail;
    }
    return sendLicenseReminder(options, subscriptionUUID, isBulkRemind)
      .then(async (response) => {
        await fetchSubscriptionUsers({ searchQuery, currentPage });
        await fetchSubscriptionDetails();
        this.props.onSuccess(response);
      })
      .catch((error) => {
        NewRelicService.logAPIErrorResponse(error);
        throw new SubmissionError({
          _error: [error.message],
        });
      });
    /* eslint-enable no-underscore-dangle */
  }

  renderBody() {
    const {
      isBulkRemind,
      submitFailed,
      user,
      pendingUsersCount,
    } = this.props;

    return (
      <>
        {submitFailed && this.renderErrorMessage()}
        <div className="assignment-details mb-4">
          <>
            {isBulkRemind ? (
              <p className="bulk-selected-codes">Unredeemed Licenses: {pendingUsersCount}</p>
            ) : (
              <p className="bulk-selected-codes">Email: {user.userEmail}</p>
            )}
          </>
        </div>
        <form onSubmit={e => e.preventDefault()}>
          <div className="mt-4">
            <h3>Email Template</h3>
            <Field
              id="email-template-greeting"
              name="email-template-greeting"
              component={TextAreaAutoSize}
              label="Customize Greeting"
            />
            <Field
              id="email-template-body"
              name="email-template-body"
              component={TextAreaAutoSize}
              label="Body"
              disabled
            />
            <Field
              id="email-template-closing"
              name="email-template-closing"
              component={TextAreaAutoSize}
              label="Customize Closing"
            />
          </div>
        </form>
      </>
    );
  }

  renderErrorMessage() {
    const { error } = this.props;

    return (
      <div
        ref={this.errorMessageRef}
        tabIndex="-1"
      >
        <StatusAlert
          alertType="danger"
          iconClassName="fa fa-times-circle"
          title="Unable to send reminder email"
          message={error.length > 1 ? (
            <ul className="m-0 pl-4">
              {error.map(message => <li key={message}>{message}</li>)}
            </ul>
          ) : (
            error[0]
          )}
        />
      </div>
    );
  }

  renderTitle() {
    return this.props.title;
  }

  render() {
    const {
      onClose,
      submitting,
      handleSubmit,
    } = this.props;
    return (
      <>
        <Modal
          ref={this.modalRef}
          dialogClassName="license-remind"
          title={this.renderTitle()}
          body={this.renderBody()}
          buttons={[
            <Button
              key="license-remind-submit-btn"
              disabled={submitting}
              className="license-remind-save-btn btn-primary"
              onClick={handleSubmit(this.handleModalSubmit)}
            >
              <>
                {submitting && <Icon className="fa fa-spinner fa-spin mr-2" />}
                {'Send Reminder'}
              </>
            </Button>,
          ]}
          closeText="Cancel"
          onClose={onClose}
          open
        />
      </>
    );
  }
}
LicenseRemindModal.defaultProps = {
  error: null,
  isBulkRemind: false,
  user: {},
  pendingUsersCount: 0,
  searchQuery: null,
  currentPage: null,
};
LicenseRemindModal.propTypes = {
  // props From redux-form
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitSucceeded: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  initialize: PropTypes.func.isRequired,
  // custom props
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  sendLicenseReminder: PropTypes.func.isRequired,
  isBulkRemind: PropTypes.bool,
  pendingUsersCount: PropTypes.number,
  user: PropTypes.shape({
    userEmail: PropTypes.string,
  }),
  fetchSubscriptionDetails: PropTypes.func.isRequired,
  fetchSubscriptionUsers: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  currentPage: PropTypes.number,
  subscriptionUUID: PropTypes.string.isRequired,
};
export default reduxForm({
  form: 'license-reminder-modal-form',
})(LicenseRemindModal);
