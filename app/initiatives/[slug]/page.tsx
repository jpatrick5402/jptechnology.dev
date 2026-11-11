import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill, KnowAndGoStatus } from "../../components/StatusPill";
import { ThemeToggle } from "../../components/ThemeToggle";
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
				<ThemeToggle />
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
					{initiative.slug === "knowandgo" ? (
						<KnowAndGoStatus />
					) : (
						<StatusPill status={initiative.status} />
					)}
					<p className="product-long-description">{initiative.summary}</p>
					<div className="product-page-tags">
						{initiative.tags.map((tag) => (
							<span key={tag}>{tag}</span>
						))}
						{initiative.liveUrl && (
							<a
								className="submit-button"
								href={initiative.liveUrl}
								target="_blank"
								rel="noreferrer"
							>
								Visit KnowAndGo <span aria-hidden="true">↗</span>
							</a>
						)}
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
				{initiative.liveUrl ? (
					<>
						<div>
							<div className="section-label">[ Get involved ]</div>
							<h2>See it live</h2>
						</div>
						<div>
							<p>
								KnowAndGo is live now — explore the map and see what&apos;s
								happening around you.
							</p>
							<a
								className="submit-button"
								href={initiative.liveUrl}
								target="_blank"
								rel="noreferrer"
							>
								Visit KnowAndGo <span aria-hidden="true">↗</span>
							</a>
						</div>
					</>
				) : (
					<>
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
					</>
				)}
			</section>
			<footer className="site-footer section-wrap">
				<Link className="wordmark" href="/">
					<span className="wordmark-mark">JP</span>
					<span>
						Technology<span className="wordmark-dot">.</span>dev
					</span>
				</Link>
				<p>
					© 2026 JP Technology Development. Better tools for difficult work.
				</p>
				<a href="mailto:hello@jptechnology.dev">
					hello@jptechnology.dev <span aria-hidden="true">↗</span>
				</a>
			</footer>
		</main>
	);
}
