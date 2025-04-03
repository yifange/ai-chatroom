import React from "react";
import {
    AppBar,
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useChat } from "../contexts/ChatProvider";
import { useUserName } from "../contexts/UserNameProvider";

export function TopBar() {
    const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(
        undefined
    );
    const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const handleMenuClose = React.useCallback(() => {
        setAnchorEl(undefined);
    }, [setAnchorEl]);
    const { clearChatHistory } = useChat();
    const { setUserName } = useUserName();

    const handleClearHistoryClick = React.useCallback(() => {
        handleMenuClose();
        clearChatHistory();
        setUserName(undefined);
    }, [handleMenuClose, clearChatHistory, setUserName]);

    return (
        <AppBar
            sx={{
                height: "50px",
                justifyContent: "center",
                flexDirection: "row",
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                flexGrow="1"
                marginLeft="20px"
            >
                <Typography variant="h6" component="h1">
                    AI Chatroom
                </Typography>
            </Box>

            <Box display="flex" alignItems="center">
                <IconButton color="inherit" onClick={handleMenuButtonClick}>
                    <SettingsIcon />
                </IconButton>
            </Box>
            <Menu
                id="top-bar-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleClearHistoryClick}>
                    <ListItemIcon>
                        <DeleteOutlineIcon color="error" />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography color="error">
                            Clear Chat History
                        </Typography>
                    </ListItemText>
                </MenuItem>
            </Menu>
        </AppBar>
    );
}
