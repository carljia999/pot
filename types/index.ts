export interface PunchoutRequest {
    punchoutLoginUrl: string;
    username: string;
    password: string;
    inputXML?: string;
    replaceHook: boolean;
}

export interface PunchoutResponse {
    success: boolean;
    url?: string;
    outputXML: string;
    inputXML: string;
    postedXML: string;
    serverVariables: Record<string, any>;
}