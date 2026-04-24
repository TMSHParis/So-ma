"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DateNavigator } from "@/components/date-navigator";

export function AssiettesDatePicker({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <DateNavigator
      value={value}
      onChange={(iso) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("date", iso);
        router.push(`/admin/assiettes?${params.toString()}`);
      }}
    />
  );
}
