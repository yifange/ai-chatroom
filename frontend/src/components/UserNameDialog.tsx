import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import React from "react";

type UserNameDialogProps = {
    dialogOpen: boolean;
    setDialogOpen: (value: boolean) => void;
    setUserName: (value: string) => void;
};
export function UserNameDialog(props: UserNameDialogProps) {
    return (
        <Dialog
            open={props.dialogOpen}
            onClose={() => props.setDialogOpen(false)}
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
                        await props.setUserName(name);
                        props.setDialogOpen(false);
                    },
                },
            }}
        >
            <DialogTitle>What's your name?</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="Enter your name"
                    fullWidth
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button type="submit">Submit</Button>
            </DialogActions>
        </Dialog>
    );
}
