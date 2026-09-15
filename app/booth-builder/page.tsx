import type { Metadata } from "next";
import { BoothBuilder } from "../components/BoothBuilder/BoothBuilder";
import { ThemeToggle } from "../components/ThemeToggle";

export const metadata: Metadata = {
	title: "Booth Builder | JP Technology",
	robots: { index: false, follow: false },
};

export default function BoothBuilderPage() {
	return (
		<main className="booth-page">
			<div className="booth-topbar">
				<span className="booth-topbar-title">Booth Builder</span>
				<ThemeToggle />
			</div>
			<BoothBuilder />
		</main>
	);
}
