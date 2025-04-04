import { Alert, Snackbar } from "@mui/material";
import React from "react";

type AlertContextType = {
    setAlertMessage: (message: string) => void;
};
const AlertContext = React.createContext<AlertContextType | undefined>(
    undefined
);

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alertMessage, setAlertMessage] = React.useState<string | undefined>(
        undefined
    );
    const handleSnackbarClose = () => {
        setAlertMessage(undefined);
    };

    return (
        <AlertContext.Provider value={{ setAlertMessage }}>
            <Snackbar
                open={!!alertMessage}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
            {children}
        </AlertContext.Provider>
    );
}

export function useSetAlert() {
    const context = React.useContext(AlertContext);
    if (!context) {
        throw new Error("useSetAlert must be used within AlertContext");
    }
    return context;
}
