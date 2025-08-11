// Define types for contact messages
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessagesResponse {
  success: boolean;
  data: ContactMessage[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  unreadCount: number;
}

export interface ContactMessageResponse {
  success: boolean;
  data: ContactMessage;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
  };
}

export interface MarkAsReadRequest {
  id: string;
  isRead: boolean;
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
  read?: boolean;
}
