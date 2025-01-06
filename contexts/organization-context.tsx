"use client";

import React, { createContext, useContext } from 'react';

interface SerializableOrganization {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  maxAllowedMemberships: number;
  publicMetadata: Record<string, unknown>;
  createdBy: string;
}

interface OrganizationContextType {
  organization: SerializableOrganization | null;
}

export const OrganizationContext = createContext<OrganizationContextType>({ organization: null });

export const useOrganization = () => useContext(OrganizationContext);
