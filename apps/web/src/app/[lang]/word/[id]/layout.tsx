
export default async function WordLayout({ children }: {
	children: React.ReactNode
}) {
	return (
		<div className="w-3/5">
			{children}
		</div>
	)
}
