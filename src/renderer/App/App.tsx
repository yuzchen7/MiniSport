import "../index.css";
import "./App.css";

import { useEffect, useRef, useState } from "react";

import SearchBox from "../SearchBox/SearchBox";
import ResultList from "../ResultList/ResultList";
import SettingsPanel from "../SettingsPanel/SettingsPanel";

export interface SearchResult {
    rowid: string;
    name: string;
    path: string;
    alias?: string;
    isFolder?: boolean;
}

const SEARCH_DEBOUNCE_MS = 250;
const SEARCH_COMMAND_PREFIX = "search:";

export default function App() {
    const [searchWord, setSearchWord] = useState("");
    const [isResultPageOpen, setResultPageOpen] = useState(false);
    const [isWindowFading, setIsWindowFading] = useState(false);
    const [resultList, setResultList] = useState<SearchResult[]>([]);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const searchTimeout = useRef<number | null>(null);
    const [isDark, setIsDark] = useState<boolean>(false);
    const searchRequestId = useRef(0);

    useEffect(() => {
        window.api.getTheme().then((dark: boolean) => {
            document.documentElement.className = dark
                ? "dark"
                : "light";
        });

        const unsubscribe = window.api.onThemeChanged((dark: boolean) => {
            document.documentElement.className = dark
                ? "dark"
                : "light";
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        return window.api.onWindowShow(() => {
            setIsWindowFading(false);
        });
    }, []);

    useEffect(() => {
        function resetUI() {
            setSearchWord("");
            setResultList([]);
            setResultPageOpen(false);
            setSettingsOpen(false);
        }

        window.addEventListener("blur", resetUI);
        return () => window.removeEventListener("blur", resetUI);
    }, []);

    useEffect(() => {
        if (settingsOpen) {
            window.api.resizeWindow(400);
            return;
        }

        const height = Math.min(55 + resultList.length * 90 + (searchWord ? 65 : 0), 400);
        window.api.resizeWindow(height);

    }, [resultList, settingsOpen, workspaces, searchWord]);

    useEffect(() => {
        async function loadWorkspaces() {
            const data = await window.api.getWorkspaces();
            setWorkspaces(data);
        }
        loadWorkspaces();
    }, []);

    async function handleSearch(keyword: string) {
        console.log("Searching for:", keyword);
        if (!window.api) return;

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
            searchTimeout.current = null;
        }

        // set setting page off when user begin search
        const trimmedKeyword = keyword.trim();
        setSettingsOpen(false);

        // if keyword is empty
        if (!trimmedKeyword) {
            searchRequestId.current += 1;
            setResultList([]);
            setResultPageOpen(false);
            return;
        }

        if (trimmedKeyword.toLowerCase().startsWith(SEARCH_COMMAND_PREFIX)) {
            searchRequestId.current += 1;
            setResultList([]);
            setResultPageOpen(true);
            return;
        }

        const nextRequestID = ++searchRequestId.current;

        searchTimeout.current = window.setTimeout(async () => {
            const res = await window.api.search(keyword);
            if (searchRequestId.current !== nextRequestID) return;
            setResultList(res || []);
            setResultPageOpen(true);
        }, SEARCH_DEBOUNCE_MS);
    }

    function handleOpenSettings(open: boolean) {
        setResultPageOpen(false);
        setSettingsOpen(open);
    }

    async function handleAddFolder() {
        const path = await window.api.pickFolder();

        if (!path) return;

        const list = await window.api.addWorkspace(path);
        setWorkspaces(list || []);
    }

    async function handleRemoveFolder(path_id: number) {
        const path = workspaces.find(ws => ws.id === path_id)?.path;
        const newList = await window.api.removeWorkspace(path);
        setWorkspaces(newList || []);
    }

    return (
        <div className={`app ${isWindowFading ? "fade-out" : ""}`}>
            <div
                className={
                    "search-container" +
                    (isResultPageOpen || settingsOpen ? " open" : "")
                }
            >
                <SearchBox
                    value={searchWord}
                    setValue={setSearchWord}
                    onSearch={handleSearch}
                    setIsOpen={setResultPageOpen}
                    openSettings={handleOpenSettings}
                    isDark={isDark}
                />

                {settingsOpen ? (
                    <SettingsPanel
                        workspaces={workspaces}
                        onClose={() => setSettingsOpen(false)}
                        onAddFolder={handleAddFolder}
                        onRemoveFolder={handleRemoveFolder}
                    />
                ) : (
                    <ResultList
                        resultList={resultList}
                        setFading={setIsWindowFading}
                        keyword={searchWord}
                        setResultList={setResultList}
                    />
                )}

            </div>
        </div>
    );
}