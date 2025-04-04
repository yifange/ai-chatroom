import useWebSocket from "react-use-websocket";
import { CHAT_HISTORY_SOCKET_URL } from "./endpoints";
import { SocketMessage } from "../models/socket";

export function useSocket() {
    const { sendMessage, lastJsonMessage } = useWebSocket<SocketMessage>(
        CHAT_HISTORY_SOCKET_URL,
        {
            onOpen: () => console.debug("Connected to WebSocket"),
            onClose: () => console.debug("Disconnected from WebSocket"),
            shouldReconnect: () => true,
            reconnectAttempts: 10,
            reconnectInterval: 200,
        }
    );

    return { sendMessage, lastJsonMessage };
}
