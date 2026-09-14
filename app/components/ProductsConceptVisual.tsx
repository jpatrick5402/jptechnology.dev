"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
	Color,
	Quaternion,
	Vector3,
	type Group,
	type MeshBasicMaterial,
	type MeshStandardMaterial,
} from "three";

function SystemModel({ selectedModule }: { selectedModule: number }) {
	const groupRef = useRef<Group>(null);
	const coreRef = useRef<Group>(null);
	const reduceMotion = useReducedMotion();

	useFrame((state, delta) => {
		if (!groupRef.current || reduceMotion) return;
		groupRef.current.rotation.y += delta * 0.16;
		groupRef.current.rotation.x =
			Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
		if (coreRef.current) {
			const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.06;
			coreRef.current.scale.setScalar(pulse);
		}
	});

	return (
		<group ref={groupRef} rotation={[0.18, -0.35, 0]}>
			<group ref={coreRef}>
				<mesh>
					<icosahedronGeometry args={[0.68, 1]} />
					<meshStandardMaterial
						color="#d9f95b"
						emissive="#65751f"
						emissiveIntensity={0.35}
						flatShading
					/>
				</mesh>
				<mesh scale={1.35}>
					<icosahedronGeometry args={[0.68, 1]} />
					<meshBasicMaterial
						color="#d9f95b"
						transparent
						opacity={0.1}
						wireframe
					/>
				</mesh>
			</group>
			<Module position={[0.9, 0.9, 0.9]} selected={selectedModule === 0} />
			<Module
				position={[0.9, -0.9, -0.9]}
				rotation={[0, Math.PI / 2, 0]}
				selected={selectedModule === 1}
			/>
			<Module
				position={[-0.9, 0.9, -0.9]}
				rotation={[0, Math.PI / 2, 0]}
				selected={selectedModule === 2}
			/>
			<Module position={[-0.9, -0.9, 0.9]} selected={selectedModule === 3} />
			<Connection
				start={[0.9, 0.9, 0.9]}
				end={[0, 0, 0]}
				color={selectedModule === 0 ? "#ff765f" : "#435148"}
			/>
			<Connection
				start={[0.9, -0.9, -0.9]}
				end={[0, 0, 0]}
				color={selectedModule === 1 ? "#ff765f" : "#435148"}
			/>
			<Connection
				start={[-0.9, 0.9, -0.9]}
				end={[0, 0, 0]}
				color={selectedModule === 2 ? "#ff765f" : "#435148"}
			/>
			<Connection
				start={[-0.9, -0.9, 0.9]}
				end={[0, 0, 0]}
				color={selectedModule === 3 ? "#ff765f" : "#435148"}
			/>
		</group>
	);
}

function Module({
	position,
	rotation = [0, 0, 0],
	selected,
}: {
	position: [number, number, number];
	rotation?: [number, number, number];
	selected: boolean;
}) {
	const bodyMaterialRef = useRef<MeshStandardMaterial>(null);
	const outlineMaterialRef = useRef<MeshBasicMaterial>(null);
	const moduleRef = useRef<Group>(null);
	const bodyTargetColor = useRef(new Color("#18231f"));
	const outlineTargetColor = useRef(new Color("#435148"));

	useFrame((_, delta) => {
		const blend = 1 - Math.exp(-delta * 8);
		bodyTargetColor.current.set(selected ? "#ff765f" : "#18231f");
		outlineTargetColor.current.set(selected ? "#ff765f" : "#435148");

		bodyMaterialRef.current?.color.lerp(bodyTargetColor.current, blend);
		outlineMaterialRef.current?.color.lerp(outlineTargetColor.current, blend);
		if (bodyMaterialRef.current) {
			bodyMaterialRef.current.emissiveIntensity +=
				((selected ? 0.45 : 0) - bodyMaterialRef.current.emissiveIntensity) *
				blend;
		}
		if (outlineMaterialRef.current) {
			outlineMaterialRef.current.opacity +=
				((selected ? 1 : 0.65) - outlineMaterialRef.current.opacity) * blend;
		}
		if (moduleRef.current) {
			const targetScale = selected ? 1.1 : 1;
			moduleRef.current.scale.x +=
				(targetScale - moduleRef.current.scale.x) * blend;
			moduleRef.current.scale.y +=
				(targetScale - moduleRef.current.scale.y) * blend;
			moduleRef.current.scale.z +=
				(targetScale - moduleRef.current.scale.z) * blend;
		}
	});

	return (
		<group ref={moduleRef} position={position} rotation={rotation}>
			<mesh>
				<boxGeometry args={[0.72, 0.42, 0.62]} />
				<meshStandardMaterial
					ref={bodyMaterialRef}
					color="#18231f"
					emissive="#7d241a"
					emissiveIntensity={0}
					roughness={0.5}
					metalness={0.3}
				/>
			</mesh>
			<mesh scale={1.04}>
				<boxGeometry args={[0.72, 0.42, 0.62]} />
				<meshBasicMaterial
					ref={outlineMaterialRef}
					color="#435148"
					wireframe
					transparent
					opacity={0.65}
				/>
			</mesh>
		</group>
	);
}

function Connection({
	start,
	end,
	color,
}: {
	start: [number, number, number];
	end: [number, number, number];
	color: string;
}) {
	const midpoint = new Vector3(
		(start[0] + end[0]) / 2,
		(start[1] + end[1]) / 2,
		(start[2] + end[2]) / 2,
	);
	const direction = new Vector3(...start).sub(new Vector3(...end));
	const length = direction.length();
	const quaternion = new Quaternion().setFromUnitVectors(
		new Vector3(1, 0, 0),
		direction.normalize(),
	);

	return (
		<mesh position={midpoint} quaternion={quaternion} renderOrder={2}>
			<boxGeometry args={[length, 0.018, 0.018]} />
			<meshBasicMaterial
				color={color}
				transparent
				opacity={0.65}
				depthTest
				depthWrite={false}
			/>
		</mesh>
	);
}

export function ProductsConceptVisual() {
	const [selectedModule, setSelectedModule] = useState(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) return;
		const highlightTimer = window.setInterval(() => {
			setSelectedModule((currentModule) => (currentModule + 1) % 4);
		}, 2400);
		return () => window.clearInterval(highlightTimer);
	}, [reduceMotion]);

	return (
		<div
			className="products-heading-visual"
			aria-label="Conceptual model of people, problems, and useful tools"
			role="img"
		>
			<div className="products-visual-label">SYSTEM / IN DEVELOPMENT</div>
			<Canvas camera={{ position: [0, 0, 6.8], fov: 38 }} dpr={[1, 1.5]}>
				<ambientLight intensity={1.3} />
				<directionalLight
					position={[3, 4, 5]}
					intensity={2.2}
					color="#f4f0e8"
				/>
				<pointLight
					position={[-3, -2, 2]}
					intensity={8}
					distance={8}
					color="#ff765f"
				/>
				<SystemModel selectedModule={selectedModule} />
				<OrbitControls
					enablePan={false}
					enableZoom={false}
					rotateSpeed={0.7}
					autoRotate
					autoRotateSpeed={0.5}
				/>
			</Canvas>
			<div className="products-visual-caption">
				HARDWARE / SOFTWARE / SIGNAL · DRAG / SWIPE TO ROTATE
			</div>
		</div>
	);
}
