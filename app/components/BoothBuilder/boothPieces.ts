export type BoothPieceCategory =
	| "wall"
	| "corner"
	| "counter"
	| "header"
	| "shelf"
	| "lightbox"
	| "monitor"
	| "literature";

export type BoothPieceDef = {
	id: string;
	label: string;
	category: BoothPieceCategory;
	/** width, height, depth in feet */
	size: [number, number, number];
	color: string;
	/** secondary surface color, e.g. a countertop, lit panel, or screen */
	accentColor: string;
	description: string;
};

export const BOOTH_PIECES: BoothPieceDef[] = [
	{
		id: "wall-panel",
		label: "Wall Panel",
		category: "wall",
		size: [4, 8, 0.15],
		color: "#7f9488",
		accentColor: "#5f7368",
		description: "Standard 4' modular wall panel for the booth perimeter.",
	},
	{
		id: "corner-post",
		label: "Corner Post",
		category: "corner",
		size: [1, 8, 1],
		color: "#5f7368",
		accentColor: "#435148",
		description: "90-degree corner connector joining two wall runs.",
	},
	{
		id: "counter",
		label: "Reception Counter",
		category: "counter",
		size: [3, 3.5, 2],
		color: "#d99a7f",
		accentColor: "#3a4841",
		description: "Curved-front counter for greeting visitors.",
	},
	{
		id: "header-sign",
		label: "Header Sign",
		category: "header",
		size: [8, 1.5, 0.3],
		color: "#6b7f73",
		accentColor: "#d9f95b",
		description: "Backlit header sign mounted above the entrance.",
	},
	{
		id: "shelf",
		label: "Display Shelf",
		category: "shelf",
		size: [3, 0.15, 1],
		color: "#a9b3a8",
		accentColor: "#5f7368",
		description: "Wall-mounted shelf for literature or product display.",
	},
	{
		id: "lightbox",
		label: "Lightbox Panel",
		category: "lightbox",
		size: [3, 7, 0.3],
		color: "#6b7f73",
		accentColor: "#fff4df",
		description: "Illuminated graphic panel for booth branding.",
	},
	{
		id: "monitor",
		label: "Monitor Mount",
		category: "monitor",
		size: [2, 3.5, 0.3],
		color: "#6b7f73",
		accentColor: "#3aa0ff",
		description: "Wall-mounted monitor for video content.",
	},
	{
		id: "literature-stand",
		label: "Literature Stand",
		category: "literature",
		size: [1.5, 3.5, 1],
		color: "#c7d0c6",
		accentColor: "#8fa89c",
		description: "Freestanding stand for brochures and handouts.",
	},
];

export function getBoothPieceDef(pieceId: string): BoothPieceDef | undefined {
	return BOOTH_PIECES.find((piece) => piece.id === pieceId);
}

export type BoothFootprint = {
	id: string;
	label: string;
	width: number;
	depth: number;
};

export const BOOTH_FOOTPRINTS: BoothFootprint[] = [
	{ id: "10x10", label: "10' x 10'", width: 10, depth: 10 },
	{ id: "10x20", label: "10' x 20'", width: 10, depth: 20 },
	{ id: "20x20", label: "20' x 20'", width: 20, depth: 20 },
];

export type PlacedPiece = {
	id: string;
	pieceId: string;
	/** floor-level position in feet, [x, y, z] */
	position: [number, number, number];
	/** rotation in radians, [x, y, z] */
	rotation: [number, number, number];
};

export type BoothDesign = {
	name: string;
	description: string;
	footprintId: string;
	pieces: PlacedPiece[];
};
