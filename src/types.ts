import { DataQuery } from '@grafana/ui';

export interface TemplateQuery extends DataQuery {
  format?: string;
};
