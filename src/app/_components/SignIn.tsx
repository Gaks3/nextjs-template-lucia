"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Eye, EyeOff } from "lucide-react";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { toast } from "~/app/_components/ui/use-toast";
import {
  signInSchema,
  type SignInSchema,
} from "~/server/api/routers/auth/auth.types";
import { api } from "~/trpc/react";

export default function SignIn({ callback }: { callback?: RequestCookie }) {
  const router = useRouter();

  const [type, setType] = useState<"password" | "text">("password");

  const mutation = api.auth.signIn.useMutation({
    onSuccess: () => {
      if (callback?.value) {
        return router.push(callback.value);
      }
      return router.push("/");
    },
  });

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: SignInSchema) {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast({ title: error.message, variant: "destructive" });
      } else {
        toast({ title: "Something went wrong", variant: "destructive" });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="emailOrUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative w-full">
                <FormControl>
                  <Input type={type} {...field} className="py-4" />
                </FormControl>
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() =>
                    setType((prev) =>
                      prev === "password" ? "text" : "password",
                    )
                  }
                >
                  {type === "password" ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Loading.." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
