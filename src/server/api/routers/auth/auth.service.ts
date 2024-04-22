"use server";

import { db } from "~/server/db";
import { type SignInSchema, type SignUpSchema } from "./auth.types";
import { TRPCError } from "@trpc/server";
import { Argon2id } from "oslo/password";
import { generateId, Session } from "lucia";
import { lucia } from "~/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(values: SignUpSchema) {
  const alreadyExist = await db.user.findFirst({
    where: {
      OR: [
        {
          email: values.email,
        },
        {
          username: values.username,
        },
      ],
    },
  });
  if (alreadyExist)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email already been used",
    });

  const hashPassword = await new Argon2id().hash(values.password);
  const userId = generateId(15);

  const res = await db.user.create({
    data: {
      id: userId,
      username: values.username,
      hashedPassword: hashPassword,
      email: values.email,
    },
  });
  if (!res)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create new user",
    });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function signIn(values: SignInSchema) {
  try {
    const existUser = await db.user.findFirst({
      where: {
        OR: [
          {
            email: values.emailOrUsername,
          },
          {
            username: {
              equals: values.emailOrUsername,
            },
          },
        ],
      },
    });
    if (!existUser)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email or password is wrong",
      });

    const validPassword = await new Argon2id().verify(
      existUser.hashedPassword,
      values.password,
    );
    if (!validPassword)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email or password is wrong",
      });

    const session = await lucia.createSession(existUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error) {
    if (error instanceof TRPCError) throw error;

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
}

export async function signOut(session: Session) {
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
}
