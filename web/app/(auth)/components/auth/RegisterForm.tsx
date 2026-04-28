'use client'

import PasswordInput from '@/app/components/ui/PasswordInput'
import { register } from '@/app/lib/api/auth'
import { Register, RegisterPayload, RegisterSchema } from '@/app/schemas/auth/register.schema'
import { Role } from '@/app/types/enums'
import { UserPlus } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function RegisterForm() {
  const router = useRouter()
  const [registerError, setRegisterError] = useState('')

  const {
    register: rhf,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: Register) => {
    setRegisterError('')

    const payload: RegisterPayload = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      dateNaissance: data.dateNaissance,
      role: data.role,
      sexe: data.sexe,
      password: data.password,
    }

    try {
      await register(payload)

      const result = await signIn('credentials', {
        email: payload.email,
        password: payload.password,
        redirect: false,
      })

      if (result?.error) {
        return
      }

      toast.success('Bienvenue au RAM Fripouilles !')
      router.push('/espace')
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Une erreur est survenue lors de l'inscription"
      setRegisterError(message)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex mb-4">
        <Image
          src="/fripouilles.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-lg sm:rounded-xl"
        />
      </div>

      <h1 className="max-sm:text-lg text-xl sm:text-2xl font-bold max-sm:mb-1 mb-2">
        Créer un compte
      </h1>

      <p className="max-sm:text-[10px] text-xs max-sm:mb-3 mb-4 text-gray-600">
        Vous avez déjà un compte ?
        <Link href="/login" className="text-primary hover:underline font-medium">
          Se connecter
        </Link>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-sm:space-y-3 sm:space-y-4 md:space-y-4"
      >
        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div>
            <label htmlFor="nom" className="block text-xs font-medium text-gray-600 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              id="nom"
              {...rhf('nom')}
              placeholder="Dupont"
              className={`w-full px-2 sm:px-3 py-1.5 text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nom && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.nom.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="prenom" className="block text-xs font-medium text-gray-600 mb-1">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              id="prenom"
              {...rhf('prenom')}
              placeholder="Marie"
              className={`w-full px-2 sm:px-3 py-1.5 text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.prenom && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.prenom.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            {...rhf('email')}
            type="email"
            placeholder="assistante@exemple.com"
            className={`w-full px-2 sm:px-3 py-1.5 text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Téléphone / Date de naissance */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div>
            <label htmlFor="telephone" className="block text-xs font-medium text-gray-600 mb-1">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              id="telephone"
              {...rhf('telephone')}
              placeholder="0612345678"
              className={`w-full px-2 sm:px-3 py-1.5 text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.telephone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.telephone && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.telephone.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="dateNaissance" className="block text-xs font-medium text-gray-600 mb-1">
              Date naissance <span className="text-red-500">*</span>
            </label>
            <input
              id="dateNaissance"
              type="date"
              {...rhf('dateNaissance')}
              className={`w-full px-2 sm:px-3 py-1.5 text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.dateNaissance ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dateNaissance && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.dateNaissance.message}
              </p>
            )}
          </div>
        </div>

        {/* Rôle / Sexe */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div>
            <label htmlFor="role" className="block text-xs font-medium text-gray-600 mb-1">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              {...rhf('role')}
              className={`w-full px-2 sm:px-3 py-1.5 text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionnez</option>
              <option value={`${Role.PARENT}`}>Parent</option>
              <option value={`${Role.ASSISTANT}`}>Assistant(e)</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.role.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="sexe" className="block text-xs font-medium text-gray-600 mb-1">
              Sexe <span className="text-red-500">*</span>
            </label>
            <select
              id="sexe"
              {...rhf('sexe')}
              className={`w-full px-2 sm:px-3 py-1.5 text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary ${errors.sexe ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionnez</option>
              <option value="FEMININ">Femme</option>
              <option value="MASCULIN">Homme</option>
            </select>
            {errors.sexe && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.sexe.message}</p>
            )}
          </div>
        </div>

        {/* Password / Confirm */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <PasswordInput
            id="password"
            label="Mot de passe"
            placeholder="Votre mot de passe"
            register={rhf('password')}
            error={errors.password}
            compact
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirmer le mot de passe"
            placeholder="Confirmer votre mot de passe"
            register={rhf('confirmPassword')}
            error={errors.confirmPassword}
            compact
          />
        </div>

        {/* RGPD */}
        <div className="flex items-center">
          <input
            id="rgpd"
            type="checkbox"
            {...rhf('rgpd')}
            className="h-4 w-4 text-primary border-gray-300 rounded-sm focus:ring-primary"
          />
          <label htmlFor="rgpd" className="ml-2 block text-xs text-gray-600">
            J&apos;accepte que mes données soient utilisées conformément à la{' '}
            <Link
              href="/privacy"
              className="text-primary transition-colors ml-0.5 underline underline-offset-2"
            >
              Politique de Confidentialité
            </Link>
          </label>
        </div>
        {errors.rgpd && (
          <p className="text-xs text-red-500 mt-2 font-medium">{errors.rgpd.message}</p>
        )}

        {registerError && (
          <p className="text-[0.8rem] text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-sm">
            {registerError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-sm:py-2 bg-primary text-white py-2 rounded-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer font-medium text-xs sm:text-sm flex items-center gap-2 justify-center"
        >
          <UserPlus size={16} color="#FFFFFF" />
          {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>

      <hr className="my-6 border-t border-gray-100" />

      <footer>
        <p className="text-xs leading-relaxed text-gray-400">
          En créant un compte, vous acceptez nos{' '}
          <Link
            href="/legal"
            className="text-primary underline underline-offset-2 transition-colors"
          >
            Mentions légales
          </Link>{' '}
          ainsi que nos{' '}
          <Link
            href="/terms"
            className="text-primary underline underline-offset-2 transition-colors"
          >
            Conditions d&apos;utilisation
          </Link>{' '}
          et notre{' '}
          <Link
            href="/privacy"
            className="text-primary underline underline-offset-2 transition-colors"
          >
            Politique de confidentialité
          </Link>
          .
        </p>

        <div className="max-sm:mt-3 mt-4 flex items-center justify-between max-sm:text-[8px] text-[10px] font-medium uppercase tracking-wider text-gray-400">
          <span>© {new Date().getFullYear()} Fripouilles, Inc.</span>
        </div>
      </footer>
    </div>
  )
}
