import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefenseEvaluationSchema, DefenseEvaluationFormData } from "@/schemas";
import { useEvaluateDefenseMutation } from "./useDefenseMutation";
import { useRouter } from "next/navigation";
import { DefenseRegistration } from "@/types";

export const useDefenseEvaluation = (id: string, initialData?: DefenseRegistration) => {
  const router = useRouter();
  const form = useForm<DefenseEvaluationFormData>({
    resolver: zodResolver(DefenseEvaluationSchema),
    values: initialData ? {
      nilai: initialData.nilai ? Number(initialData.nilai) : (0 as unknown as number),
      status: (initialData.status as "PASSED" | "FAILED" | "REVISE") || undefined,
      catatan: initialData.catatan || "",
    } : undefined,
    defaultValues: {
      nilai: 0 as unknown as number,
      status: undefined,
      catatan: "",
    },
  });

  const { mutate: evaluate, isPending } = useEvaluateDefenseMutation();

  const onSubmit = (data: DefenseEvaluationFormData) => {
    evaluate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/lecturer/defense");
        },
      }
    );
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
};
