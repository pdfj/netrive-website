import { UsNavbar } from "@/components/us/UsNavbar";
import { UsFooter } from "@/components/us/UsFooter";

// US market layout — its own chrome (no WhatsApp, no AI chat). New route;
// does not affect the existing homepage or other routes.
export default function UsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UsNavbar />
      {children}
      <UsFooter />
    </>
  );
}
