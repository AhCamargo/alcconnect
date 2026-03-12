import axios from "axios";
import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

export class AlcConnect implements INodeType {
  description: INodeTypeDescription = {
    displayName: "ALC Connect",
    name: "alcConnect",
    icon: "file:alcconnect-sem-nome.png",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description:
      "Interact with ALC Connect virtual numbers and automation platform.",
    defaults: {
      name: "ALC Connect",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "alcConnectApi",
        required: true,
      },
    ],
    properties: [
      // ------ Resource ------
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          { name: "Message", value: "message" },
          { name: "Number", value: "number" },
        ],
        default: "message",
      },

      // ------ Operations: Message ------
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["message"] } },
        options: [
          {
            name: "Send SMS",
            value: "sendSms",
            description: "Send an SMS message",
            action: "Send an SMS message",
          },
          {
            name: "Send WhatsApp",
            value: "sendWhatsapp",
            description: "Send a WhatsApp message",
            action: "Send a WhatsApp message",
          },
        ],
        default: "sendSms",
      },

      // ------ Operations: Number ------
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["number"] } },
        options: [
          {
            name: "Create Number",
            value: "createNumber",
            description: "Buy a new virtual number",
            action: "Buy a new virtual number",
          },
          {
            name: "List Numbers",
            value: "listNumbers",
            description: "List all virtual numbers",
            action: "List all virtual numbers",
          },
        ],
        default: "listNumbers",
      },

      // ------ Fields: Send SMS / Send WhatsApp ------
      {
        displayName: "To",
        name: "to",
        type: "string",
        default: "",
        required: true,
        placeholder: "+551199999999",
        description: "Destination phone number in E.164 format",
        displayOptions: {
          show: {
            resource: ["message"],
            operation: ["sendSms", "sendWhatsapp"],
          },
        },
      },
      {
        displayName: "Message",
        name: "message",
        type: "string",
        typeOptions: { rows: 4 },
        default: "",
        required: true,
        description: "Message content to send",
        displayOptions: {
          show: {
            resource: ["message"],
            operation: ["sendSms", "sendWhatsapp"],
          },
        },
      },

      // ------ Fields: Create Number ------
      {
        displayName: "DDD",
        name: "ddd",
        type: "string",
        default: "",
        required: true,
        placeholder: "11",
        description: "Brazilian area code (DDD) for the new number",
        displayOptions: {
          show: {
            resource: ["number"],
            operation: ["createNumber"],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials("alcConnectApi");
    const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, "");
    const apiKey = credentials.apiKey as string;

    const client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 15_000,
    });

    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        // ── Message: Send SMS ──
        if (resource === "message" && operation === "sendSms") {
          const to = this.getNodeParameter("to", i) as string;
          const message = this.getNodeParameter("message", i) as string;

          const { data } = await client.post("/messages/sms", { to, message });
          returnData.push({ json: data });
        }

        // ── Message: Send WhatsApp ──
        else if (resource === "message" && operation === "sendWhatsapp") {
          const to = this.getNodeParameter("to", i) as string;
          const message = this.getNodeParameter("message", i) as string;

          const { data } = await client.post("/messages/whatsapp", {
            to,
            message,
          });
          returnData.push({ json: data });
        }

        // ── Number: Create ──
        else if (resource === "number" && operation === "createNumber") {
          const ddd = this.getNodeParameter("ddd", i) as string;

          const { data } = await client.post("/numbers/buy", { ddd });
          returnData.push({ json: data });
        }

        // ── Number: List ──
        else if (resource === "number" && operation === "listNumbers") {
          const { data } = await client.get("/numbers");
          const numbers = Array.isArray(data.numbers) ? data.numbers : [data];
          for (const num of numbers) {
            returnData.push({ json: num });
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data?.error ?? error.message;
          throw new NodeOperationError(
            this.getNode(),
            `ALC Connect API error: ${msg}`,
            {
              itemIndex: i,
            },
          );
        }
        throw error;
      }
    }

    return [returnData];
  }
}
