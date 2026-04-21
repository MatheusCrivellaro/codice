import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'
import { AuthProvider } from '@/contexts/auth-context'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'
import { Home } from '@/pages/Home'
import { SearchPage } from '@/pages/SearchPage'
import { BookPage } from '@/pages/BookPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { ModerationQueue } from '@/pages/admin/ModerationQueue'
import { AllListings } from '@/pages/admin/AllListings'
import { SellPage } from '@/pages/sell/SellPage'
import { CreateListingWizard } from '@/pages/sell/CreateListingWizard'
import { MyListings } from '@/pages/sell/MyListings'
import { ConversationsPage } from '@/pages/conversations/ConversationsPage'
import { ConversationDetailPage } from '@/pages/conversations/ConversationDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <Toaster position="top-right" />
                    <Routes>
                        <Route element={<AppShell />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/buscar" element={<SearchPage />} />
                            <Route path="/livro/:slug" element={<BookPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/cadastro" element={<RegisterPage />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/perfil" element={<PerfilPage />} />
                                <Route path="/vender" element={<SellPage />} />
                                <Route path="/vender/novo" element={<CreateListingWizard />} />
                                <Route path="/vender/anuncios" element={<MyListings />} />
                                <Route path="/conversas" element={<ConversationsPage />} />
                                <Route path="/conversas/:threadId" element={<ConversationDetailPage />} />
                            </Route>
                            <Route element={<ProtectedAdminRoute />}>
                                <Route element={<AdminLayout />}>
                                    <Route path="/admin" element={<Navigate to="/admin/moderacao" replace />} />
                                    <Route path="/admin/moderacao" element={<ModerationQueue />} />
                                    <Route path="/admin/listings" element={<AllListings />} />
                                </Route>
                            </Route>
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
