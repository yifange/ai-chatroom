import { ChatProvider } from "./contexts/ChatProvider";
import { MainView } from "./components/MainView";
import { UserNameProvider } from "./contexts/UserNameProvider";
import { BotsProvider } from "./contexts/BotsProvider";

export function App() {
    return (
        <BotsProvider>
            <UserNameProvider>
                <ChatProvider>
                    <MainView />
                </ChatProvider>
            </UserNameProvider>
        </BotsProvider>
    );
}
