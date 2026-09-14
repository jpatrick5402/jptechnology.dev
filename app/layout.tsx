import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
	title: "JP Technology | Better Tools for Difficult Work",
	description:
		"JP Technology builds thoughtful hardware and software with the people facing difficult, real-world problems.",
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
