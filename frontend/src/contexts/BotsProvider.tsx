import React from "react";
import axios from "axios";
import { BOTS_URL } from "../services/endpoints";
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
            return axios
                .post(BOTS_URL, {
                    name,
                    persona,
                })
                .then((bots) => {
                    console.log(bots);
                    setBots(bots.data);
                });
        },
        [setBots]
    );

    const deleteBot = React.useCallback(
        // Update local states
        (name: string) => {
            return axios.delete(BOTS_URL, { data: { name } }).then((bots) => {
                setBots(bots.data);
            });
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
