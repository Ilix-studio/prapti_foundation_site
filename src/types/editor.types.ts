export const ROLES = {
  SUPER_ADMIN: "Super-Admin",
  EDITOR: "Editor",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface Editor {
  _id: string;
  name: string;
  email: string;
  role: typeof ROLES.EDITOR;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEditorBody {
  name: string;
  email: string;
}

// createEditor returns a trimmed payload, not the full Editor document.
export interface CreatedEditor {
  id: string;
  name: string;
  email: string;
}

export interface GetEditorsResponse {
  success: boolean;
  count: number;
  data: Editor[];
}

export interface CreateEditorResponse {
  success: boolean;
  message: string;
  data: CreatedEditor;
}

export interface ToggleEditorStatusResponse {
  success: boolean;
  message: string;
  data: { id: string; isActive: boolean };
}

export interface MutationMessageResponse {
  success: boolean;
  message: string;
}
