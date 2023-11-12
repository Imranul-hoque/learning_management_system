"use client";

import * as z from "zod";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "prisma/prisma-client";

interface DescriptionFormProps {
  initialData: Course,
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [editing, setIsEditing] = useState<boolean>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        description : initialData?.description || ''
    },
  });

  const toggle = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Description Updated");
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.log(error as any);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md shadow-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button onClick={toggle} variant={"ghost"}>
          {editing ? (
            <>Cancel</>
          ) : (
            <div className="flex items-center gap-x-2">
              Edit
              <Pencil className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>

      {!editing && <span>{initialData.description}</span>}
      {!editing && !initialData.description && <span className="italic">undefined</span>}
      {editing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="disabled:cursor-not-allowed placeholder:text-slate-600"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-3 flex justify-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
