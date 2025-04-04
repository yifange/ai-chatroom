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
        // On page load, get the chat history
        axios
            .get(CHAT_HISTORY_URL)
            .then((response) => setChatHistory(response.data));
    }, [setChatHistory]);

    const clearChatHistory = React.useCallback(() => {
        // Call the API to clear chat history
        return axios.delete(CHAT_HISTORY_URL).then(() => {
            // ...and clear local chat history
            setChatHistory([]);
        });
    }, [setChatHistory]);

    const sendMessageAndUpdateHistory = React.useCallback(
        (message: string) => {
            // Add the user's message to the chat history
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
            // A new chat message
            const chatResponse = lastJsonMessage.response;
            if (chatResponse.ok) {
                // Add it to the chat history
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
