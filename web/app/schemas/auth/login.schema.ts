import { z } from "zod";

export const LoginSchema = z.object({
    email: z
        .string()
        .nonempty("Veuillez entrer votre email")
        .email("Veuillez entrer un email valide"),
    password: z
        .string().
        nonempty("Veuillez entrer votre mot de passe"),
});

export type LoginData = z.infer<typeof LoginSchema>;