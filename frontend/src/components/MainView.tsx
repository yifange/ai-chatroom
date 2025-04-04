import { ChatHistoryView } from "./ChatHistoryView";
import { BotsView } from "./BotsView";
import { Grid, Stack } from "@mui/material";
import { ChatInputView } from "./ChatInputView";
import { TopBar } from "./TopBarView";

/**
 * The main view of the app
 */
export function MainView() {
    return (
        <>
            <TopBar />
            <Grid
                container
                p={2}
                sx={{ height: "calc(100vh - 50px)", marginTop: "50px" }}
            >
                {/* Side bar */}
                <Grid
                    size="auto"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRightColor: "divider",
                        borderRightWidth: "1px",
                        borderRightStyle: "solid",
                        minWidth: "180px",
                    }}
                >
                    <BotsView />
                </Grid>
                {/* Chat history */}
                <Grid
                    size="grow"
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
