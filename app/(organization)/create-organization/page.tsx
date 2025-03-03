import CreateOrganization from '@/components/v2/organization/create-organization'
import OrganizationHeader from "@/components/v2/headers/organiztion-header";

import React from 'react'

export default function createOrganizationPage() {
  return (
    <div>
      <OrganizationHeader />
      <CreateOrganization />
    </div>
  )
}
