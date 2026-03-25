"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlcConnectApi = void 0;
class AlcConnectApi {
    constructor() {
        this.name = "alcConnectApi";
        this.displayName = "ALC Connect API";
        this.documentationUrl = "https://docs.alcconnect.com.br";
        this.properties = [
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
        this.authenticate = {
            type: "generic",
            properties: {
                headers: {
                    Authorization: "=Bearer {{$credentials.apiKey}}",
                },
            },
        };
    }
}
exports.AlcConnectApi = AlcConnectApi;
//# sourceMappingURL=AlcConnectApi.credentials.js.map