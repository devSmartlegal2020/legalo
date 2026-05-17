import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Eye, Link as LinkIcon, MessageCircle, CheckCircle, Loader2, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import { blogAPI, API_BASE_URL } from '@/services/api';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import ConsultationModal from '@/components/ConsultationModal';
import { toast } from 'sonner';

interface CTAData {
  _id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: { name: string; slug: string };
  author: { name: string; email: string };
  publishedAt: string;
  readTime: number;
  views: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [resolvedCta, setResolvedCta] = useState<CTAData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sanitizedContent = useMemo(() => {
    if (!blog?.content) return '';
    return DOMPurify.sanitize(blog.content, {
      ALLOWED_TAGS: [
        'p', 'br', 'hr',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'b', 'em', 'i', 'u', 'strike', 's',
        'a', 'img',
        'ul', 'ol', 'li',
        'blockquote', 'code', 'pre',
        'div', 'span', 'sup', 'sub',
        'table', 'thead', 'tbody', 'tr', 'td', 'th',
        'iframe',
        'figure', 'figcaption',
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel',
        'src', 'alt', 'width', 'height', 'class', 'id',
        'style',
        'frameborder', 'allowfullscreen', 'allow',
        'srcdoc', 'sandbox',
        'data-*',
      ],
    });
  }, [blog?.content]);

  const { html: processedHtml, toc } = useMemo(() => {
    if (!sanitizedContent) return { html: '', toc: [] as { id: string; text: string }[] };
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2'));
    const tocItems: { id: string; text: string }[] = [];
    headings.forEach((h, i) => {
      const text = h.textContent || `section-${i}`;
      const id = slugify(text);
      h.id = id;
      tocItems.push({ id, text });
    });
    return { html: doc.body.innerHTML, toc: tocItems };
  }, [sanitizedContent]);

  const [activeTocId, setActiveTocId] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const response = await blogAPI.getBySlug(slug);
        setBlog(response.data.data.blog);
        setResolvedCta(response.data.data.resolvedCta || null);
      } catch (err) {
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          setError(axiosErr.response?.data?.message || 'Failed to load blog');
        } else {
          setError('Failed to load blog');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await blogAPI.getPopular(3);
        const blogs = res.data.data.blogs || [];
        setRelatedBlogs(blogs.filter((b: Blog) => b._id !== blog?._id).slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch related blogs', err);
      }
    };
    if (blog) {
      fetchRelated();
    }
  }, [blog]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!blog) return;
    const url = `https://wa.me/?text=${encodeURIComponent(`${blog.title} - ${window.location.href}`)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-legalo-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-legalo-red" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-legalo-bg">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-2xl font-bold mb-4 text-legalo-dark">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
          <Button asChild>
            <Link to="/artikel">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredImageSrc = blog.featuredImage
    ? `${API_BASE_URL}${blog.featuredImage}`
    : '/images/blog_perizinan.jpg';

  const publishedDate = new Date(blog.publishedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-legalo-bg">
      <Navigation />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero Header */}
      <section className="relative bg-legalo-dark pt-28 pb-32 lg:pt-36 lg:pb-44 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#D93A3A15,_transparent_40%)]" />
        <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/artikel"
              className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>

            <div className="mb-6">
              <span className="inline-block bg-legalo-red text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full">
                {blog.category?.name}
              </span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white mb-8 leading-[1.15] tracking-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3 text-white/70 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-legalo-red" />
                <span>{blog.author?.name}</span>
              </div>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-legalo-red" />
                <span>{publishedDate}</span>
              </div>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-legalo-red" />
                <span>{blog.readTime} min read</span>
              </div>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-legalo-red" />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image Overlap */}
      <div className="relative z-20 w-full px-6 lg:px-12 xl:px-20 -mt-20 lg:-mt-28">
        <div className="max-w-5xl mx-auto">
          <img
            src={featuredImageSrc}
            alt={blog.title}
            className="w-full h-auto max-h-[520px] object-cover rounded-2xl shadow-tile"
          />
        </div>
      </div>

      {/* Article Body */}
      <article className="pt-16 lg:pt-24 pb-24">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 ${toc.length > 0 ? 'lg:grid-cols-[220px_1fr] gap-12 lg:gap-16' : ''}`}>
              {/* TOC Sidebar */}
              {toc.length > 0 && (
                <aside className="hidden lg:block">
                  <div className="sticky top-28">
                    <div className="flex items-center gap-2 text-sm font-semibold text-legalo-dark uppercase tracking-wider mb-4">
                      <List className="w-4 h-4" />
                      Daftar Isi
                    </div>
                    <nav className="border-l border-gray-200">
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(item.id);
                            if (el) {
                              const y = el.getBoundingClientRect().top + window.scrollY - 100;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }}
                          className={`block pl-4 pr-2 py-2 text-sm transition-colors border-l-2 -ml-px ${
                            activeTocId === item.id
                              ? 'border-legalo-red text-legalo-red font-medium'
                              : 'border-transparent text-legalo-text-secondary hover:text-legalo-dark hover:border-gray-300'
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </aside>
              )}

              <div className={`${toc.length === 0 ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}>
                {/* Excerpt */}
                <p className="text-lg lg:text-xl text-legalo-text-secondary leading-[1.8] mb-10">
                  {blog.excerpt}
                </p>

                {/* Mobile TOC */}
                {toc.length > 0 && (
                  <details className="lg:hidden mb-10 group">
                    <summary className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 cursor-pointer list-none">
                      <span className="flex items-center gap-2 text-sm font-semibold text-legalo-dark">
                        <List className="w-4 h-4" />
                        Daftar Isi
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <nav className="mt-2 p-4 bg-white rounded-xl border border-gray-200">
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(item.id);
                            if (el) {
                              const y = el.getBoundingClientRect().top + window.scrollY - 100;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }}
                          className="block py-2 text-sm text-legalo-text-secondary hover:text-legalo-red"
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </details>
                )}

                {/* Prose Content */}
                <div
                  ref={contentRef}
                  className="prose prose-lg max-w-none
                    prose-headings:font-heading prose-headings:font-bold prose-headings:text-legalo-dark
                    prose-h2:text-2xl lg:prose-h2:text-[1.75rem] prose-h2:mt-12 prose-h2:mb-5 prose-h2:leading-snug
                    prose-h3:text-xl lg:prose-h3:text-[1.4rem] prose-h3:mt-10 prose-h3:mb-4 prose-h3:leading-snug
                    prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3
                    prose-p:text-legalo-text-secondary prose-p:leading-[1.9] prose-p:mb-7 prose-p:text-justify
                    prose-a:text-legalo-red prose-a:font-semibold prose-a:underline prose-a:underline-offset-4 prose-a:decoration-legalo-red/60 hover:prose-a:decoration-legalo-red
                    [&_a]:text-legalo-red [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-legalo-red/60 [&_a:hover]:decoration-legalo-red
                    [&_strong_a]:text-legalo-red [&_b_a]:text-legalo-red
                    prose-blockquote:border-l-4 prose-blockquote:border-l-legalo-red/40 prose-blockquote:bg-gray-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:not-italic prose-blockquote:text-legalo-text-secondary
                    prose-ul:my-6 prose-ol:my-6
                    prose-li:my-2.5 prose-li:marker:text-legalo-red/70
                    prose-img:rounded-xl prose-img:my-8
                    prose-pre:bg-legalo-dark prose-pre:text-white prose-pre:rounded-lg
                    prose-code:text-legalo-red prose-code:bg-legalo-red/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-strong:text-legalo-dark prose-strong:font-semibold
                    prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-th:bg-gray-50 prose-th:text-legalo-dark prose-th:font-semibold prose-th:p-3 prose-th:text-left prose-td:p-3 prose-tr:border-b prose-tr:border-gray-100 prose-td:text-legalo-text-secondary"
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />

                {/* Tags */}
                {blog.metaKeywords && blog.metaKeywords.length > 0 && (
                  <div className="mt-16 pt-10 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-legalo-dark uppercase tracking-wider mb-4">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {blog.metaKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-4 py-1.5 bg-white border border-gray-200 text-legalo-text text-sm rounded-full hover:border-legalo-red hover:text-legalo-red transition-colors cursor-default"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Card */}
                {resolvedCta ? (
                  <div
                    className="mt-10 p-6 lg:p-8 rounded-2xl text-center"
                    style={{ backgroundColor: resolvedCta.backgroundColor }}
                  >
                    <h3
                      className="font-heading font-bold text-xl lg:text-2xl mb-3"
                      style={{ color: resolvedCta.textColor }}
                    >
                      {resolvedCta.title}
                    </h3>
                    <div
                      className="text-sm lg:text-base leading-relaxed mb-6 opacity-90"
                      style={{ color: resolvedCta.textColor }}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resolvedCta.description) }}
                    />
                    <a
                      href={resolvedCta.buttonUrl}
                      className="inline-flex items-center justify-center h-12 px-8 font-semibold rounded-xl text-sm transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: resolvedCta.buttonBackgroundColor,
                        color: resolvedCta.buttonTextColor,
                      }}
                    >
                      {resolvedCta.buttonText}
                    </a>
                  </div>
                ) : null}

                {/* Author Card */}
                <div className="mt-10 p-6 lg:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-full bg-legalo-red/10 flex items-center justify-center text-legalo-red text-2xl font-bold shrink-0">
                    {blog.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-legalo-dark">
                      {blog.author?.name}
                    </h4>
                    <p className="text-sm text-legalo-text-secondary mb-2">
                      Legal Content Writer at Legalo.id
                    </p>
                    <p className="text-sm text-legalo-text">
                      Dedicated to making Indonesian business law accessible, practical, and actionable for entrepreneurs and startups.
                    </p>
                  </div>
                </div>

                {/* Share */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-sm text-legalo-text-secondary">
                    Found this article helpful? Share it with your network.
                  </span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="rounded-full gap-2 border-gray-300 hover:border-legalo-red hover:text-legalo-red"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <LinkIcon className="w-4 h-4" />
                      )}
                      {copied ? 'Copied' : 'Copy Link'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleWhatsAppShare}
                      className="rounded-full gap-2 border-gray-300 hover:border-legalo-red hover:text-legalo-red"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="w-full px-6 lg:px-12 xl:px-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading font-bold text-2xl lg:text-3xl text-legalo-dark mb-10">
                Artikel Populer Lainnya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((item) => {
                  const imgSrc = item.featuredImage
                    ? `${API_BASE_URL}${item.featuredImage}`
                    : '/images/blog_perizinan.jpg';
                  return (
                    <Link
                      key={item._id}
                      to={`/artikel/${item.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-legalo-bg">
                        <img
                          src={imgSrc}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="text-xs font-semibold text-legalo-red uppercase tracking-wider mb-2">
                        {item.category?.name}
                      </div>
                      <h3 className="font-heading font-bold text-lg text-legalo-dark group-hover:text-legalo-red transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetail;
