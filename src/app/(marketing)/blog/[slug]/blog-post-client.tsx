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

  const related = getPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

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
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <header className="mt-10">
          <h1 className="font-display text-foreground text-4xl leading-tight font-bold tracking-[-0.02em] sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge variant="accent">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="border-border text-muted-foreground mt-6 flex flex-wrap items-center gap-6 border-y py-5 text-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground font-medium">{post.author}</p>
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
          <h2 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-[-0.01em]">
            <MessageCircle className="text-primary h-5 w-5" />
            Comments ({comments.length})
          </h2>

          <form
            onSubmit={submitComment}
            className="border-border bg-surface/60 mt-6 space-y-4 rounded-xl border p-6"
          >
            <input
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Your name"
              className="border-border bg-surface text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-primary/20 h-11 w-full rounded-xl border px-4 text-sm focus:ring-2 focus:outline-none"
              aria-label="Your name"
              required
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              className="border-border bg-surface text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
              aria-label="Comment"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Post comment
              </Button>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-border bg-surface/60 rounded-xl border p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{comment.initials}</AvatarFallback>
                    </Avatar>
                    <p className="text-foreground text-sm font-semibold">{comment.name}</p>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Be the first to comment on this article.
              </p>
            )}
          </div>
        </section>

        {/* Related */}
        <section className="border-border mt-16 border-t pt-10">
          <h2 className="text-foreground text-2xl font-bold tracking-[-0.01em]">Keep reading</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group border-border bg-surface/60 hover:border-white/15 rounded-xl border p-5 transition-colors duration-300"
              >
                <Badge variant="secondary" className="mb-3">
                  {p.category}
                </Badge>
                <h3 className="text-foreground group-hover:text-primary text-sm leading-snug font-semibold tracking-[-0.01em] transition-colors">
                  {p.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-xs">{p.readTime} min read</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
