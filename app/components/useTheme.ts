"use client";

import { useSyncExternalStore } from "react";

const themeStorageKey = "jp-theme";
const themeChangeEvent = "jp-theme-change";

function getIsLightTheme() {
	return (
		typeof window !== "undefined" &&
		window.localStorage.getItem(themeStorageKey) === "light"
	);
}

function subscribeToTheme(callback: () => void) {
	window.addEventListener("storage", callback);
	window.addEventListener(themeChangeEvent, callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener(themeChangeEvent, callback);
	};
}

/** Tracks the site-wide dark/light theme set by ThemeToggle. */
export function useIsLightTheme() {
	return useSyncExternalStore(subscribeToTheme, getIsLightTheme, () => false);
}
