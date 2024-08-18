const promClient = require("prom-client");

const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

const errorCounter = new promClient.Counter({
    name: "app_errors_total",
    help: "Total number of errors encountered in the application",
    labelNames: ["error_name", "route"]
});

register.registerMetric(errorCounter);

module.exports = { register, errorCounter};
