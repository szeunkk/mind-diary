"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export default function ReactQueryProvider({
  children,
}: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 데이터가 stale 상태가 되는 시간 (5분)
            staleTime: 60 * 1000 * 5,
            // 캐시에 데이터를 유지하는 시간 (10분)
            gcTime: 60 * 1000 * 10,
            // 에러 발생 시 재시도 횟수
            retry: 1,
            // 윈도우 포커스 시 자동 refetch 비활성화
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
