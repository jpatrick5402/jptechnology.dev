"use client";

import { useEffect, useSyncExternalStore } from "react";

const themeStorageKey = "jp-theme";
const themeChangeEvent = "jp-theme-change";

function getTheme() {
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

export function ThemeToggle() {
	const isLight = useSyncExternalStore(subscribeToTheme, getTheme, () => false);

	useEffect(() => {
		document.documentElement.dataset.theme = isLight ? "light" : "dark";
	}, [isLight]);

	function toggleTheme() {
		const nextIsLight = !isLight;
		document.documentElement.dataset.theme = nextIsLight ? "light" : "dark";
		window.localStorage.setItem(
			themeStorageKey,
			nextIsLight ? "light" : "dark",
		);
		window.dispatchEvent(new Event(themeChangeEvent));
	}

	return (
		<button
			className="theme-toggle"
			type="button"
			aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
			aria-pressed={isLight}
			onClick={toggleTheme}
		>
			<span className="theme-toggle-track">
				<span className="theme-toggle-thumb">{isLight ? "☼" : "☾"}</span>
			</span>
			<span className="theme-toggle-label">{isLight ? "Light" : "Dark"}</span>
		</button>
	);
}
