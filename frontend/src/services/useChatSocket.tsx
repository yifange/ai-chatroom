import React from "react";

import useWebSocket from "react-use-websocket";
import { CHAT_HISTORY_SOCKET_URL } from "./endpoints";
import { ChatResponse } from "../models/chat";

export function useChatSocket() {
    const { sendMessage, lastJsonMessage } = useWebSocket<ChatResponse>(
        CHAT_HISTORY_SOCKET_URL,
        {
            onOpen: () => console.log("Connected to WebSocket"),
            onClose: () => console.log("Disconnected from WebSocket"),
            shouldReconnect: () => true,
            reconnectAttempts: 10,
            reconnectInterval: 200,
        }
    );

    return { sendMessage, lastJsonMessage };
}
