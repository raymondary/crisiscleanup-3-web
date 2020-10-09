import VueLog from '@dreipol/vue-log';
import * as Sentry from '@sentry/browser';
import Vue from 'vue';

const SentryLevelMap = {
  debug: Sentry.Severity.Debug,
  info: Sentry.Severity.Info,
  warn: Sentry.Severity.Info,
  error: Sentry.Severity.Error,
};

const SentryMiddleware = (result, { level, config }) => {
  Sentry.addBreadcrumb({
    category: result[0], // logger name
    message: result.toString ? result.toString() : '',
    level: SentryLevelMap[level] || Sentry.Severity.Critical,
    data: JSON.parse(JSON.stringify(config.context)),
  });
  return result;
};

export default ({ name, ...params }) => {
  if (!('log' in Vue)) {
    Vue.use(VueLog);
  }
  const opts = {
    name,
    middlewares: [
      (result) => {
        result.unshift(`[${name}] `);
        return result;
      },
      SentryMiddleware,
    ],
    ...params,
  };

  return Vue.log(opts);
};
