import React from "react";
import { useChat } from "../contexts/ChatProvider";
import { Box, Stack, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export function ChatInputView() {
    const { sendMessage } = useChat();
    const [message, setMessage] = React.useState("");
    const submitMessage = () => {
        // Sends the message to the backend via the web socket
        sendMessage(message);
        // Clears the text area
        setMessage("");
    };

    return (
        <>
            <Stack direction="row" spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                    <TextField
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            // Send on enter, but allow shift-enter for line breaks
                            if (e.key === "Enter" && !e.shiftKey) {
                                submitMessage();
                            }
                        }}
                    />
                </Box>
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={() => {
                        submitMessage();
                    }}
                >
                    Send
                </Button>
            </Stack>
        </>
    );
}
