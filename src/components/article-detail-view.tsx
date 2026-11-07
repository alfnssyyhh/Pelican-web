"use client";

import Link from "next/link";
import Image from "next/image";
import { Post, localizePost, localizePosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Tag, Phone, FileText, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function ArticleDetailView({
  initialPost,
  initialRelated,
}: {
  initialPost: Post;
  initialRelated: Post[];
}) {
  const { locale, t } = useLanguage();
  const post = localizePost(initialPost, locale);
  const relatedPosts = localizePosts(initialRelated, locale);

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const isId = locale === "id";

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            {isId ? "Beranda" : "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/artikel" className="hover:text-slate-900 transition-colors">
            {isId ? "Artikel Teknis" : "Insights"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium truncate max-w-xs sm:max-w-md">
            {post.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Article Content Container */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-10 lg:p-12 rounded-xl border border-slate-200 shadow-xs">
            {/* Meta Tags & Publication Date */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.categories.map((cat, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs font-normal border-slate-200 bg-slate-50 text-slate-700 rounded-md"
                >
                  {cat}
                </Badge>
              ))}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Single H1 on Article Detail Page */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-6">
              {post.title}
            </h1>

            {/* Hero Banner Image */}
            {post.thumbnail_url && (
              <div className="relative aspect-21/9 w-full bg-slate-100 rounded-lg overflow-hidden mb-8 border border-slate-200">
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Body Content */}
            <div
              className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4 font-normal [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* E-E-A-T Author & Reviewer Verification */}
            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 text-slate-700 font-semibold text-xs">
                PMS
              </div>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  {isId ? "Tim Rekayasa Teknik PT Pelican Mitra Sejati" : "PT Pelican Mitra Sejati Technical Team"}
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </span>
                <p className="text-slate-600 font-normal leading-relaxed">
                  {isId
                    ? "Artikel teknis ini diverifikasi langsung oleh praktisi rekayasa maritim Batam dengan kepatuhan terhadap regulasi kelas kapal, standar MARPOL, dan panduan resmi pabrikan mesin."
                    : "Verified by Batam marine engineering practitioners in compliance with classification society rules, MARPOL standards, and manufacturer guidelines."}
                </p>
              </div>
            </div>

            {/* Topics & Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {t.common.related_topics}
                </span>
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Back to Catalog Link */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/artikel"
                aria-label="Kembali ke halaman katalog artikel teknis maritim"
                className="inline-flex items-center gap-2 text-xs font-medium text-pelican-red hover:text-pelican-red-hover transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {t.common.back_to_insights}
              </Link>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-8 sticky top-28">
            {/* Box 1: B2B Call to Action / RFQ (Consistent Card Style Matching Existing Site Cards) */}
            <Card className="bg-slate-50/80 border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {t.common.rfq_title}
                </CardTitle>
                <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1.5">
                  {t.common.rfq_desc}
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <Button asChild className="w-full bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold h-10 shadow-xs">
                  <Link href={`/contact?type=service&item=${encodeURIComponent(post.title)}`} className="flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" /> {t.common.request_rfq}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Box 2: Related Articles */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  {t.common.related_articles}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-3.5">
                {relatedPosts.map((rel) => (
                  <div key={rel.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <Link
                      href={`/artikel/${rel.slug}`}
                      className="text-xs font-medium text-slate-800 hover:text-pelican-red transition-colors line-clamp-2 leading-snug block"
                    >
                      {rel.title}
                    </Link>
                    <span className="text-[11px] text-slate-500 font-normal mt-1 block">
                      {rel.categories[0] || "Engineering"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
