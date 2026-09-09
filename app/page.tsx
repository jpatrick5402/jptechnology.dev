"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AtomDiagram } from "./components/AtomDiagram";
import { ThemeToggle } from "./components/ThemeToggle";
import { products } from "./data/products";

export default function Home() {
	const [submitted, setSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setSubmitError("");
		const form = event.currentTarget;
		const formData = new FormData(form);

		try {
			const response = await fetch("/api/ideas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					idea: formData.get("idea"),
					email: formData.get("email"),
				}),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error);
			setSubmitted(true);
		} catch (error) {
			setSubmitError(
				error instanceof Error ? error.message : "Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main>
			<nav className="site-nav" aria-label="Main navigation">
				<a className="wordmark" href="#top" aria-label="JP Technology home">
					<span className="wordmark-mark">JP</span>
					<span>
						Technology<span className="wordmark-dot">.</span>dev
					</span>
				</a>
				<div className="nav-links">
					<a href="#about">About</a>
					<a href="#products">Products</a>
					<ThemeToggle />
					<a className="nav-cta" href="#idea">
						Share an idea <span aria-hidden="true">↗</span>
					</a>
				</div>
			</nav>
			<section className="hero section-wrap" id="top">
				<div className="hero-copy">
					<p className="eyebrow">
						<span className="live-dot" /> Hardware + software studio / 2026
					</p>
					<h1>
						Make the
						<br />
						<em>next</em> thing
						<br />
						matter.
					</h1>
					<p className="hero-intro">
						JP Technology Development LLC builds focused technology (hardware
						and software) to deliver custom solutions to your problems
					</p>
					<a className="text-link" href="#products">
						Explore our work <span aria-hidden="true">↓</span>
					</a>
				</div>
				<AtomDiagram />
			</section>
			<section className="ticker" aria-label="Company principles">
				<div>Curious by default</div>
				<span>✳</span>
				<div>Useful over clever</div>
				<span>✳</span>
				<div>Built to last</div>
				<span>✳</span>
				<div>Hardware + software</div>
			</section>
			<section className="about section-wrap" id="about">
				<div className="section-label">[ 01 / About ]</div>
				<div className="about-content">
					<h2>
						Technology should feel like a <span>tailwind.</span>
					</h2>
					<div className="about-text">
						<p>
							We are a small, focused team making hardware and software for the
							space between a good question and a better future.
						</p>
						<p>
							That means staying close to the problem, making the complicated
							feel obvious, and shipping things people are genuinely glad to
							use.
						</p>
						<a className="text-link" href="#idea">
							Start a conversation <span aria-hidden="true">↗</span>
						</a>
					</div>
				</div>
			</section>
			<section className="products section-wrap" id="products">
				<div className="section-heading">
					<div className="section-label">[ 02 / Products ]</div>
					<p>
						Small bets. Real users.
						<br />A growing constellation.
					</p>
				</div>
				<div className="product-list">
					{products.map((product) => (
						<Link
							className="product-row"
							href={`/products/${product.slug}`}
							key={product.number}
						>
							<span className="product-number">{product.number}</span>
							<h3>{product.name}</h3>
							<p>{product.description}</p>
							<div className="product-tags">
								{product.tags.map((tag) => (
									<span key={tag}>{tag}</span>
								))}
							</div>
							<span className="product-arrow" aria-hidden="true">
								↗
							</span>
						</Link>
					))}
				</div>
			</section>
			<section className="idea section-wrap" id="idea">
				<div className="idea-heading">
					<div className="section-label">[ 03 / Open brief ]</div>
					<h2>
						Have a<br />
						<em>strange</em> idea?
					</h2>
					<p>
						Tell us the version that keeps you up at night. We like the weird,
						useful, and half-formed.
					</p>
				</div>
				<div className="idea-form-wrap">
					{submitted ? (
						<div className="success-message">
							<span>✳</span>
							<h3>That is a good one.</h3>
							<p>Your idea is in the right place. We will be in touch soon.</p>
							<button type="button" onClick={() => setSubmitted(false)}>
								Send another idea
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<label>
								What are you thinking about?
								<textarea
									name="idea"
									required
									placeholder="A sentence, a sketch, a big unsolved problem..."
								/>
							</label>
							<label>
								Your email
								<input
									name="email"
									type="email"
									required
									placeholder="you@company.com"
								/>
							</label>
							{submitError && (
								<p className="form-error" role="alert">
									{submitError}
								</p>
							)}
							<button
								className="submit-button"
								disabled={isSubmitting}
								type="submit"
							>
								{isSubmitting ? "Sending..." : "Send the signal"}{" "}
								<span aria-hidden="true">↗</span>
							</button>
						</form>
					)}
				</div>
			</section>
			<footer className="site-footer section-wrap">
				<a className="wordmark" href="#top">
					<span className="wordmark-mark">JP</span>
					<span>
						Technology<span className="wordmark-dot">.</span>dev
					</span>
				</a>
				<p>
					© 2026 JP Technology. Hardware and software for the next question.
				</p>
				<a href="mailto:hello@jptechnology.dev">
					hello@jptechnology.dev <span aria-hidden="true">↗</span>
				</a>
			</footer>
		</main>
	);
}
