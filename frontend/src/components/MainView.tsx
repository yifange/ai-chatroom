import React from "react";
import { useChat } from "../contexts/ChatProvider";
import { ChatHistoryView } from "./ChatHistoryView";
import { BotsView } from "./BotsView";
import {
    AppBar,
    Box,
    Container,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { ChatInputView } from "./ChatInputView";
import { TopBar } from "./TopBarView";

export function MainView() {
    return (
        <>
            <TopBar />
            <Grid
                container
                p={2}
                sx={{ height: "calc(100vh - 50px)", marginTop: "50px" }}
            >
                <Grid
                    size={2}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRightColor: "divider",
                        borderRightWidth: "1px",
                        borderRightStyle: "solid",
                    }}
                >
                    <BotsView />
                </Grid>
                <Grid
                    size={10}
                    p={2}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <Stack direction="column" spacing={2} height="100%">
                        <ChatHistoryView />
                        <ChatInputView />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
