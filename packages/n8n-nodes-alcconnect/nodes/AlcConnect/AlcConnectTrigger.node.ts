import axios from "axios";
import type {
  IDataObject,
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

export class AlcConnectTrigger implements INodeType {
  description: INodeTypeDescription = {
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

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl("default") as string;
        const event = this.getNodeParameter("event") as string;
        const credentials = await this.getCredentials("alcConnectApi");
        const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, "");

        try {
          const { data } = await axios.get(`${baseUrl}/webhooks`, {
            headers: { Authorization: `Bearer ${credentials.apiKey}` },
            timeout: 10_000,
          });

          const webhooks = Array.isArray(data.webhooks) ? data.webhooks : [];
          const existing = webhooks.find(
            (w: { url: string; eventType: string; active: boolean }) =>
              w.url === webhookUrl && w.eventType === event && w.active,
          );

          if (existing) {
            const webhookData = this.getWorkflowStaticData("node");
            webhookData.webhookId = existing.id;
            return true;
          }

          return false;
        } catch {
          return false;
        }
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl("default") as string;
        const event = this.getNodeParameter("event") as string;
        const credentials = await this.getCredentials("alcConnectApi");
        const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, "");

        try {
          const { data } = await axios.post(
            `${baseUrl}/webhooks`,
            { url: webhookUrl, eventType: event },
            {
              headers: {
                Authorization: `Bearer ${credentials.apiKey}`,
                "Content-Type": "application/json",
              },
              timeout: 10_000,
            },
          );

          const webhook = data.webhook ?? data;
          const webhookData = this.getWorkflowStaticData("node");
          webhookData.webhookId = webhook.id;
          return true;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.error ?? error.message;
            throw new NodeOperationError(
              this.getNode(),
              `Failed to register webhook on ALC Connect: ${msg}`,
            );
          }
          throw error;
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const credentials = await this.getCredentials("alcConnectApi");
        const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, "");
        const webhookData = this.getWorkflowStaticData("node");
        const webhookId = webhookData.webhookId as string | undefined;

        if (!webhookId) {
          return true;
        }

        try {
          await axios.delete(`${baseUrl}/webhooks/${webhookId}`, {
            headers: { Authorization: `Bearer ${credentials.apiKey}` },
            timeout: 10_000,
          });
        } catch {
          // If the webhook was already removed, ignore the error
        }

        delete webhookData.webhookId;
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const body = this.getBodyData();

    return {
      workflowData: [
        this.helpers.returnJsonArray(body as unknown as IDataObject),
      ],
    };
  }
}
