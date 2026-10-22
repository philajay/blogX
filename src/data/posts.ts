export type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  publishedAt: string;
  readTime: string;
  coverClass: string;
};

export const posts = [
  {
    id: "post-1",
    title: "The quiet power of building in public",
    excerpt:
      "Sharing the messy middle of a project can feel risky. It is also the fastest way to find collaborators, customers, and clarity.",
    author: "Maya Chen",
    category: "Engineering",
    publishedAt: "2026-10-18T12:00:00Z",
    readTime: "6 min",
    coverClass: "from-indigo-500 via-violet-500 to-fuchsia-500",
  },
  {
    id: "post-2",
    title: "Designing interfaces that respect attention",
    excerpt:
      "Good products do not fight for attention. They earn it by making the next step obvious, calm, and a little bit delightful.",
    author: "Idris Patel",
    category: "Design",
    publishedAt: "2026-10-14T12:00:00Z",
    readTime: "5 min",
    coverClass: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    id: "post-3",
    title: "What small teams get right about shipping",
    excerpt:
      "Fewer meetings, shorter paths to feedback, and a shared definition of done can beat a much larger roadmap.",
    author: "Sofia Alvarez",
    category: "Product",
    publishedAt: "2026-10-10T12:00:00Z",
    readTime: "7 min",
    coverClass: "from-orange-500 via-amber-500 to-yellow-400",
  },
  {
    id: "post-4",
    title: "A practical guide to learning in the open",
    excerpt:
      "Publishing your notes turns passive reading into active thinking. Here is a simple routine that makes it stick.",
    author: "Noah Williams",
    category: "Career",
    publishedAt: "2026-10-06T12:00:00Z",
    readTime: "4 min",
    coverClass: "from-sky-500 via-blue-500 to-indigo-500",
  },
  {
    id: "post-5",
    title: "The case for slower software",
    excerpt:
      "Not every feature needs to ship this week. Deliberate pacing can produce calmer tools and more durable decisions.",
    author: "Hana Kim",
    category: "Technology",
    publishedAt: "2026-10-02T12:00:00Z",
    readTime: "8 min",
    coverClass: "from-rose-500 via-pink-500 to-fuchsia-500",
  },
  {
    id: "post-6",
    title: "Notes on writing for people who skim",
    excerpt:
      "Front-load the point, shorten the detours, and let structure do the work. Clear writing is a form of respect.",
    author: "Leo Martins",
    category: "Writing",
    publishedAt: "2026-09-28T12:00:00Z",
    readTime: "5 min",
    coverClass: "from-violet-500 via-purple-500 to-indigo-500",
  },
  {
    id: "post-7",
    title: "Why your side project needs a tiny audience",
    excerpt:
      "A hundred engaged readers will teach you more than a thousand passive visitors. Start smaller than feels comfortable.",
    author: "Priya Raman",
    category: "Community",
    publishedAt: "2026-09-24T12:00:00Z",
    readTime: "6 min",
    coverClass: "from-lime-500 via-green-500 to-emerald-500",
  },
  {
    id: "post-8",
    title: "How constraints make better products",
    excerpt:
      "A tight scope is not the enemy of ambition. It is a forcing function for the decisions that actually matter.",
    author: "Eli Brooks",
    category: "Product",
    publishedAt: "2026-09-20T12:00:00Z",
    readTime: "7 min",
    coverClass: "from-slate-600 via-slate-700 to-slate-900",
  },
  {
    id: "post-9",
    title: "The overlooked craft of debugging",
    excerpt:
      "The best debuggers are not the fastest typists. They are the people who form the sharpest questions about a system.",
    author: "Amara Okafor",
    category: "Engineering",
    publishedAt: "2026-09-16T12:00:00Z",
    readTime: "9 min",
    coverClass: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    id: "post-10",
    title: "AI tools are only as good as your questions",
    excerpt:
      "Models can draft, summarize, and explore. The real leverage comes from knowing what to ask and how to verify it.",
    author: "Jonah Lee",
    category: "AI",
    publishedAt: "2026-09-12T12:00:00Z",
    readTime: "6 min",
    coverClass: "from-fuchsia-500 via-rose-500 to-orange-500",
  },
] satisfies Post[];
