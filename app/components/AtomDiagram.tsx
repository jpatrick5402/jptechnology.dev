"use client";

import {
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "../data/products";

const MotionLink = motion.create(Link);

const orbitStyles = [
	{
		orbit: "atom-orbit atom-orbit-wide",
		duration: 18,
		delay: -4,
		boostMultiplier: 8,
	},
	{
		orbit: "atom-orbit atom-orbit-tall",
		duration: 23,
		delay: -11,
		boostMultiplier: 8,
	},
	{
		orbit: "atom-orbit atom-orbit-tilt",
		duration: 15,
		delay: -7,
		boostMultiplier: 8,
	},
];

const electrons = products.slice(0, 3).map((product, index) => ({
	label: product.name,
	slug: product.slug,
	angle: index * 120,
	...orbitStyles[index],
}));

type Electron = (typeof electrons)[number];

function OrbitElectron({
	electron,
	boosted,
	reduceMotion,
}: {
	electron: Electron;
	boosted: boolean;
	reduceMotion: boolean | null;
}) {
	const orbitRotation = useMotionValue(electron.angle);
	const labelRotation = useMotionValue(-electron.angle);

	useEffect(() => {
		if (reduceMotion) {
			orbitRotation.set(electron.angle);
			labelRotation.set(-electron.angle);
			return;
		}

		const duration = boosted
			? electron.duration / electron.boostMultiplier
			: electron.duration;
		const transition = {
			duration,
			ease: "linear" as const,
			repeat: Infinity,
		};
		const orbitAnimation = animate(
			orbitRotation,
			orbitRotation.get() + 360,
			transition,
		);
		const labelAnimation = animate(
			labelRotation,
			labelRotation.get() - 360,
			transition,
		);

		return () => {
			orbitAnimation.stop();
			labelAnimation.stop();
		};
	}, [boosted, electron, labelRotation, orbitRotation, reduceMotion]);

	return (
		<>
			<motion.div
				className={electron.orbit}
				style={{ rotate: orbitRotation }}
			/>
			<motion.div
				className={electron.orbit.replace("atom-orbit", "atom-electron-track")}
				style={{ rotate: orbitRotation }}
			>
				<MotionLink
					className="atom-electron"
					href={`/products/${electron.slug}`}
					aria-label={`View ${electron.label} product page`}
					style={{ rotate: labelRotation }}
				>
					{electron.label}
				</MotionLink>
			</motion.div>
		</>
	);
}

export function AtomDiagram() {
	const reduceMotion = useReducedMotion();
	const [isBoosted, setIsBoosted] = useState(false);
	const [boostVersion, setBoostVersion] = useState(0);

	useEffect(() => {
		if (!isBoosted) return;
		const timeout = window.setTimeout(() => setIsBoosted(false), 1000);
		return () => window.clearTimeout(timeout);
	}, [boostVersion, isBoosted]);

	function boostAtom() {
		if (reduceMotion) return;
		setIsBoosted(true);
		setBoostVersion((version) => version + 1);
	}

	return (
		<div
			className={`atom-diagram${isBoosted ? " atom-diagram-boosted" : ""}`}
			aria-label="JP Technology atom diagram"
			role="group"
		>
			<div className="atom-grid" />
			<motion.button
				className="atom-core"
				type="button"
				aria-label="Boost the atom diagram"
				onClick={boostAtom}
				whileTap={reduceMotion ? undefined : { scale: 0.94 }}
			>
				<strong>JP TECHNOLOGY</strong>
				<span>DEVELOPMENT</span>
			</motion.button>
			{electrons.map((electron) => (
				<OrbitElectron
					boosted={isBoosted}
					electron={electron}
					key={electron.label}
					reduceMotion={reduceMotion}
				/>
			))}
			<div className="atom-caption">
				Ideas in motion
				<br />
				<span>Hardware + software / 2026</span>
			</div>
		</div>
	);
}
