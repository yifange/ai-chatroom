import { ChatProvider } from "./contexts/ChatProvider";
import { MainView } from "./components/MainView";
import { UserNameProvider } from "./contexts/UserNameProvider";
import { BotsProvider } from "./contexts/BotsProvider";
import { AlertProvider } from "./contexts/AlertProvider";

export function App() {
    return (
        <AlertProvider>
            <BotsProvider>
                <UserNameProvider>
                    <ChatProvider>
                        <MainView />
                    </ChatProvider>
                </UserNameProvider>
            </BotsProvider>
        </AlertProvider>
    );
}
