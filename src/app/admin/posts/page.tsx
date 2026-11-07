import { AppNavbar } from "@/components/admin/AppNavbar";
import { PostsClient } from "./posts-client";
import { readPostsLive } from "@/lib/admin-store";

export const metadata = {
  title: "Articles & News | Pelican Admin",
};

export default async function PostsPage() {
  const posts = await readPostsLive();

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <PostsClient initialPosts={posts} />
    </div>
  );
}
