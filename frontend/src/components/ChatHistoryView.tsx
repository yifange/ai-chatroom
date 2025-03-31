import React from "react";
import { ChatHistory } from "../models/chat";

type ChatHistoryProps = {
    chatHistory: ChatHistory;
}

export function ChatHistoryView(props: ChatHistoryProps) {
    return <div>
        <ul>
            {props.chatHistory.map((message, index) => {
                return <li key={index}>{message.sender}: {message.message}</li>
            })}
        </ul>
    </div>
}