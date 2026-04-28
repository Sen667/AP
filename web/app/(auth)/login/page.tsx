import type { Metadata } from "next";
import LoginForm from "../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
};

export default async function LoginPage() {
  return <LoginForm />;
}
