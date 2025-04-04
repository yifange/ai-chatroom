import React from "react";
import { useBots } from "../contexts/BotsProvider";
import {
    List,
    ListItem,
    ListSubheader,
    ListItemText,
    ListItemIcon,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Alert,
    Snackbar,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useUserName } from "../contexts/UserNameProvider";

type BotsViewProps = {};
export function BotsView(props: BotsViewProps) {
    const { bots, deleteBot, activeBot } = useBots();
    return (
        <List subheader={<ListSubheader>BOTS</ListSubheader>}>
            <ListItem>
                <NewBotButton />
            </ListItem>
            {Object.values(bots).map((bot, index) => {
                return (
                    <Tooltip title={bot.persona} placement="right" key={index}>
                        <ListItem dense>
                            <ListItemText>{bot.name}</ListItemText>
                            {bot.name === activeBot ? (
                                <CircularProgress
                                    sx={{ marginRight: "4px" }}
                                    size={14}
                                />
                            ) : null}
                            <ListItemIcon sx={{ minWidth: "initial" }}>
                                <IconButton
                                    aria-label={`Remove bot ${bot.name}`}
                                    size="small"
                                    onClick={() => {
                                        deleteBot(bot.name);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                    </Tooltip>
                );
            })}
        </List>
    );
}

/**
 * The "New Bot" button
 * On click, it opens a dialog for bot's name and description
 */
function NewBotButton() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const { userName } = useUserName();
    const { bots, addBot } = useBots();

    const botNameRef = React.useRef("");

    const handleClickOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                endIcon={<AddIcon />}
                onClick={handleClickOpenDialog}
            >
                Add Bot
            </Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {botNameRef.current} is already in the chat.
                </Alert>
            </Snackbar>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: async (
                            event: React.FormEvent<HTMLFormElement>
                        ) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(
                                (formData as any).entries()
                            );
                            const name = formJson.name;
                            const description = formJson.description;
                            if (name === userName || bots[name]) {
                                // Keep track of the duplicate name so we can show it in the alert
                                botNameRef.current = name;
                                setSnackbarOpen(true);
                            } else {
                                await addBot(name, description);
                                handleDialogClose();
                            }
                        },
                    },
                }}
            >
                <DialogTitle>Add Bot</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Bot Name"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        sx={{ marginTop: "10px" }}
                        id="description"
                        name="description"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
