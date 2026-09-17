import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInitiative, initiatives } from "../data";

export function generateStaticParams() {
	return initiatives.map((initiative) => ({ slug: initiative.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const initiative = getInitiative(slug);
	if (!initiative) return {};
	return {
		title: `${initiative.title} | JP Technology`,
		description: initiative.summary,
	};
}

export default async function InitiativePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const initiative = getInitiative(slug);
	if (!initiative) notFound();

	return (
		<main className="product-page">
			<nav className="site-nav" aria-label="Main navigation">
				<Link className="wordmark" href="/">
					<span className="wordmark-mark">JP</span>
					<span>
						Technology<span className="wordmark-dot">.</span>dev
					</span>
				</Link>
			</nav>
			<section className="product-hero product-hero--single section-wrap">
				<div className="product-hero-copy">
					<Link className="back-link" href="/#initiatives">
						<span className="back-link-arrow" aria-hidden="true">
							←
						</span>
						Back to initiatives
					</Link>
					<div className="section-label">
						[ Initiative {initiative.number} ]
					</div>
					<h1>{initiative.title}</h1>
					<p className="product-kicker">{initiative.status}</p>
					<p className="product-long-description">{initiative.summary}</p>
					<div className="product-page-tags">
						{initiative.tags.map((tag) => (
							<span key={tag}>{tag}</span>
						))}
					</div>
				</div>
			</section>
			<section className="product-details section-wrap">
				<div className="section-label">[ Overview ]</div>
				<div className="product-body">
					{initiative.body.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
			</section>
			<section className="product-cta">
				<div>
					<div className="section-label">[ Get involved ]</div>
					<h2>Want to shape this?</h2>
				</div>
				<div>
					<p>Tell us about the daily task you need help with.</p>
					<Link className="submit-button" href="/#idea">
						Share your idea <span aria-hidden="true">↗</span>
					</Link>
				</div>
			</section>
		</main>
	);
}
