import React from "react";
import axios from "axios";
import { USER_NAME_URL } from "../services/endpoints";

type UserNameContextType = {
    userName: string | undefined;
    setUserName: (name: string) => void;
};
const UserNameContext = React.createContext<UserNameContextType | undefined>(undefined);

type UserNameProviderProps = { children: React.ReactNode };
export function UserNameProvider({ children }: UserNameProviderProps) {
    const [userName, setUserName] = React.useState<string | undefined>(
        undefined
    );

    React.useEffect(() => {
        axios.get(USER_NAME_URL).then((name) => setUserName(name.data))
    }, [])

    return (
        <UserNameContext.Provider value={{userName, setUserName}}>
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

