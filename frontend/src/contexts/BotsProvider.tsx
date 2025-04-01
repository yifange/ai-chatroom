import React from "react";
import axios from "axios";
import { BOTS_URL, USER_NAME_URL } from "../services/endpoints";
import { Bots } from "../models/bot";

type BotsContextType = {
    bots: Bots;
    addBot: (name: string, persona: string) => void;
    deleteBot: (name: string) => void;
};
const BotsContext = React.createContext<BotsContextType | undefined>(undefined);

type BotsProviderProps = { children: React.ReactNode };
export function BotsProvider({ children }: BotsProviderProps) {
    const [bots, setBots] = React.useState<Bots | {}>({});

    React.useEffect(() => {
        axios.get(BOTS_URL).then((response) => setBots(response.data));
    }, []);

    // Oversimplified server interaction to add a new bot to the chat
    const addBot = React.useCallback(
        (name: string, persona: string) => {
            // Update local states
            setBots((bots) => ({
                ...bots,
                name: {
                    name,
                    persona,
                },
            }));
            // FIXME: loading state, error state, retry
            return axios.post(BOTS_URL, {
                name,
                persona,
            });
        },
        [setBots]
    );

    const deleteBot = React.useCallback(
        // Update local states
        (name: string) => {
            setBots((bots) =>
                Object.fromEntries(
                    Object.entries(bots).filter(([key]) => key !== name)
                )
            );
            // FIXME: loading state, error state, retry
            return axios.delete(BOTS_URL, { data: { name } });
        },
        [setBots]
    );

    return (
        <BotsContext.Provider value={{ bots, addBot, deleteBot }}>
            {children}
        </BotsContext.Provider>
    );
}

export function useBots() {
    const context = React.useContext(BotsContext);
    if (!context) {
        throw new Error("useUserName must be used within UserNameContext");
    }
    return context;
}
