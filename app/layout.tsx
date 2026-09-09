import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
	title: "JP Technology | Make the next thing matter",
	description:
		"JP Technology is an independent hardware and software studio building focused tools for the next question.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" data-scroll-behavior="smooth">
			<body>
				{children}
				<SpeedInsights />
			</body>
		</html>
	);
}
