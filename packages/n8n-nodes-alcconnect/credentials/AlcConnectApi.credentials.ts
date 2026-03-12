import type {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class AlcConnectApi implements ICredentialType {
  name = "alcConnectApi";
  displayName = "ALC Connect API";
  documentationUrl = "https://docs.alcconnect.com.br";

  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: true,
      description: "JWT token ou API Key gerada no painel do ALC Connect",
    },
    {
      displayName: "Base URL",
      name: "baseUrl",
      type: "string",
      default: "https://api.alcconnect.com.br",
      required: true,
      description: "URL base da API do ALC Connect",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Authorization: "=Bearer {{$credentials.apiKey}}",
      },
    },
  };
}
