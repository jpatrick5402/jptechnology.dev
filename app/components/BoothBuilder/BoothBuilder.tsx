"use client";

import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { Group } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { useIsLightTheme } from "../useTheme";
import {
	BOOTH_FOOTPRINTS,
	BOOTH_PIECES,
	getBoothPieceDef,
	type BoothDesign,
	type BoothPieceDef,
	type PlacedPiece,
} from "./boothPieces";

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

function slugify(value: string) {
	const slug = value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
	return slug || "booth-design";
}

function PieceGeometry({
	def,
	isSelected,
}: {
	def: BoothPieceDef;
	isSelected: boolean;
}) {
	const [width, height, depth] = def.size;
	const highlight = isSelected ? "#d9f95b" : "#000000";
	const highlightIntensity = isSelected ? 0.25 : 0;

	switch (def.category) {
		case "counter": {
			const bodyHeight = height - 0.12;
			return (
				<group>
					<mesh position={[0, bodyHeight / 2, 0]} castShadow receiveShadow>
						<boxGeometry args={[width * 0.94, bodyHeight, depth * 0.9]} />
						<meshStandardMaterial
							color={def.color}
							emissive={highlight}
							emissiveIntensity={highlightIntensity}
						/>
					</mesh>
					<mesh position={[0, bodyHeight + 0.06, 0]} castShadow receiveShadow>
						<boxGeometry args={[width, 0.12, depth]} />
						<meshStandardMaterial color={def.accentColor} />
					</mesh>
				</group>
			);
		}
		case "header": {
			return (
				<group>
					<mesh position={[0, height / 2, 0]} castShadow receiveShadow>
						<boxGeometry args={[width, height, depth]} />
						<meshStandardMaterial
							color={def.color}
							emissive={highlight}
							emissiveIntensity={highlightIntensity}
						/>
					</mesh>
					<mesh position={[0, height / 2, depth / 2 + 0.03]}>
						<boxGeometry args={[width * 0.92, height * 0.65, 0.06]} />
						<meshStandardMaterial
							color={def.accentColor}
							emissive={def.accentColor}
							emissiveIntensity={1.1}
							toneMapped={false}
						/>
					</mesh>
				</group>
			);
		}
		case "shelf": {
			const bracketDepth = depth * 0.8;
			return (
				<group>
					<mesh position={[0, height / 2, 0]} castShadow receiveShadow>
						<boxGeometry args={[width, height, depth]} />
						<meshStandardMaterial
							color={def.color}
							emissive={highlight}
							emissiveIntensity={highlightIntensity}
						/>
					</mesh>
					{[-1, 1].map((side) => (
						<mesh
							key={side}
							position={[
								(side * width) / 2.2,
								-0.3,
								-depth / 2 + bracketDepth / 2,
							]}
							castShadow
						>
							<boxGeometry args={[0.1, 0.6, bracketDepth]} />
							<meshStandardMaterial color={def.accentColor} />
						</mesh>
					))}
				</group>
			);
		}
		case "lightbox": {
			return (
				<group>
					<mesh position={[0, height / 2, 0]} castShadow receiveShadow>
						<boxGeometry args={[width, height, depth]} />
						<meshStandardMaterial
							color={def.color}
							emissive={highlight}
							emissiveIntensity={highlightIntensity}
						/>
					</mesh>
					<mesh position={[0, height / 2, depth / 2 + 0.04]}>
						<boxGeometry args={[width * 0.86, height * 0.86, 0.08]} />
						<meshStandardMaterial
							color={def.accentColor}
							emissive={def.accentColor}
							emissiveIntensity={1.4}
							toneMapped={false}
						/>
					</mesh>
				</group>
			);
		}
		case "monitor": {
			return (
				<group>
					<mesh position={[0, height / 2, 0]} castShadow receiveShadow>
						<boxGeometry args={[width, height, depth]} />
						<meshStandardMaterial
							color={def.color}
							emissive={highlight}
							emissiveIntensity={highlightIntensity}
						/>
					</mesh>
					<mesh position={[0, height / 2, depth / 2 + 0.02]}>
						<boxGeometry args={[width * 0.88, height * 0.82, 0.03]} />
						<meshStandardMaterial
							color={def.accentColor}
							emissive={def.accentColor}
							emissiveIntensity={0.7}
							toneMapped={false}
						/>
					</mesh>
				</group>
			);
		}
		case "literature": {
			const baseHeight = height * 0.85;
			return (
				<group>
					<mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
						<boxGeometry args={[width, baseHeight, depth]} />
						<meshStandardMaterial
							color={def.color}
							emissive={highlight}
							emissiveIntensity={highlightIntensity}
						/>
					</mesh>
					<mesh
						position={[0, baseHeight + 0.08, depth * 0.1]}
						rotation={[-0.35, 0, 0]}
						castShadow
					>
						<boxGeometry args={[width * 1.02, 0.06, depth * 1.05]} />
						<meshStandardMaterial color={def.accentColor} />
					</mesh>
				</group>
			);
		}
		default: {
			// wall panels and corner posts: a plain modular panel/post
			return (
				<mesh position={[0, height / 2, 0]} castShadow receiveShadow>
					<boxGeometry args={[width, height, depth]} />
					<meshStandardMaterial
						color={def.color}
						emissive={highlight}
						emissiveIntensity={highlightIntensity}
					/>
				</mesh>
			);
		}
	}
}

function BoothPieceMesh({
	piece,
	isSelected,
	onSelect,
	registerRef,
}: {
	piece: PlacedPiece;
	isSelected: boolean;
	onSelect: (id: string) => void;
	registerRef: (id: string, group: Group | null) => void;
}) {
	const def = getBoothPieceDef(piece.pieceId);
	const setRef = useCallback(
		(group: Group | null) => registerRef(piece.id, group),
		[piece.id, registerRef],
	);
	if (!def) return null;

	return (
		<group
			ref={setRef}
			position={piece.position}
			rotation={piece.rotation}
			onClick={(event: ThreeEvent<MouseEvent>) => {
				event.stopPropagation();
				onSelect(piece.id);
			}}
		>
			<PieceGeometry def={def} isSelected={isSelected} />
		</group>
	);
}

export function BoothBuilder() {
	const [footprintId, setFootprintId] = useState(BOOTH_FOOTPRINTS[0].id);
	const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [transformMode, setTransformMode] = useState<"translate" | "rotate">(
		"translate",
	);
	const [orbitEnabled, setOrbitEnabled] = useState(true);
	const [boothName, setBoothName] = useState("");
	const [description, setDescription] = useState("");
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		| { type: "idle" }
		| { type: "sending" }
		| { type: "sent" }
		| { type: "error"; message: string }
	>({ type: "idle" });

	const exportGroupRef = useRef<Group>(null);
	const pieceRefs = useRef<Map<string, Group>>(new Map());
	const [, forceRefRender] = useState(0);

	const footprint =
		BOOTH_FOOTPRINTS.find((option) => option.id === footprintId) ??
		BOOTH_FOOTPRINTS[0];

	const design: BoothDesign = useMemo(
		() => ({
			name: boothName,
			description,
			footprintId: footprint.id,
			pieces: placedPieces,
		}),
		[boothName, description, footprint.id, placedPieces],
	);

	const registerPieceRef = useCallback((id: string, group: Group | null) => {
		if (group) {
			if (pieceRefs.current.get(id) === group) return;
			pieceRefs.current.set(id, group);
		} else {
			if (!pieceRefs.current.has(id)) return;
			pieceRefs.current.delete(id);
		}
		// re-render so a freshly mounted piece's transform controls appear immediately
		forceRefRender((value) => value + 1);
	}, []);

	function addPiece(pieceId: string) {
		const index = placedPieces.length;
		const column = index % 6;
		const row = Math.floor(index / 6);
		const id = `${pieceId}-${Date.now()}-${index}`;
		setPlacedPieces((pieces) => [
			...pieces,
			{
				id,
				pieceId,
				position: [
					-footprint.width / 2 + 2 + column * 2,
					0,
					-footprint.depth / 2 + 1 + row * 2,
				],
				rotation: [0, 0, 0],
			},
		]);
		setSelectedId(id);
	}

	function removePiece(id: string) {
		setPlacedPieces((pieces) => pieces.filter((piece) => piece.id !== id));
		if (selectedId === id) setSelectedId(null);
		pieceRefs.current.delete(id);
	}

	function handleTransformChange() {
		if (!selectedId) return;
		const object = pieceRefs.current.get(selectedId);
		if (!object) return;
		setPlacedPieces((pieces) =>
			pieces.map((piece) =>
				piece.id === selectedId
					? {
							...piece,
							position: [
								object.position.x,
								object.position.y,
								object.position.z,
							],
							rotation: [
								object.rotation.x,
								object.rotation.y,
								object.rotation.z,
							],
						}
					: piece,
			),
		);
	}

	function handleDownloadJson() {
		const blob = new Blob([JSON.stringify(design, null, 2)], {
			type: "application/json",
		});
		downloadBlob(blob, `${slugify(boothName)}-booth-design.json`);
	}

	function handleExportGlb() {
		if (!exportGroupRef.current) return;
		const exporter = new GLTFExporter();
		exporter.parse(
			exportGroupRef.current,
			(result) => {
				const blob = new Blob([result as ArrayBuffer], {
					type: "model/gltf-binary",
				});
				downloadBlob(blob, `${slugify(boothName)}-booth-model.glb`);
			},
			(error) => {
				console.error("Booth model export failed", error);
			},
			{ binary: true },
		);
	}

	async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus({ type: "sending" });
		try {
			const response = await fetch("/api/booth-designs", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, design }),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error);
			setStatus({ type: "sent" });
		} catch (error) {
			setStatus({
				type: "error",
				message: error instanceof Error ? error.message : "Please try again.",
			});
		}
	}

	const selectedPiece = placedPieces.find((piece) => piece.id === selectedId);
	const selectedObject = selectedId
		? (pieceRefs.current.get(selectedId) ?? null)
		: null;
	const cameraDistance = Math.max(footprint.width, footprint.depth) * 1.1;
	const isLightTheme = useIsLightTheme();
	const sceneColors = isLightTheme
		? {
				background: "#f4f0e8",
				floor: "#d7d2c4",
				cell: "#b9c2b6",
				section: "#18231f",
			}
		: {
				background: "#18231f",
				floor: "#2c3830",
				cell: "#435148",
				section: "#d9f95b",
			};

	return (
		<div className="booth-builder">
			<aside className="booth-panel">
				<div className="booth-panel-section">
					<label htmlFor="booth-name">Booth name</label>
					<input
						id="booth-name"
						type="text"
						value={boothName}
						onChange={(event) => setBoothName(event.target.value)}
						placeholder="Acme Trade Show Booth"
					/>
				</div>
				<div className="booth-panel-section">
					<label htmlFor="booth-footprint">Booth footprint</label>
					<select
						id="booth-footprint"
						value={footprintId}
						onChange={(event) => setFootprintId(event.target.value)}
					>
						{BOOTH_FOOTPRINTS.map((option) => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
					</select>
				</div>
				<div className="booth-panel-section">
					<label htmlFor="booth-description">Design description</label>
					<textarea
						id="booth-description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="Describe how this booth should look and function."
					/>
				</div>

				<div className="booth-panel-section">
					<span className="booth-panel-label">Add a piece</span>
					<div className="booth-palette">
						{BOOTH_PIECES.map((piece) => (
							<button
								key={piece.id}
								type="button"
								className="booth-palette-item"
								onClick={() => addPiece(piece.id)}
								title={piece.description}
							>
								{piece.label}
							</button>
						))}
					</div>
				</div>

				<div className="booth-panel-section">
					<span className="booth-panel-label">
						Placed pieces ({placedPieces.length})
					</span>
					<ul className="booth-piece-list">
						{placedPieces.map((piece) => {
							const def = getBoothPieceDef(piece.pieceId);
							return (
								<li
									key={piece.id}
									className={
										piece.id === selectedId ? "is-selected" : undefined
									}
								>
									<button type="button" onClick={() => setSelectedId(piece.id)}>
										{def?.label ?? piece.pieceId}
									</button>
									<button
										type="button"
										className="booth-remove-button"
										onClick={() => removePiece(piece.id)}
										aria-label={`Remove ${def?.label ?? "piece"}`}
									>
										✕
									</button>
								</li>
							);
						})}
						{placedPieces.length === 0 && (
							<li className="booth-empty">No pieces placed yet.</li>
						)}
					</ul>
				</div>

				{selectedPiece && (
					<div className="booth-panel-section">
						<span className="booth-panel-label">Move / rotate selection</span>
						<div className="booth-transform-toggle">
							<button
								type="button"
								className={transformMode === "translate" ? "is-active" : ""}
								onClick={() => setTransformMode("translate")}
							>
								Move
							</button>
							<button
								type="button"
								className={transformMode === "rotate" ? "is-active" : ""}
								onClick={() => setTransformMode("rotate")}
							>
								Rotate
							</button>
						</div>
					</div>
				)}

				<div className="booth-panel-section booth-actions">
					<button
						type="button"
						className="submit-button"
						onClick={handleDownloadJson}
					>
						Save design (.json)
					</button>
					<button
						type="button"
						className="submit-button"
						onClick={handleExportGlb}
					>
						Export 3D model (.glb)
					</button>
				</div>

				<form
					className="booth-panel-section booth-email-form"
					onSubmit={handleEmailSubmit}
				>
					<span className="booth-panel-label">Email this design to us</span>
					<input
						type="email"
						required
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="you@company.com"
					/>
					<button
						type="submit"
						className="submit-button"
						disabled={status.type === "sending" || placedPieces.length === 0}
					>
						{status.type === "sending" ? "Sending…" : "Send design"}
					</button>
					{status.type === "sent" && (
						<p className="booth-status-success">Design sent — thank you!</p>
					)}
					{status.type === "error" && (
						<p className="form-error">{status.message}</p>
					)}
				</form>
			</aside>

			<div className="booth-canvas-wrap">
				<Canvas
					shadows
					camera={{
						position: [cameraDistance, cameraDistance * 0.9, cameraDistance],
						fov: 45,
					}}
					onPointerMissed={() => setSelectedId(null)}
				>
					<color attach="background" args={[sceneColors.background]} />
					<ambientLight intensity={0.9} />
					<hemisphereLight
						args={[sceneColors.background, sceneColors.floor, 0.6]}
					/>
					<directionalLight
						position={[footprint.width, footprint.width * 1.5, footprint.depth]}
						intensity={1.1}
						castShadow
					/>
					<Grid
						args={[footprint.width, footprint.depth]}
						cellSize={1}
						cellColor={sceneColors.cell}
						sectionSize={5}
						sectionColor={sceneColors.section}
						fadeDistance={cameraDistance * 3}
						infiniteGrid={false}
					/>
					<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
						<planeGeometry args={[footprint.width, footprint.depth]} />
						<meshStandardMaterial color={sceneColors.floor} />
					</mesh>

					<group ref={exportGroupRef}>
						{placedPieces.map((piece) => (
							<BoothPieceMesh
								key={piece.id}
								piece={piece}
								isSelected={piece.id === selectedId}
								onSelect={setSelectedId}
								registerRef={registerPieceRef}
							/>
						))}
					</group>

					{selectedObject && (
						<TransformControls
							object={selectedObject}
							mode={transformMode}
							translationSnap={1}
							rotationSnap={Math.PI / 2}
							showY={true}
							showX={true}
							showZ={true}
							onMouseDown={() => setOrbitEnabled(false)}
							onMouseUp={() => setOrbitEnabled(true)}
							onObjectChange={handleTransformChange}
						/>
					)}

					<OrbitControls
						makeDefault
						enabled={orbitEnabled}
						target={[0, 1, 0]}
					/>
				</Canvas>
			</div>
		</div>
	);
}
