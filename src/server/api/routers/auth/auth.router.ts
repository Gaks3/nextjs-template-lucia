import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { signIn, signOut, signUp } from "./auth.service";
import { signInSchema, signUpSchema } from "./auth.types";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(signUpSchema).mutation(async ({ input }) => {
    return signUp(input);
  }),
  signIn: publicProcedure.input(signInSchema).mutation(async ({ input }) => {
    return signIn(input);
  }),
  signOut: protectedProcedure.query(async ({ ctx }) => {
    return await signOut(ctx.session);
  }),
});
