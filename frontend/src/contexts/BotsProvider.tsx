import React from "react";
import axios from "axios";

import { BOTS_URL, INTERRUPT_BOTS_URL } from "../services/endpoints";
import { Bots } from "../models/bot";
import { useSocket } from "../services/useChatSocket";
import { useSetAlert } from "./AlertProvider";

type BotsContextType = {
    bots: Bots;
    activeBot: string | undefined;
    addBot: (name: string, persona: string) => Promise<void>;
    deleteBot: (name: string) => Promise<void>;
    deleteAllBots: () => Promise<void>;
    interruptBots: () => Promise<void>;
};
const BotsContext = React.createContext<BotsContextType | undefined>(undefined);

type BotsProviderProps = { children: React.ReactNode };
export function BotsProvider({ children }: BotsProviderProps) {
    const [bots, setBots] = React.useState<Bots | {}>({});
    const [activeBot, setActiveBot] = React.useState<string | undefined>(
        undefined
    );
    const { lastJsonMessage } = useSocket();

    const { setAlertMessage } = useSetAlert();

    React.useEffect(() => {
        if (lastJsonMessage?.type === "active_bot_status") {
            setActiveBot(lastJsonMessage.name ?? undefined);
        }
    }, [lastJsonMessage]);

    React.useEffect(() => {
        axios
            .get(BOTS_URL)
            .then((response) => setBots(response.data))
            .catch(() => setAlertMessage("Error getting the bot list."));
    }, [setAlertMessage]);

    // Oversimplified server interaction to add a new bot to the chat
    const addBot = React.useCallback(
        (name: string, persona: string) => {
            return axios
                .post(BOTS_URL, {
                    name,
                    persona,
                })
                .then((bots) => {
                    setBots(bots.data);
                })
                .catch(() => setAlertMessage(`Error adding bot ${name}`));
        },
        [setAlertMessage]
    );

    const deleteBot = React.useCallback(
        (name: string) => {
            return axios
                .delete(BOTS_URL, { data: { name } })
                .then((bots) => {
                    setBots(bots.data);
                })
                .catch(() => setAlertMessage(`Error deleting bot ${name}`));
        },
        [setAlertMessage]
    );

    const deleteAllBots = React.useCallback(() => {
        return axios
            .delete(BOTS_URL, { data: {} })
            .then((bots) => {
                setBots(bots.data);
            })
            .catch(() => setAlertMessage("Error deleting bots"));
    }, [setAlertMessage]);

    const interruptBots = React.useCallback(() => {
        return axios
            .post(INTERRUPT_BOTS_URL)
            .then(() => {})
            .catch(() => setAlertMessage("Error stopping bots"));
    }, [setAlertMessage]);

    return (
        <BotsContext.Provider
            value={{
                bots,
                addBot,
                deleteBot,
                deleteAllBots,
                activeBot,
                interruptBots,
            }}
        >
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
