"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface SerializableOrganization {
  id: string;
  name: string;
  email: string;
  phone: string;
  logoUrl: string;
  invoicePrefix: string;
  paymentTerms: string;
  currency: string;
  enableTax: boolean;
  enableDiscount: boolean;
  defaultTaxRate: string;
  invoiceTemplates: any[];
}

interface OrganizationContextType {
  organization: SerializableOrganization | null;
  organizationId: string | null;
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  organizationId: null
});

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ 
  children, 
  organizationId,
  organization = null
}: { 
  children: ReactNode; 
  organizationId: string;
  organization?: SerializableOrganization | null;
}) => {
  return (
    <OrganizationContext.Provider value={{ organizationId, organization }}>
      {children}
    </OrganizationContext.Provider>
  );
};
