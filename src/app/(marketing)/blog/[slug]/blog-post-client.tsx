"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Clock, Eye, Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Markdown } from "@/components/shared/markdown";
import { cn } from "@/lib/utils";
import { getPost, getPosts } from "@/lib/blog-data";

interface Comment {
  id: string;
  name: string;
  initials: string;
  content: string;
  createdAt: string;
}

export function BlogPostClient({ slug }: { slug: string }) {
  const post = getPost(slug);
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [commentText, setCommentText] = React.useState("");
  const [commentName, setCommentName] = React.useState("");

  React.useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetch(`/api/blog/${slug}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments ?? []);
        }
      } catch {
        // offline fallback: keep empty
      }
    }
    loadComments();
  }, [slug]);

  if (!post) return null;

  const related = getPosts().filter((p) => p.slug !== slug).slice(0, 3);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim()) return;
    const optimistic: Comment = {
      id: `local-${Date.now()}`,
      name: commentName,
      initials: commentName.slice(0, 2).toUpperCase(),
      content: commentText,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [optimistic, ...prev]);
    setCommentText("");
    try {
      await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: commentName, content: commentText }),
      });
    } catch {
      // offline: keep optimistic comment
    }
  };

  return (
    <article className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to blog
        </Link>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border py-5 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{post.author}</p>
                <p className="text-xs">{post.authorRole}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()}
            </span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLiked((v) => !v)}
            aria-pressed={liked}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-primary text-primary")} />
            {post.likes + (liked ? 1 : 0)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
          >
            <Bookmark className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>

        <Markdown className="mt-10">{post.content}</Markdown>

        {/* Comments */}
        <section className="mt-16">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            <MessageCircle className="h-5 w-5 text-primary" />
            Comments ({comments.length})
          </h2>

          <form onSubmit={submitComment} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <input
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              aria-label="Your name"
              required
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              aria-label="Comment"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Post Comment
              </Button>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{comment.initials}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold text-foreground">{comment.name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {comment.content}
                </p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Be the first to comment on this article.
              </p>
            )}
          </div>
        </section>

        {/* Related */}
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Keep <span className="text-gradient">Reading</span>
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/30"
              >
                <Badge variant="secondary" className="mb-3">
                  {p.category}
                </Badge>
                <h3 className="font-display text-sm font-semibold leading-snug tracking-wide text-foreground transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">{p.readTime} min read</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
