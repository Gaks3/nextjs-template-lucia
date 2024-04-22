import {
  containsNumber,
  containsSpecialChars,
  containsUppercase,
} from "~/lib/utils";
import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().trim().min(1, { message: "Username required" }),
    email: z.string().email({ message: "Email not valid" }),
    password: z.string().superRefine((value, ctx) => {
      if (value.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be 8 or more characters long",
          fatal: true,
        });

        return z.NEVER;
      }

      if (!containsUppercase(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least contains one uppercase letter",
          fatal: true,
        });

        return z.NEVER;
      }

      if (!containsNumber(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least contains one number",
          fatal: true,
        });

        return z.NEVER;
      }

      if (!containsSpecialChars(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least contains one special characters (@, #, $, etc.)",
          fatal: true,
        });

        return z.NEVER;
      }
    }),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Password dont match",
    path: ["confirm"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string(),
});

export type SignInSchema = z.infer<typeof signInSchema>;
