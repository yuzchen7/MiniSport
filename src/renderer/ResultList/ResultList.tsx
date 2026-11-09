import "./ResultList.css"

import FileIcon from "../FileIcon/FileIcon";

import { SearchResult } from "../App/App";
import { FaGooglePlusG } from "react-icons/fa";
import { PathUtils } from "../utils/PathConverter";
import { useEffect, useState, useRef } from "react";

interface Props {
    resultList: SearchResult[];
    setFading: (fading: boolean) => void;
    keyword: string;
    setResultList: (list: any[]) => void;
}

export default function ResultList(props: Props) {
    const hasGoogleSearch = props.keyword.trim() !== "";
    const totalItems = props.resultList.length + (hasGoogleSearch ? 1 : 0);

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [props.resultList, props.keyword]);

    useEffect(() => {
        if (selectedIndex < 0) return;

        const selectedElement = itemRefs.current[selectedIndex];
        const container = selectedElement?.parentElement;

        if (!selectedElement || !container) return;

        const containerRect = container.getBoundingClientRect();
        const itemRect = selectedElement.getBoundingClientRect();

        // item 相对于滚动容器可视区域的位置
        const itemTop = itemRect.top - containerRect.top;
        const itemBottom = itemRect.bottom - containerRect.top;

        // 顶部被遮住时，向上滚动，并留出少量间距
        if (itemTop < 0) {
            container.scrollTo({
                top: container.scrollTop + itemTop - 4,
                behavior: "smooth",
            });
        }
        // 底部超出可视区域时，向下滚动
        else if (itemBottom > container.clientHeight) {
            container.scrollTo({
                top: container.scrollTop +
                    (itemBottom - container.clientHeight) + 4,
                behavior: "smooth",
            });
        }
    }, [selectedIndex]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            console.log("[Keyboard] Key pressed:", event.key);
            console.log("[Keyboard] Current selectedIndex:", selectedIndex);

            if (totalItems === 0) {
                console.log("[Keyboard] No results to navigate");
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                console.log("[Keyboard] ArrowDown detected");

                setSelectedIndex((current) => {
                    const next = current === -1 ? 0 : Math.min(current + 1, totalItems - 1);
                    return next;
                });
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                console.log("[Keyboard] ArrowUp detected");

                setSelectedIndex((current) => {
                    const next = current === -1 ? 0 : Math.max(current - 1, 0);
                    return next;
                });
            } else if (event.key === "Enter") {
                console.log("[Keyboard] Enter detected");

                if (selectedIndex === -1) return;

                event.preventDefault();
                handleSelect(selectedIndex);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        selectedIndex,
        totalItems,
        props.resultList,
        props.keyword,
    ]);

    function handleGoogleSearch() {
        if (!props.keyword.trim()) return;

        const url = `https://www.google.com/search?q=${encodeURIComponent(props.keyword)}`;
        props.setResultList([]);
        window.api.openExternal(url);
        window.api.hideWindow();
    }

    function handleOpenPath(filePath: string) {
        props.setFading(true);
        props.setResultList([]);
        window.api.openPath(filePath);
        window.api.hideWindow();
        props.setFading(false);
    }

    function handleSelect(index: number) {
        if (index < 0 || index >= totalItems) return;

        // Google Search is the last item
        if (index === props.resultList.length && hasGoogleSearch) {
            handleGoogleSearch();
            return;
        }

        const item = props.resultList[index];
        if (item) {
            handleOpenPath(item.path);
        }
    }

    return (
        <div className="resultList">
            {
                props.resultList.map((item, index) => (
                    <div
                        key={item.rowid}
                        className={`result-item ${selectedIndex === index ? "selected" : ""}`}
                        onClick={() => handleOpenPath(item.path)}
                        onMouseEnter={() => { setSelectedIndex(index); }}
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                    >
                        <div className="icon">
                            <FileIcon path={item.path} size={40} />
                        </div>

                        <div className="content">
                            <div className="title">{item.name}</div>
                            <div className="path">{PathUtils.formatPathForOS(PathUtils.smartPath(item.path))}</div>
                        </div>
                    </div>
                ))
            }
            {props.keyword.trim() !== '' && (
                <div 
                    className="result-item google-item" 
                    onClick={handleGoogleSearch} 
                    onMouseEnter={handleGoogleSearch} 
                    ref={(el) => { itemRefs.current[totalItems - 1] = el; }}
                >
                    <FaGooglePlusG className="google-icon" size={40} />
                    <div className="content">
                        <div className="title">
                            Google Search for {
                                props.keyword.trim().startsWith('search:') ? props.keyword.trim().slice(7) : props.keyword.trim()
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}