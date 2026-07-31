import { describe, it, expect } from "vitest";
import { getExercises, searchExercises } from "@/lib/exercise-data";
import { getPosts, getPost, searchPosts } from "@/lib/blog-data";

describe("exercise-data", () => {
  it("contains 44 exercises", () => {
    expect(getExercises().length).toBe(44);
  });

  it("has unique slugs", () => {
    const slugs = getExercises().map((e) => e.id);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("searches by name", () => {
    const results = searchExercises("squat", "All");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toMatch(/squat/i);
  });

  it("filters by muscle group", () => {
    const results = searchExercises("", "Chest");
    expect(results.every((e) => e.category === "Chest")).toBe(true);
  });
});

describe("blog-data", () => {
  it("contains posts", () => {
    expect(getPosts().length).toBeGreaterThanOrEqual(6);
  });

  it("gets a post by slug", () => {
    const post = getPost("10-science-backed-habits-for-sustainable-fat-loss");
    expect(post).toBeDefined();
    expect(post?.content).toContain("#");
  });

  it("returns undefined for unknown slug", () => {
    expect(getPost("does-not-exist")).toBeUndefined();
  });

  it("searches posts", () => {
    const results = searchPosts("protein", "All");
    expect(results.length).toBeGreaterThan(0);
  });

  it("filters posts by category", () => {
    const results = searchPosts("", "Nutrition");
    expect(results.every((p) => p.category === "Nutrition")).toBe(true);
  });
});
