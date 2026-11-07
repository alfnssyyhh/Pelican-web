"use client";

import Link from "next/link";
import Image from "next/image";
import { Post, localizePosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function ArticlesCatalog({ initialPosts }: { initialPosts: Post[] }) {
  const { locale, t } = useLanguage();
  const posts = localizePosts(initialPosts, locale);

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header (Single H1) */}
        <div className="mb-10 sm:mb-12 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {t.insights.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            {t.insights.description}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post, index) => {
            const formattedDate = new Date(post.date).toLocaleDateString(
              locale === "id" ? "id-ID" : "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <article
                key={post.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                <Link href={`/artikel/${post.slug}`} className="block cursor-pointer">
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-16/9 w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                    {post.thumbnail_url ? (
                      <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 text-xs">
                        <BookOpen className="w-8 h-8 mb-1.5 stroke-[1.5]" />
                        <span>{t.common.technical_doc}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 font-normal">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formattedDate}
                      </span>
                      {post.categories[0] && (
                        <>
                          <span className="text-slate-300">·</span>
                          <Badge
                            variant="outline"
                            className="border-slate-200 text-slate-700 font-normal text-[11px] px-2 py-0.5 rounded-md"
                          >
                            {post.categories[0]}
                          </Badge>
                        </>
                      )}
                    </div>

                    <h2 className="font-semibold text-base sm:text-lg text-slate-900 group-hover:text-pelican-red transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 font-normal line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>

                {/* Footer Action Link */}
                <div className="p-5 sm:p-6 pt-3 border-t border-slate-100 mt-auto">
                  <Link
                    href={`/artikel/${post.slug}`}
                    className="inline-flex items-center justify-between w-full text-xs font-medium text-slate-700 group-hover:text-pelican-red transition-colors"
                  >
                    <span>{t.common.read_article}</span>
                    <ArrowRight className="w-4 h-4 text-pelican-red group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
