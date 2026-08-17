const client = require("prom-client");

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
    name: "devflow_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"]
});

const httpRequestDuration = new client.Histogram({
    name: "devflow_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route"],
    buckets: [0.1, 0.5, 1, 2, 5]
});

module.exports = {
    client,
    httpRequestsTotal,
    httpRequestDuration
};