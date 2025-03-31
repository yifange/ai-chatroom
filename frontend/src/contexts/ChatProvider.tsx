import React from "react";
import axios from "axios";

import { ChatHistory } from "../models/chat";
import { useChatSocket } from "../services/useChatSocket";
import { useUserName } from "./UserNameProvider";
import { CHAT_HISTORY_URL } from "../services/endpoints";

type ChatContextType = {
    chatHistory: ChatHistory;
    sendMessage: (message: string) => void;
};
const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

type ChatProviderProps = { children: React.ReactNode };
export function ChatProvider({ children }: ChatProviderProps) {
    const [chatHistory, setChatHistory] = React.useState<ChatHistory>([]);
    const { sendMessage, lastJsonMessage } = useChatSocket();
    const { userName } = useUserName();

    React.useEffect(() => {
        axios
            .get(CHAT_HISTORY_URL)
            .then((response) => setChatHistory(response.data));
    }, [setChatHistory]);

    const sendMessageAndUpdateHistory = React.useCallback(
        (message: string) => {
            setChatHistory((chatHistory) => [
                ...chatHistory,
                {
                    sender: userName ?? "You",
                    message,
                },
            ]);
            sendMessage(message);
        },
        [sendMessage, userName]
    );

    React.useEffect(() => {
        if (lastJsonMessage?.["ok"]) {
            setChatHistory((chatHistory) => [
                ...chatHistory,
                {
                    sender: lastJsonMessage.sender,
                    message: lastJsonMessage.message,
                },
            ]);
        }
    }, [lastJsonMessage]);

    return (
        <ChatContext.Provider
            value={{ chatHistory, sendMessage: sendMessageAndUpdateHistory }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = React.useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within ChatProvider");
    }
    return context;
}
