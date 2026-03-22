import Link from "next/link";

export default function KMModuleNotFound() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Module not found</h1>
      <p className="mt-2 text-muted-foreground">
        This learning module does not exist or was removed.
      </p>
      <Link
        href="/knowledge-mobilization/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-deep"
      >
        Back to Knowledge Mobilization
      </Link>
    </div>
  );
}
