export { cn } from "cn";

export const getBaseUrl = (): string => {
	const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
	const vercelUrl = process.env.VERCEL_URL?.trim();
	const baseUrl = configuredUrl || vercelUrl || "http://localhost:3000";

	return /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;
};
