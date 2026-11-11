export type InitiativeStatus =
	| "Idea"
	| "Exploring"
	| "In development"
	| "Active";

export interface Initiative {
	slug: string;
	number: string;
	title: string;
	summary: string;
	liveUrl?: string;
	tags: string[];
	status: InitiativeStatus;
	body: string[];
}

export const initiatives: Initiative[] = [
	{
		slug: "knowandgo",
		number: "01",
		title: "KnowAndGo",
		summary:
			"A community bulletin board on a map for local events, new businesses, garage sales, food pantries, and Little Libraries.",
		liveUrl: "https://knowandgo.info",
		tags: ["Web App", "Customer Solution"],
		status: "Active",
		body: [
			"Too often, the good things in our local communities get missed because information is spread across so many places.",
			"KnowAndGo brings it together on one map, so you can see what's happening around you and go support it.",
		],
	},
	{
		slug: "adaptive-tools",
		number: "02",
		title: "Adaptive Tools",
		summary:
			"Custom, and where it counts personalized, hardware and software that help people with disabilities and special needs handle daily tasks with more independence.",
		tags: ["Assistive tech", "Custom builds"],
		status: "In development",
		body: [
			"Most assistive tools are built for the broadest possible market, which means they rarely fit any one person perfectly. We're starting from the opposite direction: understanding a specific person's daily tasks, their environment, and what independence actually looks like for them, then building the tool to match.",
			"That can mean a 3D-printed grip shaped for one hand, a switch-adapted control for a device that was never designed to be accessible, or small software that turns a multi-step task into one that's easier to start and finish alone.",
			"We're early. Right now we're gathering the first few real-world cases to build alongside, learning what's repeatable versus what needs to stay bespoke, and shaping the process for how we'll take on future requests.",
		],
	},
];

export function getInitiative(slug: string) {
	return initiatives.find((initiative) => initiative.slug === slug);
}
