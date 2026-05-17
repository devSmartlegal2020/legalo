import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import PromoPage from './pages/PromoPage';
import PromoDetail from './pages/PromoDetail';
import EbookPage from './pages/EbookPage';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import PendirianPTCVPage from './pages/services/PendirianPTCVPage';
import IzinOSSNIBPage from './pages/services/IzinOSSNIBPage';
import PendaftaranMerekPage from './pages/services/PendaftaranMerekPage';
import KonsultasiHukumPage from './pages/services/KonsultasiHukumPage';
import LandingPTPage from './pages/LandingPTPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlogList from './pages/admin/BlogList';
import CreateBlog from './pages/admin/CreateBlog';
import EditBlog from './pages/admin/EditBlog';
import EventList from './pages/admin/EventList';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import PromotionList from './pages/admin/PromotionList';
import CreatePromotion from './pages/admin/CreatePromotion';
import EditPromotion from './pages/admin/EditPromotion';
import EbookList from './pages/admin/EbookList';
import CreateEbook from './pages/admin/CreateEbook';
import EditEbook from './pages/admin/EditEbook';
import NewsletterSubscribers from './pages/admin/NewsletterSubscribers';
import Categories from './pages/admin/Categories';
import CTAList from './pages/admin/CTAList';
import CreateCTA from './pages/admin/CreateCTA';
import EditCTA from './pages/admin/EditCTA';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';
import ImportPage from './pages/admin/ImportPage';

// Admin Components
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import GlobalPromoPopup from './components/GlobalPromoPopup';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <BrowserRouter>
          <GlobalPromoPopup />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/layanan" element={<ServicesPage />} />
            <Route path="/layanan/pt-cv" element={<PendirianPTCVPage />} />
            <Route path="/layanan/oss-nib" element={<IzinOSSNIBPage />} />
            <Route path="/layanan/trademark" element={<PendaftaranMerekPage />} />
            <Route path="/layanan/konsultasi" element={<KonsultasiHukumPage />} />
            <Route path="/tentang-kami" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/promo" element={<PromoPage />} />
            <Route path="/promo/:slug" element={<PromoDetail />} />
            <Route path="/ebook-newsletter" element={<EbookPage />} />
            <Route path="/artikel" element={<BlogPage />} />
            <Route path="/artikel/:slug" element={<BlogDetail />} />
            <Route path="/lp/pendirian-pt" element={<LandingPTPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <BlogList />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CreateBlog />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EditBlog />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EventList />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/events/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CreateEvent />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/events/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EditEvent />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/promotions"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PromotionList />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/promotions/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CreatePromotion />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/promotions/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EditPromotion />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Categories />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/ctas"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CTAList />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/ctas/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CreateCTA />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/ctas/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EditCTA />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/import"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ImportPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/ebooks"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EbookList />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/ebooks/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CreateEbook />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/ebooks/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EditEbook />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/newsletter-subscribers"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <NewsletterSubscribers />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
