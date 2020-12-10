import qs from 'query-string';

import apiClient from '../apiClient';
import { configuration } from '../../config';

class LmsApiService {
  static baseUrl = configuration.LMS_BASE_URL;

  static reportingConfigUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise_customer_reporting/`

  static providerConfigUrl = `${LmsApiService.baseUrl}/auth/saml/v0/provider_config/`;

  static providerDataUrl = `${LmsApiService.baseUrl}/auth/saml/v0/provider_data/`;

  static lmsIntegrationUrl = `${LmsApiService.baseUrl}/integrated_channels/api/v1`;

  static fetchCourseOutline(courseId) {
    const options = {
      course_id: courseId,
      username: 'staff',
      depth: 'all',
      nav_depth: 3,
      block_types_filter: 'course,chapter,sequential,vertical',
    };

    const outlineUrl = `${LmsApiService.baseUrl}/api/courses/v1/blocks/?${qs.stringify(options)}`;
    return apiClient.get(outlineUrl);
  }

  static fetchEnterpriseList(options) {
    const queryParams = {
      page: 1,
      page_size: 50,
      ...options,
    };
    const enterpriseListUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise-customer/dashboard_list/?${qs.stringify(queryParams)}`;
    return apiClient.get(enterpriseListUrl);
  }

  static fetchEnterpriseBySlug(slug) {
    return this.fetchEnterpriseList({ enterprise_slug: slug })
      // Because we expect only one enterprise by slug we return only the first result
      .then((response) => {
        const { data } = response;
        const results = data && data.results;
        return {
          data: results && results.length && results[0],
        };
      });
  }

  static requestCodes(options) {
    const postParams = {
      email: options.emailAddress,
      enterprise_name: options.enterpriseName,
      number_of_codes: options.numberOfCodes,
      notes: options.notes,
    };
    const requestCodesUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/request_codes`;
    return apiClient.post(requestCodesUrl, postParams, 'json');
  }

  static fetchReportingConfigs(uuid) {
    return apiClient.get(`${LmsApiService.reportingConfigUrl}?enterprise_customer=${uuid}`);
  }

  static postNewReportingConfig(formData) {
    return apiClient.post(LmsApiService.reportingConfigUrl, formData, 'json');
  }

  static updateReportingConfig(formData, uuid) {
    const reportingConfigUrl = `${LmsApiService.reportingConfigUrl}${uuid}/`;
    return apiClient.put(reportingConfigUrl, formData, 'json');
  }

  static deleteReportingConfig(uuid) {
    const reportingConfigUrl = `${LmsApiService.reportingConfigUrl}${uuid}/`;
    return apiClient.delete(reportingConfigUrl);
  }

  static getProviderConfig(uuid) {
    return apiClient.get(`${LmsApiService.providerConfigUrl}?enterprise_customer_uuid=${uuid}`);
  }

  static postNewProviderConfig(formData) {
    return apiClient.post(LmsApiService.providerConfigUrl, formData, 'json');
  }

  static updateProviderConfig(formData, pid) {
    const providerConfigUrl = `${LmsApiService.providerConfigUrl}${pid}/`;
    return apiClient.put(providerConfigUrl, formData, 'json');
  }

  static deleteProviderConfig(pid, uuid) {
    const providerConfigUrl = `${LmsApiService.providerConfigUrl}${pid}/?enterprise_customer_uuid=${uuid}`;
    return apiClient.delete(providerConfigUrl);
  }

  static getProviderData(uuid) {
    const providerDataUrl = `${LmsApiService.providerDataUrl}?enterprise_customer_uuid=${uuid}`;
    return apiClient.get(providerDataUrl);
  }

  static createProviderData(formData) {
    const providerDataUrl = `${LmsApiService.providerDataUrl}`;
    return apiClient.post(providerDataUrl, formData, 'json');
  }

  static deleteProviderData(pdid, uuid) {
    const providerDataUrl = `${LmsApiService.providerDataUrl}${pdid}/?enterprise_customer_uuid=${uuid}`;
    return apiClient.delete(providerDataUrl);
  }

  static fetchSamlConfigurations() {
    const samlConfigUrl = `${LmsApiService.baseUrl}/auth/saml/v0/saml_configuration/`;
    return apiClient.get(samlConfigUrl);
  }

  static fetchMoodleConfig(uuid) {
    return apiClient.get(`${LmsApiService.lmsIntegrationUrl}/moodle/configuration/?enterprise_customer=${uuid}`);
  }

  static postNewMoodleConfig(formData) {
    return apiClient.post(`${LmsApiService.lmsIntegrationUrl}/moodle/configuration/`, formData, 'json');
  }

  static updateMoodleConfig(formData, configId) {
    return apiClient.put(`${LmsApiService.lmsIntegrationUrl}/moodle/configuration/${configId}/`, formData, 'json');
  }
}

export default LmsApiService;
