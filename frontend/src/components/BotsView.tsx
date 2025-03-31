import React from "react";
import { useBots } from "../contexts/BotsProvider";

type BotsViewProps = {};
export function BotsView(props: BotsViewProps) {
    const { bots, addBot, deleteBot } = useBots();
    return <ul>
        {Object.values(bots).map((bot, index) => {
            return <li key={index}>
                {bot.name}: {bot.persona}
            </li>;
        })}
    </ul>;
}
