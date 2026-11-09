import "./SearchBox.css";

import { useEffect } from "react";
import { IoSearchOutline, IoSettingsOutline } from "react-icons/io5";

interface Props {
    value: string;
    onSearch: (keyword: string) => void;
    setIsOpen: (isOpen: boolean) => void;
    setValue: (value: string) => void;
    openSettings: (open: boolean) => void;
    isDark: boolean;
}

export default function SearchBox(props: Props) {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            props.setValue(props.value);
            props.onSearch(props.value);
        }, 200);

        return () => clearTimeout(timer);
    }, [props.value]);

    return (
        <div className="searchbox">
            <IoSearchOutline
                className="search-icon"
                size={24}
            />

            <input
                autoFocus
                value={props.value}
                onFocus={() => props.setIsOpen(true)}
                onChange={handleChange}
                placeholder="MiniSport Search"
                className="search-input"
            />

            <IoSettingsOutline
                size={22}
                onClick={() => props.openSettings(true)}
                className={`settings-icon ${
                    props.value.trim() ? "hide" : ""
                }`}
            />
        </div>
    );
}