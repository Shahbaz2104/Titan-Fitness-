"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery, useApiMutation } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  status: string;
  readTimeMin: number;
  createdAt: string;
  publishedAt: string | null;
  author: { name: string };
  category: { name: string; slug: string } | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  status: string;
  readTimeMin: string;
  tags: string;
}

const EMPTY_FORM: BlogForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "none",
  status: "DRAFT",
  readTimeMin: "5",
  tags: "",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "outline",
  PUBLISHED: "success",
  ARCHIVED: "warning",
};

export function BlogAdmin() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState<BlogForm>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const {
    data: posts,
    isLoading,
    isError,
  } = useApiQuery<BlogPost[]>(QUERY_KEYS.adminBlogPosts, "/api/admin/blog-posts");
  const { data: categories } = useApiQuery<BlogCategory[]>(
    [...QUERY_KEYS.blog, "categories"],
    "/api/posts/categories"
  );
  const createPost = useApiMutation("/api/admin/blog-posts");
  const deletePost = useApiMutation(`/api/admin/blog-posts/${deletingId ?? ""}`, "DELETE");

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminBlogPosts });

  const handleCreate = async () => {
    if (!form.title.trim() || form.content.trim().length < 10) {
      toast.error("Title is required and content needs at least 10 characters");
      return;
    }
    setSaving(true);
    try {
      await createPost({
        title: form.title.trim(),
        excerpt: form.excerpt.trim() || null,
        content: form.content,
        coverImage: form.coverImage.trim() || null,
        categoryId: form.categoryId === "none" ? null : form.categoryId,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: form.status,
        readTimeMin: Number(form.readTimeMin) || 5,
      });
      toast.success(form.status === "PUBLISHED" ? "Post published" : "Draft saved");
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      await refresh();
    } catch {
      toast.error("Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    setDeletingId(post.id);
    try {
      await deletePost();
      toast.success("Post deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Blog posts"
        description="Manage the Titan Fitness blog"
        icon={<BookOpen className="h-5 w-5" />}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New post
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : isError || !posts ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="text-warning h-8 w-8" />
            <p className="text-muted-foreground text-sm">Could not load posts.</p>
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <BookOpen className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground text-sm">No blog posts yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-border bg-surface/60 hover:border-primary/30 flex flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-foreground truncate font-semibold">{post.title}</p>
                  {post.category && <Badge variant="outline">{post.category.name}</Badge>}
                </div>
                <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                  {post.excerpt ?? "No excerpt"} · {post.readTimeMin} min read
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  By {post.author.name} · {formatDate(post.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <Badge variant={STATUS_STYLES[post.status] as never}>{post.status}</Badge>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="text-destructive hover:border-destructive/50"
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post.id}
                  aria-label="Delete post"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New blog post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="5 Tips to Build Muscle Faster"
              />
            </div>
            <div className="space-y-2">
              <Label>Excerpt (optional)</Label>
              <Input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short summary shown in listings"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your post here… (min 10 characters)"
                rows={6}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm({ ...form, categoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {(categories ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Read time (min)</Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.readTimeMin}
                  onChange={(e) => setForm({ ...form, readTimeMin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="nutrition, recovery"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover image URL (optional)</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Saving…" : form.status === "PUBLISHED" ? "Publish post" : "Save draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
