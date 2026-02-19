import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronRight, Search, BookOpen, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const categories = ["All", "Health", "Education", "Awareness", "Stories"] as const;

type Category = (typeof categories)[number];

type BlogCategoryApi = "Health" | "Education" | "Awareness" | "Stories";

type Article = {
  id: number;
  slug: string;
  category: BlogCategoryApi;
  title: string;
  excerpt: string | null;
  created_at: string;
  read_time_minutes: number | null;
  highlight: boolean;
};

type ArticleDetail = Article & {
  content: string;
  updated_at: string;
};

const Blog = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        if (slug) {
          const data = await api.getBlogBySlug(slug);
          setArticleDetail(data);
        } else {
          const data = await api.getBlogs();
          setArticles(data);
        }
      } catch (err) {
        console.error("Failed to load blogs", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [slug]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const categoryLabel = article.category;
      const matchesCategory =
        activeCategory === "All" || categoryLabel.toLowerCase() === activeCategory.toLowerCase();
      if (!matchesCategory) return false;
      if (!query) return true;
      const haystack = `${article.title} ${article.excerpt || ""} ${categoryLabel}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeCategory, searchQuery, articles]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isDetailView = Boolean(slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      <Navbar />
      <main className="pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-[12%] w-[420px] h-[420px] bg-gradient-to-br from-red-200/20 to-rose-300/15 rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-[8%] w-[520px] h-[520px] bg-gradient-to-tl from-pink-200/20 to-red-200/15 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <section className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-red-100 shadow-md mb-4">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold tracking-[0.2em] text-red-700 uppercase">
                Knowledge Hub
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Blog & Awareness
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Learn about blood donation through articles, stories, and educational content created
              to inspire confident, regular donors.
            </p>
          </section>

          {!isDetailView && (
          <section className="max-w-4xl mx-auto mb-12 space-y-6">
            <Card className="bg-white/95 border-red-50 shadow-xl rounded-3xl">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-red-700">Search articles</p>
                      <p className="text-xs text-gray-500">
                        Find guidance on eligibility, health tips, and real donor stories.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search articles, topics, or keywords..."
                      className="h-12 rounded-2xl bg-white/90 pl-11 pr-4 text-sm border-red-100 focus-visible:ring-red-500"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {categories.map((category) => {
                      const isActive = activeCategory === category;
                      return (
                        <Button
                          key={category}
                          type="button"
                          variant={isActive ? "pill" : "pillLight"}
                          size="pill"
                          onClick={() => setActiveCategory(category)}
                          className={
                            isActive
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }
                        >
                          {category}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          )}

          {isDetailView ? (
            <section className="max-w-3xl mx-auto">
              {loading && (
                <div className="flex justify-center py-10 text-sm text-gray-500">
                  Loading article...
                </div>
              )}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-red-100 bg-white/70 px-6 py-10 text-center text-sm text-gray-500">
                  <p className="mb-1 font-medium text-gray-700">Unable to load article</p>
                  <p>{error}</p>
                </div>
              )}
              {!loading && !error && articleDetail && (
                <Card className="relative overflow-hidden rounded-3xl border-red-50 bg-white/95 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-500/5" />
                  <CardContent className="relative p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge className="border-none bg-red-50 text-[11px] font-semibold uppercase tracking-wide text-red-700">
                          {articleDetail.category}
                        </Badge>
                        {articleDetail.highlight && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                            Featured
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate("/blog")}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        ← Back to articles
                      </button>
                    </div>
                    <div className="space-y-3">
                      <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                        {articleDetail.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(articleDetail.created_at)}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {articleDetail.read_time_minutes
                              ? `${articleDetail.read_time_minutes} min read`
                              : "Read time"}
                          </span>
                        </span>
                      </div>
                    </div>
                    {articleDetail.excerpt && (
                      <p className="text-sm md:text-base leading-relaxed text-gray-700 bg-red-50/60 border border-red-100 rounded-2xl px-4 py-3">
                        {articleDetail.excerpt}
                      </p>
                    )}
                    <div className="prose prose-sm md:prose-base max-w-none text-gray-800 whitespace-pre-line">
                      {articleDetail.content}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>
          ) : (
          <section className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {loading && (
              <div className="col-span-full flex justify-center py-10 text-sm text-gray-500">
                Loading articles...
              </div>
            )}
            {!loading && error && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-red-100 bg-white/70 px-6 py-10 text-center text-sm text-gray-500">
                <p className="mb-1 font-medium text-gray-700">Unable to load articles</p>
                <p>{error}</p>
              </div>
            )}
            {!loading &&
              !error &&
              filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="relative overflow-hidden rounded-3xl border-red-50 bg-white/95 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-500/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <CardContent className="relative p-6 md:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge className="border-none bg-red-50 text-[11px] font-semibold uppercase tracking-wide text-red-700">
                        {article.category}
                      </Badge>
                      {article.highlight && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-xl md:text-2xl font-semibold text-gray-900">
                      {article.title}
                    </h2>
                    <p className="text-sm md:text-[15px] leading-relaxed text-gray-600">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1 text-xs text-gray-500">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(article.created_at)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {article.read_time_minutes
                            ? `${article.read_time_minutes} min read`
                            : "Read time"}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/blog/${article.slug}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                    >
                      <span>Read article</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && !error && filteredArticles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-red-100 bg-white/70 px-6 py-10 text-center text-sm text-gray-500">
                <p className="mb-1 font-medium text-gray-700">No articles found</p>
                <p>Try adjusting your search or switching the category.</p>
              </div>
            )}
          </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

