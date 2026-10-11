import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminJerseyFormPage from "./pages/AdminJerseyFormPage.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import JerseyRequestPage from "./pages/JerseyRequestPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import { useEffect } from "react";
import { trackVisit, heartbeat } from "./analytics.js";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);
  return null;
}

export default function App() {
  useEffect(() => {
    trackVisit(window.location.pathname).catch((err) => console.warn("Visitor tracking unavailable:", err));
    const timer = setInterval(() => {
      heartbeat(window.location.pathname).catch(() => {});
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/collections/:collection" element={<ShopPage />} />
          <Route path="/jersey/:id" element={<ProductDetailPage />} />
          <Route path="/request-jersey" element={<JerseyRequestPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/new"
            element={
              <RequireAdmin>
                <AdminJerseyFormPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <RequireAdmin>
                <AdminJerseyFormPage />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
