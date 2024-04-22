import { cookies } from "next/headers";
import Link from "next/link";
import SignIn from "~/app/_components/SignIn";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";

export default async function SignInPage() {
  const callback = cookies().get("callback_url");

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <SignIn callback={callback} />
      </CardContent>
      <CardFooter>
        <Link href={"/sign-up"} className="text-sm underline">
          Don&apos;t have account? Sign Up here
        </Link>
      </CardFooter>
    </>
  );
}
