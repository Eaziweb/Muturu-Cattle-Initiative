"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { SuperAdminAuthProvider } from "./contexts/SuperAdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute"
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import SuperAdminProtectedRoute from "./components/SuperAdminProtectedRoute"

import Navbar from "./components/NavBar"
import Footer from "./components/Footer"


import PaymentVerify from "./pages/payment/PaymentVerify"

//auth
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import VerifyEmail from "./pages/auth/VerifyEmail"

//member
import Dashboard from "./pages/member/Dashboard"
import Journals from "./pages/member/Journals"
import Publications from "./pages/member/Publications"
import DownloadPage from "./pages/member/DownloadPage"


//SUPERADMIN 
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminLoginPage from "./pages/superadmin/SuperAdminLoginPage";

//admin
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import AdminEvents from "./pages/admin/AdminEvents"
import AdminGallery from "./pages/admin/AdminGallery"
import AdminPublications from "./pages/admin/AdminPublications"
import AdminJournals from "./pages/admin/AdminJournals"
import AdminPayments from "./pages/admin/AdminPayments"
import AdminPartnerShip from "./pages/admin/AdminPartnership"
import AdminPartners  from "./pages/admin/AdminPartners"
import AdminAnnouncements  from "./pages/sections/AnnouncementsSection"
import AdminBlogs  from "./pages/sections/BlogsSection"
// import AdminOverview  from "./pages/sections/OverviewSection"
import AdminNotifications  from "./pages/sections/NotificationsSection"
import AdminContact  from "./pages/sections/ContactsSection"
import AdminMembers  from "./pages/sections/MembersSection"
import AdminDonations  from "./pages/sections/DonationsSection"


//user
import Home from "./pages/user/Home"
import FindMembers from "./pages/user/FindMembers"
import Donate from "./pages/user/Donate"
import DonationCallback from "./pages/user/DonationCallback"
import Blogs from "./pages/user/Blogs"
import BlogReader from "./pages/user/BlogReader"
import Contact from "./pages/user/Contact"
import Announcements from "./pages/user/Announcements"
import Gallery from "./pages/user/Gallery"
import Events from "./pages/user/Events"
import Partnership from "./pages/user/Partnership"
import About from "./pages/user/About"
import MuturuCattle from "./pages/user/MuturuCattle"
import FAQ from "./pages/user/FAQ"
import ExecutiveDetail from "./pages/user/ExecutiveDetail"
import LegalPages from "./pages/user/LegalPages"
import ScrollToTop from "./components/ScrollToTop"

import "./styles/global.css"

function App() {
  return (
    <AuthProvider>
     <AdminAuthProvider>
        <SuperAdminAuthProvider>
        <Router>
           <ScrollToTop />
          <div className="App">
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/members" element={<FindMembers />} />
                <Route path="/about" element={<About />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/donation-callback" element={<DonationCallback />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:id" element={<BlogReader />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/events" element={<Events />} />
                <Route path="/gallery" element={<Gallery />} />
   <Route path="/payment/verify" element={<PaymentVerify />} />
                <Route path="/partnership" element={<Partnership />} />

            <Route path="/download/:token" element={<DownloadPage />} />
                      <Route path="/executive/:id" element={<ExecutiveDetail />} />
              <Route path="/muturu-cattle" element={<MuturuCattle />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<LegalPages page="privacy" />} />
              <Route path="/terms" element={<LegalPages page="terms" />} />
                {/* Member Protected Route */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                    <Route
                  path="/journals"
                  element={
                   
                      <Journals />
                    
                  }
                />
                    <Route
                  path="/publications"
                  element={
             
                      <Publications />
                    
                  }
                />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                 <Route
              path="/admin/events"
              element={
                <AdminProtectedRoute>
                  <AdminEvents />
                </AdminProtectedRoute>
              }
            />
                            <Route
              path="/admin/revenue"
              element={
                <AdminProtectedRoute>
                  <AdminPayments />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <AdminProtectedRoute>
                  <AdminGallery />
                 </AdminProtectedRoute>
              }
            />
               <Route
              path="/admin/partnership"
              element={
                <AdminProtectedRoute>
                  <AdminPartnerShip />
                 </AdminProtectedRoute>
              }
            />
                  <Route
              path="/admin/partners"
              element={
                <AdminProtectedRoute>
                  <AdminPartners />
                 </AdminProtectedRoute>
              }
            />
          <Route
              path="/admin/publications"
              element={
                             <AdminProtectedRoute>

                  <AdminPublications />
                                </AdminProtectedRoute>

              }
            />
                <Route
              path="/admin/blogs"
              element={
                <AdminProtectedRoute>
                  <AdminBlogs />
                 </AdminProtectedRoute>
              }
            />
                <Route
              path="/admin/announcements"
              element={
                <AdminProtectedRoute>
                  <AdminAnnouncements />
                 </AdminProtectedRoute>
              }
            />
                <Route
              path="/admin/contacts"
              element={
                <AdminProtectedRoute>
                  <AdminContact />
                 </AdminProtectedRoute>
              }
            />
                <Route
              path="/admin/notifications"
              element={
                <AdminProtectedRoute>
                  <AdminNotifications />
                 </AdminProtectedRoute>
              }
            />
                {/* <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminOverview />
                 </AdminProtectedRoute>
              }
            /> */}
                <Route
              path="/admin/donations"
              element={
                <AdminProtectedRoute>
                  <AdminDonations />
                 </AdminProtectedRoute>
              }
            />
                <Route
              path="/admin/members"
              element={
                <AdminProtectedRoute>
                  <AdminMembers />
                 </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/journals"
              element={
                          <AdminProtectedRoute>

                  <AdminJournals />
                               </AdminProtectedRoute>

              }
            /> 

                {/* SuperAdmin Routes */}
                <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
                <Route
                  path="/superadmin/dashboard"
                  element={
                    <SuperAdminProtectedRoute>
                      <SuperAdminDashboard />
                    </SuperAdminProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        </SuperAdminAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App