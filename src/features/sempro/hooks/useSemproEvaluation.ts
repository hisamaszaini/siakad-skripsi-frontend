import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SemproEvaluationSchema, SemproEvaluationFormData } from "@/schemas";
import { useEvaluateSemproMutation } from "./useSemproMutation";
import { useRouter } from "next/navigation";
import { SemproRegistration } from "@/types";

export const useSemproEvaluation = (id: string, initialData?: SemproRegistration) => {
  const router = useRouter();
  const form = useForm<SemproEvaluationFormData>({
    resolver: zodResolver(SemproEvaluationSchema),
    values: initialData ? {
      nilai: initialData.nilai ? Number(initialData.nilai) : ("" as unknown as number),
      status: (initialData.status as "PASSED" | "FAILED" | "REVISE") || undefined,
      catatan: initialData.catatan || "",
    } : undefined,
    defaultValues: {
      nilai: "" as unknown as number,
      status: undefined,
      catatan: "",
    },
  });

  const { mutate: evaluate, isPending } = useEvaluateSemproMutation();

  const onSubmit = (data: SemproEvaluationFormData) => {
    evaluate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/lecturer/sempro");
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
