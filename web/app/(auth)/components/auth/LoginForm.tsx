'use client'

import PasswordInput from '@/app/components/ui/PasswordInput'
import { LoginData, LoginSchema } from '@/app/schemas/auth/login.schema'
import { LogIn } from '@deemlol/next-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const router = useRouter()
  const [loginError, setLoginError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginData) => {
    setLoginError('')
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (!res) {
      setLoginError('Une erreur est survenue. Veuillez réessayer.')
      return
    }

    if (res.error) {
      setLoginError('Échec de la connexion. Vérifiez vos identifiants.')
      return
    }

    router.push('/espace')
  }

  return (
    <div className="flex flex-col">
      <div className="flex mb-4">
        <Image src="/fripouilles.png" alt="Logo" width={60} height={60} className="rounded-xl" />
      </div>

      <h1 className="max-sm:text-xl text-2xl font-bold max-sm:mb-1 mb-2">
        Connexion à votre compte
      </h1>

      <div className="max-sm:mb-3 mb-5">
        <p className="max-sm:text-[10px] text-xs text-gray-600">
          <span className="font-medium">Vous n&apos;avez pas de compte ?</span>
          <Link href="/register" className="ml-1 text-primary hover:underline font-medium">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-sm:space-y-4 space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={`w-full max-sm:px-2 px-3 max-sm:py-1.5 py-2 max-sm:text-xs text-[.85rem] border rounded-sm focus:ring-1 focus:ring-primary outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } transition`}
            placeholder="exemple@email.com"
          />
          {errors.email && (
            <p className="max-sm:text-[10px] text-xs text-red-500 max-sm:mt-1 mt-2 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <PasswordInput
          id="password"
          label="Mot de passe"
          register={register('password')}
          error={errors.password}
        />

        {loginError && (
          <p className="mt-2 text-[0.8rem] text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-sm">
            {loginError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full max-sm:py-2 bg-primary text-white py-2 rounded-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer font-medium max-sm:text-sm text-sm flex items-center gap-2 justify-center"
        >
          <LogIn size={16} />
          {isSubmitting ? 'Connexion...' : 'Connexion'}
        </button>
      </form>

      <hr className="my-6 border-t border-gray-100" />

      <footer>
        <p className="text-xs leading-relaxed text-gray-400">
          En créant un compte, vous acceptez nos{' '}
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

        <div className="mt-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-gray-400">
          <span>© {new Date().getFullYear()} Fripouilles, Inc.</span>
        </div>
      </footer>
    </div>
  )
}
