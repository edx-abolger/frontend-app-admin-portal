import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import StatusAlert from '../StatusAlert';
import NotFoundPage from '../NotFoundPage';
import ForbiddenPage from '../ForbiddenPage';

function renderErrorComponent(status, message) {
  const errorMessage = message || 'An unknown error has occured.';
  if (status === 404) {
    return <NotFoundPage />;
  }

  if (status === 403) {
    return <ForbiddenPage />;
  }

  return (
    <>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <div className="row mt-4">
        <div className="col">
          <h1>Error</h1>
          <StatusAlert
            alertType="danger"
            message={errorMessage}
          />
        </div>
      </div>
    </>
  );
}

const ErrorPage = (props) => {
  const { status, message } = props;
  return (
    <main role="main">
      <div className="container-fluid">
        {renderErrorComponent(status, message)}
      </div>
    </main>
  );
};

ErrorPage.propTypes = {
  status: PropTypes.number,
  message: PropTypes.string,
};

ErrorPage.defaultProps = {
  status: null,
  message: '',
};

export default ErrorPage;
