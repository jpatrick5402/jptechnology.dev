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
	tags: string[];
	status: InitiativeStatus;
	body: string[];
}

export const initiatives: Initiative[] = [
	{
		slug: "knowandgo",
		number: "01",
		title: "KnowAndGo.info",
		summary: "All of the good things about your community centralized online",
		tags: ["Web App", "Customer Solution"],
		status: "Active",
		body: [
			"Too often the gems our our local communities are missed out on due to the large spread of information",
			"KnowAndGo.info centralizes that data for you to allow you to know whats happening around you and proactively go support them",
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
