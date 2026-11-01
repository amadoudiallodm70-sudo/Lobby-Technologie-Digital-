import { 
  Course, 
  DigitalProduct, 
  Order, 
  Review, 
  DashboardStats, 
  PaymentGatewayConfig, 
  User, 
  UserNotification, 
  AdminUserListItem, 
  AdminUserStats 
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('lobby_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ----------------------------------------------------------------------
// Auth & Account API
// ----------------------------------------------------------------------
export async function apiRegister(data: { 
  name: string; 
  email: string; 
  phone?: string; 
  country?: string; 
  password: string; 
  confirmPassword?: string;
  acceptTerms?: boolean;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de l\'inscription');
  }
  return res.json();
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    if (res.status === 403 && err.suspensionReason) {
      throw new Error(`Compte suspendu : ${err.suspensionReason}`);
    }
    throw new Error(err.error || 'Identifiants invalides');
  }
  return res.json();
}

export async function apiGetMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    if (res.status === 403) {
      const err = await res.json();
      throw new Error(err.suspensionReason || 'Compte suspendu');
    }
    return null;
  }
  const data = await res.json();
  return data.user;
}

export async function apiForgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la demande de réinitialisation');
  }
  return res.json();
}

export async function apiResetPassword(data: {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la réinitialisation');
  }
  return res.json();
}

export async function apiUpdateProfile(data: {
  name?: string;
  phone?: string;
  country?: string;
  avatar?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/update-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la mise à jour du profil');
  }
  return res.json();
}

export async function apiChangePassword(data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors du changement de mot de passe');
  }
  return res.json();
}

export async function apiGetNotifications(): Promise<UserNotification[]> {
  const res = await fetch(`${API_BASE}/client/notifications`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function apiMarkNotificationsRead(): Promise<void> {
  await fetch(`${API_BASE}/client/notifications/mark-read`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
}

// ----------------------------------------------------------------------
// Courses API
// ----------------------------------------------------------------------
export async function apiGetCourses(category?: string, search?: string, includeUnpublished = false): Promise<Course[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  if (includeUnpublished) params.append('includeUnpublished', 'true');

  const res = await fetch(`${API_BASE}/courses?${params.toString()}`);
  if (!res.ok) throw new Error('Impossible de charger les formations');
  return res.json();
}

export async function apiGetCourse(id: string): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${id}`);
  if (!res.ok) throw new Error('Formation introuvable');
  return res.json();
}

export async function apiCreateCourse(course: Partial<Course>): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(course),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur création formation');
  }
  return res.json();
}

export async function apiUpdateCourse(id: string, course: Partial<Course>): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(course),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur mise à jour formation');
  }
  return res.json();
}

export async function apiDeleteCourse(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Erreur suppression formation');
}

// ----------------------------------------------------------------------
// Digital Products API
// ----------------------------------------------------------------------
export async function apiGetProducts(category?: string, search?: string, includeUnpublished = false): Promise<DigitalProduct[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  if (includeUnpublished) params.append('includeUnpublished', 'true');

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Impossible de charger les produits');
  return res.json();
}

export async function apiGetProduct(id: string): Promise<DigitalProduct> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Produit introuvable');
  return res.json();
}

export async function apiCreateProduct(product: Partial<DigitalProduct>): Promise<DigitalProduct> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur création produit');
  }
  return res.json();
}

export async function apiUpdateProduct(id: string, product: Partial<DigitalProduct>): Promise<DigitalProduct> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur mise à jour produit');
  }
  return res.json();
}

export async function apiDeleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Erreur suppression produit');
}

// ----------------------------------------------------------------------
// Real Upload API with progress callback
// ----------------------------------------------------------------------
export function apiUploadFiles(
  files: File[],
  onProgress?: (percentage: number) => void
): Promise<{ files: any[] }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    for (const f of files) {
      formData.append('files', f);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/upload`);

    const token = localStorage.getItem('lobby_token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch (err) {
          reject(new Error('Réponse invalide du serveur'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error || 'Erreur lors de l\'importation'));
        } catch {
          reject(new Error(`Erreur serveur (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Erreur réseau lors du téléversement'));
    xhr.send(formData);
  });
}

// ----------------------------------------------------------------------
// Orders & Payments API (Orange Money & PayCard Guinean flow)
// ----------------------------------------------------------------------
export async function apiInitiateOrder(orderData: {
  items: any[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'orange_money' | 'paycard';
  notes?: string;
}) {
  const res = await fetch(`${API_BASE}/orders/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de l\'initialisation de la commande');
  }
  return res.json();
}

export async function apiConfirmPayment(data: {
  orderId: string;
  otp?: string;
  transactionRef?: string;
  isTestMode?: boolean;
}) {
  const res = await fetch(`${API_BASE}/payments/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Échec de confirmation du paiement');
  }
  return res.json();
}

export async function apiGetClientPurchases(userId?: string) {
  const params = userId ? `?userId=${userId}` : '';
  const res = await fetch(`${API_BASE}/client/purchases${params}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Impossible de récupérer vos achats');
  return res.json();
}

// ----------------------------------------------------------------------
// Reviews API
// ----------------------------------------------------------------------
export async function apiGetReviews() {
  const res = await fetch(`${API_BASE}/reviews`);
  if (!res.ok) throw new Error('Impossible de charger les avis');
  return res.json();
}

export async function apiSubmitReview(data: {
  customerName: string;
  serviceCategory: string;
  rating: number;
  comment: string;
  targetName?: string;
}) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de l\'envoi de votre avis');
  }
  return res.json();
}

// ----------------------------------------------------------------------
// AI Lab API (Server-side Gemini SDK)
// ----------------------------------------------------------------------
export async function apiGenerateAI(toolType: string, prompt: string, params?: any) {
  const res = await fetch(`${API_BASE}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ toolType, prompt, params }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la génération IA');
  }
  return res.json();
}

// ----------------------------------------------------------------------
// Admin API
// ----------------------------------------------------------------------
export async function apiGetAdminStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Accès refusé au tableau de bord administrateur');
  return res.json();
}

export async function apiGetAdminOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/admin/orders`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Accès refusé aux commandes');
  return res.json();
}

export async function apiManualValidateOrder(orderId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/manual-validate`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Échec de la validation manuelle');
  return res.json();
}

export async function apiGetGatewayConfig(): Promise<PaymentGatewayConfig> {
  const res = await fetch(`${API_BASE}/config/gateways`);
  if (!res.ok) throw new Error('Erreur configuration passerelles');
  return res.json();
}

export async function apiUpdateGatewayConfig(config: PaymentGatewayConfig): Promise<PaymentGatewayConfig> {
  const res = await fetch(`${API_BASE}/config/gateways`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Erreur mise à jour passerelles');
  return res.json();
}

// ----------------------------------------------------------------------
// Admin User Management API (Gestion des Clients)
// ----------------------------------------------------------------------
export async function apiGetAdminUsers(): Promise<AdminUserListItem[]> {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Accès refusé à la liste des utilisateurs');
  return res.json();
}

export async function apiGetAdminUserStats(): Promise<AdminUserStats> {
  const res = await fetch(`${API_BASE}/admin/users/stats`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Accès refusé aux statistiques utilisateurs');
  return res.json();
}

export async function apiSuspendUser(id: string, reason: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/users/${id}/suspend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la suspension');
  }
  return res.json();
}

export async function apiReactivateUser(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/users/${id}/reactivate`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la réactivation');
  }
  return res.json();
}

// ----------------------------------------------------------------------
// AI Lab APIs (Video & Image Generation + Canvas Studio)
// ----------------------------------------------------------------------
export async function apiGenerateVideo(data: {
  prompt: string;
  model: string;
  aspectRatio: string;
  cameraMotion?: string;
  durationSeconds?: number;
  style?: string;
  imageUrl?: string;
}) {
  const res = await fetch(`${API_BASE}/ai/generate-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la génération vidéo');
  }
  return res.json();
}

export async function apiGenerateImage(data: {
  prompt: string;
  model: string;
  aspectRatio: string;
  style?: string;
  inputImage?: string;
}) {
  const res = await fetch(`${API_BASE}/ai/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la génération d\'image');
  }
  return res.json();
}

export async function apiGetClientAICreations() {
  const res = await fetch(`${API_BASE}/client/ai-creations`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function apiSaveClientAICreation(creation: any) {
  const res = await fetch(`${API_BASE}/client/ai-creations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(creation),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la sauvegarde de la création');
  }
  return res.json();
}

export async function apiDeleteClientAICreation(id: string) {
  const res = await fetch(`${API_BASE}/client/ai-creations/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
}

// ----------------------------------------------------------------------
// Pricing & Subscriptions API
// ----------------------------------------------------------------------
export async function apiGetPricingPlans() {
  const res = await fetch(`${API_BASE}/pricing-plans`);
  if (!res.ok) throw new Error('Erreur chargement des tarifs');
  return res.json();
}

export async function apiUpdatePricingPlans(plans: any[]) {
  const res = await fetch(`${API_BASE}/admin/pricing-plans`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(plans),
  });
  if (!res.ok) throw new Error('Erreur mise à jour des tarifs');
  return res.json();
}

export async function apiSubscribePlan(data: {
  planId: string;
  paymentMethod: 'orange_money' | 'paycard';
  customerPhone: string;
  otpCode?: string;
}) {
  const res = await fetch(`${API_BASE}/subscriptions/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la souscription');
  }
  return res.json();
}

// ----------------------------------------------------------------------
// Contact Messages & Service Requests API
// ----------------------------------------------------------------------
export async function apiSendContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de l\'envoi du message');
  }
  return res.json();
}

export async function apiGetAdminContactMessages() {
  const res = await fetch(`${API_BASE}/admin/contact-messages`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Accès refusé aux messages');
  return res.json();
}

export async function apiReplyContactMessage(id: string, replyText: string) {
  const res = await fetch(`${API_BASE}/admin/contact-messages/${id}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ replyText }),
  });
  if (!res.ok) throw new Error('Erreur lors de l\'envoi de la réponse');
  return res.json();
}

export async function apiSendServiceRequest(data: {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budgetGNF?: string;
  deadline?: string;
  description: string;
}) {
  const res = await fetch(`${API_BASE}/service-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur lors de la demande de devis');
  }
  return res.json();
}

export async function apiGetAdminServiceRequests() {
  const res = await fetch(`${API_BASE}/admin/service-requests`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Accès refusé aux devis');
  return res.json();
}

export async function apiUpdateServiceRequestStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/admin/service-requests/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Erreur mise à jour devis');
  return res.json();
}

// ----------------------------------------------------------------------
// Course Progress & Certification API
// ----------------------------------------------------------------------
export async function apiGetCourseProgress() {
  const res = await fetch(`${API_BASE}/client/courses/progress`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function apiUpdateCourseProgress(courseId: string, moduleId: string) {
  const res = await fetch(`${API_BASE}/client/courses/${courseId}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ moduleId }),
  });
  if (!res.ok) throw new Error('Erreur mise à jour de la progression');
  return res.json();
}

// ----------------------------------------------------------------------
// Database Backup API
// ----------------------------------------------------------------------
export async function apiGetDatabaseBackup() {
  const res = await fetch(`${API_BASE}/admin/backup`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Erreur export de sauvegarde');
  return res.json();
}

export async function apiRestoreDatabaseBackup(backupData: any) {
  const res = await fetch(`${API_BASE}/admin/backup/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(backupData),
  });
  if (!res.ok) throw new Error('Erreur restauration de la base');
  return res.json();
}

// Currency formatter for GNF
export function formatGNF(amount: number): string {
  return new Intl.NumberFormat('fr-GN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' GNF';
}

