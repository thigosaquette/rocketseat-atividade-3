export interface Org {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  address: string;
  whatsapp: string;
  created_at: Date;
}

export interface CreateOrgInput {
  name: string;
  email: string;
  password: string;
  address: string;
  whatsapp: string;
}

export interface OrgWithoutPassword {
  id: string;
  name: string;
  email: string;
  address: string;
  whatsapp: string;
  created_at: Date;
}

