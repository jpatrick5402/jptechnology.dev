export type Product = {
	slug: string;
	number: string;
	name: string;
	kicker: string;
	description: string;
	longDescription: string;
	tags: string[];
	status: string;
	stats: { value: string; label: string }[];
};

export const products: Product[] = [
	{
		slug: "signal-os",
		number: "01",
		name: "Signal OS",
		kicker: "Operational clarity, at speed.",
		description:
			"A calm command center for teams operating in noisy, high-stakes environments.",
		longDescription:
			"Signal OS brings the right context into the room at the right moment. It turns scattered updates, live data, and team judgment into one shared view of what needs to happen next.",
		tags: ["Ops", "Realtime", "AI-assisted"],
		status: "In active development",
		stats: [
			{ value: "04", label: "connected workspaces" },
			{ value: "01", label: "clear next move" },
			{ value: "∞", label: "less noise" },
		],
	},
	{
		slug: "fieldnote",
		number: "02",
		name: "Fieldnote",
		kicker: "The work remembers.",
		description:
			"The shared memory layer for the work that happens away from the desk.",
		longDescription:
			"Fieldnote captures the small observations that usually disappear between meetings. Searchable, shared, and made for motion, it gives every team a better memory of how the work really happens.",
		tags: ["Capture", "Search", "Mobile-first"],
		status: "Private beta",
		stats: [
			{ value: "3×", label: "faster retrieval" },
			{ value: "24/7", label: "field-ready" },
			{ value: "1", label: "shared memory" },
		],
	},
	{
		slug: "northstar",
		number: "03",
		name: "Northstar",
		kicker: "A clearer way forward.",
		description:
			"A decision studio that turns complex inputs into a clear next move.",
		longDescription:
			"Northstar gives teams a place to lay out the variables, test the edges, and make a decision they can explain. It is built for the moment when every option looks equally important.",
		tags: ["Strategy", "Scenarios", "Prototyping"],
		status: "Early access",
		stats: [
			{ value: "06", label: "scenario lenses" },
			{ value: "02", label: "hours to align" },
			{ value: "1", label: "shared direction" },
		],
	},
	{
		slug: "relay",
		number: "04",
		name: "Relay",
		kicker: "The handoff, made visible.",
		description:
			"A lightweight coordination layer for work that moves between people, tools, and places.",
		longDescription:
			"Relay makes the handoff legible. It keeps ownership, context, and the next action attached as work moves through a team, so momentum does not get lost between systems.",
		tags: ["Workflow", "Coordination", "Integrations"],
		status: "Prototype",
		stats: [
			{ value: "12", label: "active handoffs" },
			{ value: "01", label: "shared thread" },
			{ value: "0", label: "lost context" },
		],
	},
	{
		slug: "switchyard",
		number: "05",
		name: "Switchyard",
		kicker: "More signal, less switching.",
		description:
			"A focused workspace for bringing tools and decisions together without adding another silo.",
		longDescription:
			"Switchyard gives complex work a calm control surface. It connects the tools teams already use and surfaces the decisions that need attention without becoming another place to maintain.",
		tags: ["Systems", "Focus", "Tooling"],
		status: "Exploring",
		stats: [
			{ value: "08", label: "connected tools" },
			{ value: "03", label: "decision views" },
			{ value: "1", label: "clear workspace" },
		],
	},
];

export function getProduct(slug: string) {
	return products.find((product) => product.slug === slug);
}
