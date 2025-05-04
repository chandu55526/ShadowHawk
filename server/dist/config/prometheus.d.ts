import promClient from "prom-client";
export declare const prometheusClient: {
    register: promClient.Registry<"text/plain; version=0.0.4; charset=utf-8">;
    threatDetections: promClient.Counter<"type">;
    activeUsers: promClient.Gauge<string>;
    requestDuration: promClient.Histogram<"method" | "route" | "status_code">;
};
