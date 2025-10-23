"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import Modal from "@/commons/components/modal";
import { DIARIES } from "@/commons/constants/url";

// Zod 스키마 정의
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .refine((val) => val.includes("@"), {
      message: "올바른 이메일 형식이 아닙니다 (@를 포함해야 합니다)",
    }),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginUserResponse {
  accessToken: string;
}

interface FetchUserLoggedInResponse {
  _id: string;
  name: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

const loginUser = async (input: LoginUserInput): Promise<LoginUserResponse> => {
  const response = await fetch(
    "https://main-practice.codebootcamp.co.kr/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation loginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            accessToken
          }
        }
      `,
        variables: {
          email: input.email,
          password: input.password,
        },
        operationName: "loginUser",
      }),
    }
  );

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "로그인에 실패했습니다");
  }

  return result.data.loginUser;
};

const fetchUserLoggedIn = async (
  accessToken: string
): Promise<FetchUserLoggedInResponse> => {
  const response = await fetch(
    "https://main-practice.codebootcamp.co.kr/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
        query fetchUserLoggedIn {
          fetchUserLoggedIn {
            _id
            name
          }
        }
      `,
        operationName: "fetchUserLoggedIn",
      }),
    }
  );

  const result = await response.json();

  if (result.errors) {
    throw new Error(
      result.errors[0]?.message || "사용자 정보를 가져오는데 실패했습니다"
    );
  }

  return result.data.fetchUserLoggedIn;
};

export const useLoginForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginUserInput) => {
      const loginResponse = await loginUser(data);
      const userInfo = await fetchUserLoggedIn(loginResponse.accessToken);
      return { accessToken: loginResponse.accessToken, user: userInfo };
    },
    onSuccess: (data) => {
      // AuthProvider의 signIn 호출하여 상태 즉시 업데이트
      signIn(data.accessToken, {
        id: data.user._id,
        _id: data.user._id, // 테스트 호환성을 위해 _id도 포함
        email: "", // API 응답에 email이 없으므로 빈 문자열
        name: data.user.name,
      });

      openModal(
        <div data-testid="modal-success">
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="로그인 완료"
            description="로그인이 완료되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeAllModals();
              router.push(DIARIES);
            }}
          />
        </div>
      );
    },
    onError: (error: Error) => {
      openModal(
        <div data-testid="modal-error">
          <Modal
            variant="danger"
            actions="single"
            theme="light"
            title="로그인 실패"
            description={
              error.message || "로그인에 실패했습니다. 다시 시도해주세요."
            }
            confirmText="확인"
            onConfirm={() => {
              closeAllModals();
            }}
          />
        </div>
      );
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting: mutation.isPending,
    watch,
  };
};
