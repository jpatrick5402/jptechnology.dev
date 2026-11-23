"use client";

import { useState, type FormEvent } from "react";

export function AdaptiveToolsForm() {
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
			const response = await fetch("/api/adaptive-tools", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.get("name"),
					email: formData.get("email"),
					message: formData.get("message"),
					website: formData.get("website"),
				}),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error);
			setSubmitted(true);
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: "We could not send your message right now. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	if (submitted) {
		return (
			<div className="success-message">
				<span aria-hidden="true" />
				<h3>Thanks — we got it.</h3>
				<p>Your message is on its way. We will reply by email soon.</p>
				<button type="button" onClick={() => setSubmitted(false)}>
					Send another message
				</button>
			</div>
		);
	}

	return (
		<form className="adaptive-form" onSubmit={handleSubmit}>
			<label>
				Your name (optional)
				<input name="name" type="text" placeholder="Your name" />
			</label>
			<label>
				Your email
				<input
					name="email"
					type="email"
					required
					placeholder="you@example.com"
				/>
			</label>
			<label>
				The daily task you need help with
				<textarea
					name="message"
					required
					placeholder="Tell us about the task, the device, or the routine that is harder than it should be..."
				/>
			</label>
			<input
				className="honeypot"
				name="website"
				type="text"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
			/>
			{submitError && (
				<p className="form-error" role="alert">
					{submitError}
				</p>
			)}
			<button className="submit-button" disabled={isSubmitting} type="submit">
				{isSubmitting ? "Sending..." : "Send"}{" "}
				<span aria-hidden="true">↗</span>
			</button>
		</form>
	);
}
