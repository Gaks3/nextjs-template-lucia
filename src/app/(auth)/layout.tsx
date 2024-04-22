import { redirect } from "next/navigation";
import { Card } from "~/app/_components/ui/card";
import { validateRequest } from "~/server/validateAuth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const validate = await validateRequest();
  if (validate.user) return redirect("/");

  return (
    <main className="bg-secondary flex min-h-screen w-full items-center justify-center py-10">
      <Card className="w-[80vw] max-w-md">{children}</Card>
    </main>
  );
}
