"use client";

import { useEffect, useState } from "react";
import type { InitiativeStatus } from "../initiatives/data";

type PillVariant = "live" | "dev" | "muted";

function variantForStatus(status: InitiativeStatus): PillVariant {
	if (status === "Active") return "live";
	if (status === "In development") return "dev";
	return "muted";
}

function labelForStatus(status: InitiativeStatus): string {
	if (status === "Active") return "Live";
	return status;
}

export function StatusPill({
	status,
	className,
}: {
	status: InitiativeStatus;
	className?: string;
}) {
	const variant = variantForStatus(status);
	const classNames = `status-pill status-pill--${variant}${className ? ` ${className}` : ""}`;
	return (
		<span className={classNames}>
			<span className="status-dot" aria-hidden="true" />
			{labelForStatus(status)}
		</span>
	);
}

export function KnowAndGoStatus({ className }: { className?: string } = {}) {
	const [label, setLabel] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		void fetch("/api/knowandgo-status", { cache: "no-store" })
			.then((response) => {
				if (!response.ok) throw new Error("Status check failed");
				return response.json() as Promise<{
					live?: boolean;
					total?: number;
				}>;
			})
			.then((data) => {
				if (cancelled) return;
				if (data.live && typeof data.total === "number") {
					setLabel(`Live · ${data.total} places`);
				} else {
					setLabel("Live");
				}
			})
			.catch(() => {
				if (!cancelled) setLabel("Live");
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const classNames = `status-pill status-pill--live${className ? ` ${className}` : ""}`;
	return (
		<span className={classNames}>
			<span className="status-dot" aria-hidden="true" />
			{label ?? "Checking…"}
		</span>
	);
}
