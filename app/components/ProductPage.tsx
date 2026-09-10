import Link from "next/link";
import type { Product } from "../data/products";
import { ThemeToggle } from "./ThemeToggle";

type ProductPageProps = {
	product: Product;
};

export function ProductPage({ product }: ProductPageProps) {
	return (
		<main className="product-page">
			<nav className="site-nav" aria-label="Main navigation">
				<Link className="wordmark" href="/" aria-label="JP Technology home">
					<span className="wordmark-mark">JP</span>
					<span>
						Technology<span className="wordmark-dot">.</span>dev
					</span>
				</Link>
				<div className="nav-links">
					<Link href="/#about">About</Link>
					<Link href="/#products">Products</Link>
					<ThemeToggle />
					<Link className="nav-cta" href="/#idea">
						Share an idea <span aria-hidden="true">↗</span>
					</Link>
				</div>
			</nav>

			<section className="product-hero section-wrap">
				<div className="product-hero-copy">
					<Link className="back-link" href="/#products">
						<span className="back-link-arrow" aria-hidden="true">
							←
						</span>
						<span>Back to products</span>
					</Link>
					<p className="eyebrow">
						<span className="live-dot" /> Product / {product.number}
					</p>
					<h1>{product.name}</h1>
					<p className="product-kicker">{product.kicker}</p>
					<p className="product-long-description">{product.longDescription}</p>
					<div className="product-page-tags">
						{product.tags.map((tag) => (
							<span key={tag}>{tag}</span>
						))}
					</div>
				</div>
				<div
					className="product-visual"
					aria-label={`${product.name} abstract interface preview`}
					role="img"
				>
					<div className="product-visual-grid" />
					<div className="visual-window">
						<div className="window-bar">
							<span />
							<span />
							<span />
							<b>{product.name.toUpperCase()}</b>
						</div>
						<div className="window-content">
							<div className="window-line wide" />
							<div className="window-line" />
							<div className="window-line short" />
							<div className="window-chart">
								<i />
								<i />
								<i />
								<i />
								<i />
							</div>
							<div className="window-badge">{product.number} / LIVE</div>
						</div>
					</div>
					<div className="visual-label">
						{product.status}
						<br />
						<span>JP Technology / 2026</span>
					</div>
				</div>
			</section>

			<section className="product-details section-wrap">
				<div className="section-label">[ Product signal ]</div>
				<div className="product-stats">
					{product.stats.map((stat) => (
						<div className="product-stat" key={stat.label}>
							<strong>{stat.value}</strong>
							<span>{stat.label}</span>
						</div>
					))}
				</div>
			</section>

			<section className="product-cta">
				<div>
					<div className="section-label">[ Keep exploring ]</div>
					<h2>
						Make room for
						<br />
						<em>better systems.</em>
					</h2>
				</div>
				<div>
					<p>
						Have a problem this product could solve, or a system that needs a
						better shape?
					</p>
					<Link className="submit-button" href="/#idea">
						Start a conversation <span aria-hidden="true">↗</span>
					</Link>
				</div>
			</section>

			<footer className="site-footer section-wrap">
				<Link className="wordmark" href="/">
					<span className="wordmark-mark">JP</span>
					<span>
						Technology<span className="wordmark-dot">.</span>dev
					</span>
				</Link>
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
