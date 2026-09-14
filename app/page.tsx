"use client";

import { FormEvent, useState } from "react";
import { EngineeringArchitectureDiagram } from "./components/EngineeringArchitectureDiagram";
import { ThemeToggle } from "./components/ThemeToggle";

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
						<span className="live-dot" /> For people doing work that does not
						fit a template.
					</p>
					<h1>
						<span className="path-step">
							<em>Real</em>
							<span>People</span>
						</span>
						<span className="path-arrow" aria-hidden="true">
							→
						</span>
						<span className="path-step">
							<em>Tough</em>
							<span>Problems</span>
						</span>
						<span className="path-arrow" aria-hidden="true">
							→
						</span>
						<span className="path-step">
							<em>Useful</em>
							<span>Solutions</span>
						</span>
					</h1>
					<p className="hero-intro">
						JP Technology builds hardware and software alongside the people
						closest to the problem, turning complicated work into something
						clearer, calmer, and more useful.
					</p>
					<a className="text-link" href="#products">
						Explore our work <span aria-hidden="true">↓</span>
					</a>
				</div>
				<EngineeringArchitectureDiagram />
			</section>
			<section className="ticker" aria-label="Company principles">
				<div>Start with the problem</div>
				<span>✳</span>
				<div>Make complexity useful</div>
				<span>✳</span>
				<div>Build for the real world</div>
				<span>✳</span>
				<div>Leave a clear interface</div>
			</section>
			<section className="about section-wrap" id="about">
				<div className="section-label">[ 01 / About ]</div>
				<div className="about-content">
					<h2>
						Good technology gives people room to do their{" "}
						<span>best work.</span>
					</h2>
					<div className="about-text">
						<p>
							We are a small, focused team building with the people who live
							with the problem every day.
						</p>
						<p>
							That means listening closely, respecting real constraints, and
							making complicated work feel more legible and less lonely.
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
						Tools for the work in front of you.
						<br />
						Built around how people really work.
					</p>
				</div>
				<div className="products-empty-state">
					<span className="products-empty-mark" aria-hidden="true">
						✳
					</span>
					<div>
						<h3>Hard at work.</h3>
						<p>
							Nothing released yet. We are building the right things for the
							work ahead.
						</p>
					</div>
				</div>
			</section>
			<section className="idea section-wrap" id="idea">
				<div className="idea-heading">
					<div className="section-label">[ 03 / Open brief ]</div>
					<h2>
						What is getting
						<br />
						in the way?
					</h2>
					<p>
						Bring us the stubborn workflow, the rough sketch, or the part of the
						day that keeps asking too much of the people doing the work.
					</p>
				</div>
				<div className="idea-form-wrap">
					{submitted ? (
						<div className="success-message">
							<span>✳</span>
							<h3>Thanks for trusting us with it.</h3>
							<p>
								Your problem is in the right place. We will be in touch soon.
							</p>
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
									placeholder="A problem, a sketch, a stubborn workflow..."
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
								{isSubmitting ? "Sending..." : "Send the brief"}{" "}
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
				<p>© 2026 JP Technology. Better tools for difficult work.</p>
				<a href="mailto:hello@jptechnology.dev">
					hello@jptechnology.dev <span aria-hidden="true">↗</span>
				</a>
			</footer>
		</main>
	);
}
