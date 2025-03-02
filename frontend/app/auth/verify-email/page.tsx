"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth" // Assurez-vous que ce chemin est correct
import { verifyEmailSchema } from "@/lib/validations/auth" // Assurez-vous que ce chemin est correct
import type { z } from "zod"

const EmailVerification = () => {
  const [error, setError] = useState("")
  const router = useRouter()
  const { verifyEmail, isVerifyEmailLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
  })

  const onSubmit = async (data: z.infer<typeof verifyEmailSchema>) => {
    try {
      setError("")
      const code = Array.from({ length: 6 })
        .map((_, i) => data[`code${i}`])
        .join("")
      await verifyEmail.mutateAsync(code)
      // La redirection vers le dashboard est gérée dans le onSuccess du useMutation
    } catch (error: any) {
      setError(error.response?.data?.message || "Une erreur est survenue lors de la vérification.")
    }
  }

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const codeArray = Array.from(document.querySelectorAll<HTMLInputElement>('input[name^="code"]')).map(
        (input) => input.value,
      )
      codeArray[index] = value
      setValue("code", codeArray.join(""))

      // Move to next input if value is entered
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && index > 0 && e.currentTarget.value === "") {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Vérification de l'email</CardTitle>
        <CardDescription>Entrez le code à 6 chiffres envoyé à votre adresse email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                {...register(`code${index}`)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full text-center text-lg"
              />
            ))}
          </div>
          {errors.code && <p className="mt-2 text-sm text-destructive">{errors.code.message}</p>}
          {error && (
            <div className="mt-4 bg-destructive/10 text-destructive rounded-md p-3 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <Button type="submit" className="w-full mt-4" disabled={isVerifyEmailLoading}>
            {isVerifyEmailLoading ? "Vérification..." : "Vérifier"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="text-sm text-muted-foreground">
          Renvoyer le code
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EmailVerification



