import { ReactNode, createContext, useContext, useState } from "react";

type AppContextType = {
    appLaunched: boolean
    setAppLaunched: (param:boolean) => void
}

interface ChildrenProps {
    children?: ReactNode
}

const AppState = createContext<AppContextType | null>(null);

export default function AppContext({ children }: ChildrenProps) {

    const [appLaunched, setAppLaunched] = useState<boolean>(false)

    return (
        <AppState.Provider value={{appLaunched, setAppLaunched}}>
            { children }
        </AppState.Provider>
    )
}

export function useAppContext() {
    return useContext(AppState);
}