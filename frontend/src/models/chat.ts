export type ChatMessage = {
    sender: string;
    message: string;
};

export type ChatHistory = ChatMessage[];

export type ChatResponse = {
    ok: true;
    sender: string;
    message: string;
} | {
    ok: false;
    message: string;
};
