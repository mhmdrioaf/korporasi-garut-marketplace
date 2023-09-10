import AuthLogin from "@/components/ui/auth/login";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  return (
    <Container className="h-[85vh] grid place-items-center">
      <AuthLogin />
    </Container>
  );
}
