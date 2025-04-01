import React from "react";
import { useChat } from "../contexts/ChatProvider";
import { Box, Stack, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export function ChatInputView() {
    const { sendMessage } = useChat();
    const [message, setMessage] = React.useState("");

    return (
        <>
            <Stack direction="row" spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                    <TextField
                        fullWidth
                        className="border p-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Box>
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={() => {
                        sendMessage(message);
                        setMessage("")
                    }}
                >
                    Send
                </Button>
            </Stack>
        </>
    );
}
