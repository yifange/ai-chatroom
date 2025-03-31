import React from "react";
import { useChat } from "../contexts/ChatProvider";
import { ChatHistoryView } from "./ChatHistoryView";
import { BotsView } from "./BotsView";

export function MainView() {
    const {chatHistory, sendMessage} = useChat();
    const [message, setMessage] = React.useState("");

        return <div className="p-4">
            <h1 className="text-xl font-bold">AI Chatroom</h1>
            <BotsView />
            <ChatHistoryView chatHistory={chatHistory} />
            <input
                className="border p-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button
                className="ml-2 p-2 bg-blue-500 text-white"
                onClick={() => sendMessage(message)}
            >
                Send
            </button>
        </div>

}