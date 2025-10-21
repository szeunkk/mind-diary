"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import Modal from "@/commons/components/modal";
import { AUTH_LOGIN } from "@/commons/constants/url";

// Zod 스키마 정의
const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .refine((val) => val.includes("@"), {
        message: "올바른 이메일 형식이 아닙니다 (@를 포함해야 합니다)",
      }),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .refine(
        (val) => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(val),
        "비밀번호는 영문과 숫자를 포함해야 합니다"
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

interface CreateUserResponse {
  _id: string;
}

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

const createUser = async (
  input: CreateUserInput
): Promise<CreateUserResponse> => {
  const response = await fetch(
    "https://main-practice.codebootcamp.co.kr/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation createUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            _id
          }
        }
      `,
        variables: {
          createUserInput: input,
        },
        operationName: "createUser",
      }),
    }
  );

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "회원가입에 실패했습니다");
  }

  return result.data.createUser;
};

export const useSignupForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      openModal(
        <div data-testid="modal-success">
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="회원가입 완료"
            description="로그인 페이지로 이동합니다."
            confirmText="확인"
            onConfirm={() => {
              closeAllModals();
              router.push(AUTH_LOGIN);
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
            title="회원가입 실패"
            description={
              error.message || "회원가입에 실패했습니다. 다시 시도해주세요."
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

  const onSubmit = (data: SignupFormData) => {
    const { email, password, name } = data;
    mutation.mutate({ email, password, name });
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
