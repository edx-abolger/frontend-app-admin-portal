import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TableauReport from 'tableau-react-embed';
import LoadingMessage from '../LoadingMessage';
import ErrorPage from '../ErrorPage';
import { configuration } from '../../config';

import AnalyticsApiService from './data/service';
import NewRelicService from '../../data/services/NewRelicService';

// eslint-disable-next-line no-unused-vars
export default function AnalyticsCharts(enterpriseId) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch token
  useEffect(() => {
    setIsLoading(true);
    AnalyticsApiService.fetchTableauToken()
      .then((response) => {
        setIsLoading(false);
        setToken(response.data);
      })
      .catch((err) => {
        NewRelicService.logAPIErrorResponse(err);
        setIsLoading(false);
        setError(err);
      });
  }, []);
  let url = null;
  if (configuration.TABLEAU_URL) {
    url = `${configuration.TABLEAU_URL}/views/enterpriseadminanalytics/enroll_dash`;
  }
  const filters = {};
  const options = {
    height: 850,
    width: 1200,
  };
  if (isLoading) {
    return <LoadingMessage className="analytics" />;
  }
  if (error) {
    return (
      <ErrorPage
        status={error.response && error.response.status}
        message={error.message}
      />
    );
  }

  if (token && url) {
    return (
      <>
        <div>
          <TableauReport
            url={url}
            token={token}
            options={options}
            filters={filters}
          />
        </div>
      </>
    );
  }
  return null;
}

AnalyticsCharts.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  enterpriseId: PropTypes.string.isRequired,
};
