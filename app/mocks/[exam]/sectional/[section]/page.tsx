"use client";

import { use, useEffect } from "react";

export default function SectionalMockRedirect({
  params
}: {
  params: Promise<{ exam: string; section: string }>;
}) {
  const { exam, section } = use(params);
  useEffect(() => {
    window.location.replace(`/sectional-mock.html?exam=${exam}&section=${section}`);
  }, [exam, section]);
  return null;
}
