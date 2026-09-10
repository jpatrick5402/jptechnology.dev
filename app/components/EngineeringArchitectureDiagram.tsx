"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { products } from "../data/products";

const MotionLink = motion.create(Link);

function ArchitectureModule({
	product,
	index,
	reduceMotion,
}: {
	product: (typeof products)[number];
	index: number;
	reduceMotion: boolean | null;
}) {
	const side = index % 2 === 0 ? "module-left" : "module-right";

	return (
		<MotionLink
			className={`architecture-module ${side}`}
			href={`/products/${product.slug}`}
			aria-label={`View ${product.name} product page`}
			whileHover={reduceMotion ? undefined : { y: -3 }}
			whileTap={reduceMotion ? undefined : { scale: 0.98 }}
		>
			<span className="module-signal" />
			<span className="module-index">{product.number}</span>
			<span className="module-copy">
				<strong>{product.name}</strong>
				<small>{product.kicker}</small>
			</span>
			<span className="module-status">{product.status}</span>
		</MotionLink>
	);
}

export function EngineeringArchitectureDiagram() {
	const reduceMotion = useReducedMotion();
	const [isPulsed, setIsPulsed] = useState(false);
	const moduleRows = Math.max(1, Math.ceil(products.length / 2));
	const diagramStyle = {
		"--diagram-height": `${260 + moduleRows * 80}px`,
		"--diagram-height-mobile": `${110 + moduleRows * 80}px`,
		"--bus-length": `${52 + (moduleRows - 1) * 86}px`,
		"--bus-length-mobile": `${36 + (moduleRows - 1) * 68}px`,
	} as React.CSSProperties;

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
				<span>SYS / ARCHITECTURE</span>
				<span>{String(products.length).padStart(2, "0")} MODULES / ONLINE</span>
			</div>
			<div className="architecture-body">
				<div className="architecture-bus" aria-hidden="true" />
				<div className="architecture-modules">
					{products.map((product, index) => (
						<ArchitectureModule
							key={product.slug}
							product={product}
							index={index}
							reduceMotion={reduceMotion}
						/>
					))}
				</div>
				<motion.button
					className="architecture-core"
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
					<i /> SYSTEM READY
				</span>
			</div>
		</div>
	);
}
