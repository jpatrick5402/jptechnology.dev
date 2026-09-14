"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const developmentStages = [
	{
		number: "01",
		name: "Listen",
		kicker: "Start with the people",
		status: "In progress",
	},
	{
		number: "02",
		name: "Shape",
		kicker: "Make the problem clear",
		status: "In progress",
	},
	{
		number: "03",
		name: "Build",
		kicker: "Put useful tools to work",
		status: "Next up",
	},
] as const;

function ArchitectureModule({
	stage,
	index,
	reduceMotion,
}: {
	stage: (typeof developmentStages)[number];
	index: number;
	reduceMotion: boolean | null;
}) {
	const side = index % 2 === 0 ? "module-left" : "module-right";

	return (
		<motion.div
			className={`architecture-module ${side}`}
			whileHover={reduceMotion ? undefined : { y: -3 }}
			whileTap={reduceMotion ? undefined : { scale: 0.98 }}
		>
			<span className="module-signal" />
			<span className="module-index">{stage.number}</span>
			<span className="module-copy">
				<strong>{stage.name}</strong>
				<small>{stage.kicker}</small>
				<span className="module-status">{stage.status}</span>
			</span>
		</motion.div>
	);
}

export function EngineeringArchitectureDiagram() {
	const reduceMotion = useReducedMotion();
	const [isPulsed, setIsPulsed] = useState(false);
	const [busGeometry, setBusGeometry] = useState({ top: 104, length: 0 });
	const bodyRef = useRef<HTMLDivElement>(null);
	const modulesRef = useRef<HTMLDivElement>(null);
	const coreRef = useRef<HTMLButtonElement>(null);
	const moduleRows = Math.ceil(developmentStages.length / 2);
	const moduleFieldHeight =
		120 + moduleRows * 72 + Math.max(0, moduleRows - 1) * 14;
	const moduleFieldHeightMobile =
		86 + moduleRows * 60 + Math.max(0, moduleRows - 1) * 8;
	const moduleBottomOffset = 28;
	const moduleBottomOffsetMobile = 24;
	const diagramStyle = {
		"--module-rows": moduleRows,
		"--diagram-height": `${moduleFieldHeight + moduleBottomOffset + 66}px`,
		"--diagram-height-mobile": `${moduleFieldHeightMobile + moduleBottomOffsetMobile + 58}px`,
		"--module-field-height": `${moduleFieldHeight + moduleBottomOffset}px`,
		"--module-field-height-mobile": `${moduleFieldHeightMobile + moduleBottomOffsetMobile}px`,
		"--bus-length": `${Math.max(0, moduleFieldHeight - 104)}px`,
		"--bus-length-mobile": `${Math.max(0, moduleFieldHeightMobile - 80)}px`,
		"--measured-bus-top": `${busGeometry.top}px`,
		"--measured-bus-length": `${busGeometry.length}px`,
	} as React.CSSProperties;

	useEffect(() => {
		const modules = modulesRef.current;
		const body = bodyRef.current;
		const core = coreRef.current;
		if (!modules || !body || !core) return;

		const updateBusLength = () => {
			const lastModule = modules.lastElementChild as HTMLElement | null;
			if (!lastModule) return;
			const bodyRect = body.getBoundingClientRect();
			const coreRect = core.getBoundingClientRect();
			const lastModuleRect = lastModule.getBoundingClientRect();
			const busTop = coreRect.bottom - bodyRect.top;
			const busEnd =
				lastModuleRect.top + lastModuleRect.height / 2 - bodyRect.top;
			setBusGeometry({
				top: busTop,
				length: Math.max(0, busEnd - busTop),
			});
		};

		updateBusLength();
		const resizeObserver = new ResizeObserver(updateBusLength);
		resizeObserver.observe(body);
		resizeObserver.observe(modules);
		resizeObserver.observe(core);
		window.addEventListener("resize", updateBusLength);
		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateBusLength);
		};
	}, []);

	function pulseSystem() {
		if (reduceMotion) return;
		setIsPulsed(false);
		requestAnimationFrame(() => setIsPulsed(true));
		window.setTimeout(() => setIsPulsed(false), 900);
	}

	return (
		<div
			className={`engineering-diagram${isPulsed ? " is-pulsed" : ""}`}
			aria-label="JP Technology engineering architecture"
			role="group"
			style={diagramStyle}
		>
			<div className="architecture-header">
				<span>LIVE PROJECT TRACKING</span>
				<span>03 DEVELOPMENT STAGES</span>
			</div>
			<div className="architecture-body" ref={bodyRef}>
				<div className="architecture-bus" aria-hidden="true" />
				<div className="architecture-modules" ref={modulesRef}>
					{developmentStages.map((stage, index) => (
						<ArchitectureModule
							key={stage.number}
							stage={stage}
							index={index}
							reduceMotion={reduceMotion}
						/>
					))}
				</div>
				<motion.button
					className="architecture-core"
					ref={coreRef}
					type="button"
					aria-label="Pulse the JP Technology Development system"
					onClick={pulseSystem}
					whileTap={reduceMotion ? undefined : { scale: 0.97 }}
				>
					<strong>JP Technology Development</strong>
				</motion.button>
			</div>
			<div className="architecture-footer">
				<span>INTERFACES / HARDWARE + SOFTWARE</span>
				<span className="architecture-live">
					<i /> SYSTEM IN DEVELOPMENT
				</span>
			</div>
		</div>
	);
}
