export type InitiativeStatus = "Idea" | "Exploring" | "In development";

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
		slug: "rapid-prototyping",
		number: "01",
		title: "Rapid Prototyping",
		summary:
			"Taking a product idea straight from the customer and turning it into something real, fast, so ideas can be tested and refined against the real world instead of a slide deck.",
		tags: ["Prototyping", "Product development"],
		status: "Exploring",
		body: [
			"A lot of good ideas die in the gap between 'what if we built this' and actually holding something in your hands. We want to close that gap: take a customer's idea, however rough, and get a working prototype in front of them as quickly as possible.",
			"That could be a functional hardware mockup, a working software demo, or a hybrid of both, whatever gets us to something testable the fastest. The goal isn't a polished product on the first pass, it's a real, tangible version of the idea that can be poked at, used, and improved.",
			"We're building out the process now: how we scope an idea quickly, what tools and techniques let us move fast without cutting corners that matter, and how we hand off a validated prototype to the next stage of development.",
		],
	},
	{
		slug: "consumer-electronics",
		number: "02",
		title: "Consumer Electronics",
		summary:
			"Designing, building, and selling thoughtfully made technology products that solve real problems and are meant to be used every day.",
		tags: ["Hardware", "Product design"],
		status: "Exploring",
		body: [
			"We want to build products that people actually want to own: useful technology that feels considered from the hardware on your desk to the software that makes it work. JP Technology's consumer electronics line is where we take ideas from our own experiments and turn them into products that are ready for the real world.",
			"That means designing the electronics, enclosures, firmware, software, and everything in between, rather than treating hardware as something that gets bolted onto an existing idea. Some products may start as an internal experiment or a prototype for a specific problem, then grow into something we can offer to anyone who finds it useful.",
			"We're still figuring out exactly what the product line will become. The goal is to build a small collection of genuinely useful devices, sell them directly, learn from the people who use them, and keep improving them over time.",
		],
	},
	{
		slug: "adaptive-tools",
		number: "03",
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
