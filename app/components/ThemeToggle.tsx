"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [isLight, setIsLight] = useState(false);

	useEffect(() => {
		const savedTheme = window.localStorage.getItem("jp-theme");
		const light = savedTheme === "light";
		setIsLight(light);
		document.documentElement.dataset.theme = light ? "light" : "dark";
	}, []);

	function toggleTheme() {
		const nextIsLight = !isLight;
		setIsLight(nextIsLight);
		document.documentElement.dataset.theme = nextIsLight ? "light" : "dark";
		window.localStorage.setItem("jp-theme", nextIsLight ? "light" : "dark");
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
