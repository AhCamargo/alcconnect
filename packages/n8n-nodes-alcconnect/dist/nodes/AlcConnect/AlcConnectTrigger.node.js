"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlcConnectTrigger = void 0;
const axios_1 = __importDefault(require("axios"));
const n8n_workflow_1 = require("n8n-workflow");
class AlcConnectTrigger {
    constructor() {
        this.description = {
            displayName: "ALC Connect Trigger",
            name: "alcConnectTrigger",
            icon: "file:alcconnect-sem-nome.png",
            group: ["trigger"],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: "Starts a workflow when an ALC Connect event occurs.",
            defaults: {
                name: "ALC Connect Trigger",
            },
            inputs: [],
            outputs: ["main"],
            credentials: [
                {
                    name: "alcConnectApi",
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: "default",
                    httpMethod: "POST",
                    responseMode: "onReceived",
                    path: "webhook",
                },
            ],
            properties: [
                {
                    displayName: "Event",
                    name: "event",
                    type: "options",
                    noDataExpression: true,
                    options: [
                        {
                            name: "Incoming SMS",
                            value: "incoming_sms",
                            description: "Triggered when an SMS is received",
                        },
                        {
                            name: "Incoming Call",
                            value: "incoming_call",
                            description: "Triggered when a call is received",
                        },
                        {
                            name: "Incoming WhatsApp",
                            value: "incoming_whatsapp",
                            description: "Triggered when a WhatsApp message is received",
                        },
                    ],
                    default: "incoming_sms",
                    required: true,
                    description: "The event type to listen for",
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookUrl = this.getNodeWebhookUrl("default");
                    const event = this.getNodeParameter("event");
                    const credentials = await this.getCredentials("alcConnectApi");
                    const baseUrl = credentials.baseUrl.replace(/\/+$/, "");
                    try {
                        const { data } = await axios_1.default.get(`${baseUrl}/webhooks`, {
                            headers: { Authorization: `Bearer ${credentials.apiKey}` },
                            timeout: 10000,
                        });
                        const webhooks = Array.isArray(data.webhooks) ? data.webhooks : [];
                        const existing = webhooks.find((w) => w.url === webhookUrl && w.eventType === event && w.active);
                        if (existing) {
                            const webhookData = this.getWorkflowStaticData("node");
                            webhookData.webhookId = existing.id;
                            return true;
                        }
                        return false;
                    }
                    catch {
                        return false;
                    }
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl("default");
                    const event = this.getNodeParameter("event");
                    const credentials = await this.getCredentials("alcConnectApi");
                    const baseUrl = credentials.baseUrl.replace(/\/+$/, "");
                    try {
                        const { data } = await axios_1.default.post(`${baseUrl}/webhooks`, { url: webhookUrl, eventType: event }, {
                            headers: {
                                Authorization: `Bearer ${credentials.apiKey}`,
                                "Content-Type": "application/json",
                            },
                            timeout: 10000,
                        });
                        const webhook = data.webhook ?? data;
                        const webhookData = this.getWorkflowStaticData("node");
                        webhookData.webhookId = webhook.id;
                        return true;
                    }
                    catch (error) {
                        if (axios_1.default.isAxiosError(error)) {
                            const msg = error.response?.data?.error ?? error.message;
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to register webhook on ALC Connect: ${msg}`);
                        }
                        throw error;
                    }
                },
                async delete() {
                    const credentials = await this.getCredentials("alcConnectApi");
                    const baseUrl = credentials.baseUrl.replace(/\/+$/, "");
                    const webhookData = this.getWorkflowStaticData("node");
                    const webhookId = webhookData.webhookId;
                    if (!webhookId) {
                        return true;
                    }
                    try {
                        await axios_1.default.delete(`${baseUrl}/webhooks/${webhookId}`, {
                            headers: { Authorization: `Bearer ${credentials.apiKey}` },
                            timeout: 10000,
                        });
                    }
                    catch {
                        // If the webhook was already removed, ignore the error
                    }
                    delete webhookData.webhookId;
                    return true;
                },
            },
        };
    }
    async webhook() {
        const body = this.getBodyData();
        return {
            workflowData: [
                this.helpers.returnJsonArray(body),
            ],
        };
    }
}
exports.AlcConnectTrigger = AlcConnectTrigger;
//# sourceMappingURL=AlcConnectTrigger.node.js.map