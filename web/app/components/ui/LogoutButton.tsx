"use client";

import { LogOut } from "@deemlol/next-icons";
import { signOut } from "next-auth/react";
import Button from "./Button";

export default function LogoutButton() {
  return (
    <Button
      type="red"
      icon={<LogOut size={16} />}
      text="Déconnexion"
      className="max-sm:w-full max-sm:h-8 max-sm:text-xs"
      onClick={() => signOut()}
    />
  );
}
