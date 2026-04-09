import Link from "next/link";
import BlogPostForm from "@/components/blog/BlogPostForm";

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/blog/"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← All posts
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          New blog post
        </h1>
      </header>
      <BlogPostForm mode="new" />
    </div>
  );
}
