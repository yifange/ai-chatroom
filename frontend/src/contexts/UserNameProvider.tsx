import React from "react";
import axios from "axios";

import { USER_NAME_URL } from "../services/endpoints";
import { UserNameDialog } from "../components/UserNameDialog";

type UserNameContextType = {
    userName: string | undefined;
    setUserName: (name: string | undefined) => Promise<void>;
};
const UserNameContext = React.createContext<UserNameContextType | undefined>(
    undefined
);

type UserNameProviderProps = { children: React.ReactNode };
export function UserNameProvider({ children }: UserNameProviderProps) {
    const [userName, setUserName] = React.useState<string | undefined>(
        undefined
    );

    const userNameLoadedRef = React.useRef(false);
    const [userNameDialogOpen, setUserNameDialogOpen] = React.useState(false);

    React.useEffect(() => {
        axios.get(USER_NAME_URL).then((response) => {
            setUserName(response.data);
            userNameLoadedRef.current = true;
        });
    }, []);

    const setUserNameOnServer = React.useCallback(
        (name: string | undefined) => {
            return axios.post(USER_NAME_URL, { name }).then((response) => {
                setUserName(response.data);
            });
        },
        [setUserName]
    );

    React.useEffect(() => {
        // When user doesn't have a user name set, show the "Enter user name"
        // dialog.
        // We make sure that we've checked with server before showing the dialog,
        // in case the user just refreshed the page and doesn't have user name
        // loaded yet.
        if (!userName && userNameLoadedRef.current) {
            setUserNameDialogOpen(true);
        }
    }, [userName]);

    return (
        <UserNameContext.Provider
            value={{ userName, setUserName: setUserNameOnServer }}
        >
            <UserNameDialog
                dialogOpen={userNameDialogOpen}
                setDialogOpen={setUserNameDialogOpen}
                setUserName={setUserNameOnServer}
            />
            {children}
        </UserNameContext.Provider>
    );
}

export function useUserName() {
    const context = React.useContext(UserNameContext);
    if (!context) {
        throw new Error("useUserName must be used within UserNameContext");
    }
    return context;
}
