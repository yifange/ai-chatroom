import React from "react";
import axios from "axios";

import { ChatHistory } from "../models/chat";
import { useSocket } from "../services/useChatSocket";
import { useUserName } from "./UserNameProvider";
import { CHAT_HISTORY_URL } from "../services/endpoints";

type ChatContextType = {
    chatHistory: ChatHistory;
    sendMessage: (message: string) => void;
    clearChatHistory: () => Promise<void>;
};
const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

type ChatProviderProps = { children: React.ReactNode };
export function ChatProvider({ children }: ChatProviderProps) {
    const [chatHistory, setChatHistory] = React.useState<ChatHistory>([]);
    const { sendMessage, lastJsonMessage } = useSocket();
    const { userName } = useUserName();

    React.useEffect(() => {
        axios
            .get(CHAT_HISTORY_URL)
            .then((response) => setChatHistory(response.data));
    }, [setChatHistory]);

    const clearChatHistory = React.useCallback(() => {
        return axios.delete(CHAT_HISTORY_URL).then(() => {
            setChatHistory([]);
        });
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
        if (lastJsonMessage?.type === "chat") {
            const chatResponse = lastJsonMessage.response;
            console.log("chat: ", chatResponse);
            if (chatResponse.ok) {
                setChatHistory((chatHistory) => [
                    ...chatHistory,
                    {
                        sender: chatResponse.sender,
                        message: chatResponse.message,
                    },
                ]);
            }
        }
    }, [lastJsonMessage]);

    return (
        <ChatContext.Provider
            value={{
                chatHistory,
                sendMessage: sendMessageAndUpdateHistory,
                clearChatHistory,
            }}
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
