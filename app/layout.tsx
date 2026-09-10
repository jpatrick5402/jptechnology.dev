import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
	title: "JP Technology | Make the Hard Things Work For You",
	description:
		"JP Technology is an independent engineering studio building focused hardware and software for problems that do not fit inside a template.",
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
