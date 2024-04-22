"use client";

import { useForm } from "react-hook-form";
import {
  signUpSchema,
  type SignUpSchema,
} from "~/server/api/routers/auth/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { useRouter } from "next/navigation";
import { toast } from "~/app/_components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { TRPCClientError } from "@trpc/client";

export default function SignUp({ callback }: { callback?: RequestCookie }) {
  const router = useRouter();

  const [type, setType] = useState<"password" | "text">("password");

  const mutation = api.auth.signUp.useMutation({
    onSuccess: () => {
      if (callback?.value) {
        return router.push(callback.value);
      }

      return router.push("/");
    },
  });

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(values: SignUpSchema) {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      console.log(error);

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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
                  <Input type={type} {...field} className="pr-4" />
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
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="pr-4" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Loading.." : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
