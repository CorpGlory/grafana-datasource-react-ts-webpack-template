import { TemplateQuery } from './types';

import {
  DataSourceApi,
  DataQueryRequest,
  DataSourceInstanceSettings,
} from '@grafana/ui';
import { TimeSeries } from '@grafana/data';

import * as _ from 'lodash';

export class TemplateDatasource extends DataSourceApi<TemplateQuery> {

  type: string;
  url: string;
  name: string;
  headers: any;
  withCredentials: boolean;

  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings) {
    super(instanceSettings);

    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;

    this.withCredentials = instanceSettings.withCredentials;
    const basicAuth = instanceSettings.basicAuth;
    if (_.isString(basicAuth) && !_.isEmpty(basicAuth)) {
      this.headers['Authorization'] = basicAuth;
    }
  }

  async query(options: DataQueryRequest<TemplateQuery>): Promise<{ data: TimeSeries[] }> {
    const targets = options.targets.filter(t => !t.hide);

    if (targets.length <= 0) {
      return { data: [] };
    }

    return {
      data: targets.map(t => ({
        target: t.refId,
        datapoints: [
          [3.14, options.range.from.valueOf()],
          [42, options.range.to.valueOf()]
        ]
      }))
    };
  }

  async testDatasource() {
    return {
      status: 'success',
      message: 'Data source is working'
    };
  }

  async metricFindQuery(query: string) {
    return [
      {
        text: 'Metric Name',
        value: 'metric_name'
      }
    ];
  }
}
