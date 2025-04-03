import React from "react";
import { useChat } from "../contexts/ChatProvider";
import { Box, Stack, Typography } from "@mui/material";

type ChatHistoryProps = {};

export function ChatHistoryView(props: ChatHistoryProps) {
    const { chatHistory } = useChat();
    const messageEndRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        // Automatically scroll to the bottom of the history when new messages arrive.
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]);

    return (
        <Stack height="100%" spacing={2} sx={{ overflowY: "scroll" }}>
            {chatHistory.map((message, index) => {
                return (
                    <Box key={index}>
                        <Stack direction="column">
                            <Typography variant="body1" fontWeight={700}>
                                {message.sender}
                            </Typography>
                            <Typography variant="body1" fontWeight={400}>
                                {message.message}
                            </Typography>
                        </Stack>
                    </Box>
                );
            })}
            <div ref={messageEndRef} />
        </Stack>
    );
}
