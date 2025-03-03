"use client";

import CreateOrganization from "@/components/v2/organization/create-organization";
import ChooseOrganization from "@/components/v2/organization/choose-organization";
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import OrganizationHeader from "@/components/v2/headers/organiztion-header";
import AnimatedLoader from "@/components/animated-loader";


export default function ClientRedirectHandler() {
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: true,
  });
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [redirectToCreate, setRedirectToCreate] = useState(false);
  const [redirectToChoose, setRedirectToChoose] = useState(false);

  useLayoutEffect(() => {
    if (!isLoaded) return; 

    const organizations = userMemberships?.data || [];
    const timeoutId = setTimeout(() => {
      if (organizations.length === 0) {
        setRedirectToCreate(true);
        setRedirectToChoose(false);
      } else if (organizations.length === 1) {
        const organizationSlug = organizations[0].organization.slug;
        router.push(`/${organizationSlug}`);
      } else {
        setRedirectToChoose(true);
        setRedirectToCreate(false);
      }
      setLoading(false); 
    }, 4000); 

    return () => clearTimeout(timeoutId);
  }, [isLoaded, userMemberships, router]);

  if (loading) {
    return <AnimatedLoader />; 
  }

  if (redirectToCreate) {
    return (
      <div>
        <OrganizationHeader />
        <CreateOrganization />
      </div>
    );
  }

  if (redirectToChoose) {
    return (
      <div>
        <OrganizationHeader />
        <ChooseOrganization />
      </div>
    );
  }


  return null;
}
