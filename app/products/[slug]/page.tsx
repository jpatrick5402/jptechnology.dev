import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "../../components/ProductPage";
import { getProduct, products } from "../../data/products";

type ProductRouteProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
	params,
}: ProductRouteProps): Promise<Metadata> {
	const { slug } = await params;
	const product = getProduct(slug);
	return {
		title: product
			? `${product.name} | JP Technology`
			: "Product | JP Technology",
		description: product?.description,
	};
}

export default async function ProductRoute({ params }: ProductRouteProps) {
	const { slug } = await params;
	const product = getProduct(slug);
	if (!product) notFound();
	return <ProductPage product={product} />;
}
