import { cookies } from "next/headers";
import Link from "next/link";
import SignUp from "~/app/_components/SignUp";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";

export default function SignUpPage() {
  const callback = cookies().get("callback_url");

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUp callback={callback} />
      </CardContent>
      <CardFooter>
        <Link href={"/sign-in"} className="text-sm underline">
          Already have account? Sign In here
        </Link>
      </CardFooter>
    </>
  );
}
