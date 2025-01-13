export interface PunchoutRequest {
    punchoutLoginUrl: string;
    username: string;
    password: string;
    inputXML?: string;
    replaceHook: boolean;
}

export type FormValues = Record<string, unknown>;
