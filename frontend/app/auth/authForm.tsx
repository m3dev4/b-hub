import { useAuth } from "@/hooks/useAuth";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthForm = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { login, register } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  const loginForm = useForm({
    resolver: zodResolver(signInSchema),
  });
  const registerForm = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const handleLogin = async (data: z.infer<typeof signInSchema>) => {
    try {
      setError("");
      await login.mutateAsync({
        identifier: data.identifier,
        password: data.password,
      });
      if (login.isSuccess) {
        
      }
    } catch (error: any) {
      setError(error.response?.data?.message);
    }
  };

  const handleRegister = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setError("");
      await register.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
      });
      if (register.isSuccess) {
        
      }
    } catch (error: any) {
      setError(error.response?.data?.message);
    }
  };
  return (
    <Card className="w-[400px] shadow-lg border-0 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Bienvenue sur B-Hub
        </CardTitle>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mt-2"></div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 rounded-lg p-1">
            <TabsTrigger 
              value="login"
              onClick={() => setMode('login')}
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Connexion
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              onClick={() => setMode('signup')}
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
           <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="py-4"
            >
              <div className="flex flex-col space-y-6 m-auto">
                <div>
                  <Input
                    {...loginForm.register("identifier")}
                    placeholder="Email ou nom d'utilisateur"
                    type="text"
                    className="w-full"
                  />
                  {loginForm.formState.errors.identifier && (
                    <p className="text-red-500">
                      {loginForm.formState.errors.identifier.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...loginForm.register("password")}
                    placeholder="Mot de passe"
                    type="password"
                    className="w-full"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <span className="text-sm text-muted-foreground">
                  Mot de passe oublié ?{" "}
                  <Link href="/auth/forgot-password" className="underline text-white">Cliquez ici</Link>
                </span>

                <Button
                  className="w-full mt-4 cursor-pointer"
                  type="submit"
                  disabled={login.isPending}
                >
                  {login.isPending ? "connexion..." : "Se connecter"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    {...registerForm.register('firstName')}
                    placeholder="Prénom"
                    type="text"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...registerForm.register('lastName')}
                    placeholder="Nom"
                    type="text"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  {...registerForm.register('userName')}
                  placeholder="Nom d'utilisateur"
                  type="text"
                />
                {registerForm.formState.errors.userName && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.userName.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...registerForm.register('email')}
                  placeholder="Email"
                  type="email"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...registerForm.register('password')}
                  placeholder="Mot de passe"
                  type="password"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...registerForm.register('confirmPassword')}
                  placeholder="Confirmer votre mot de passe"
                  type="password"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button 
                type="submit" 
                className="w-full"
                disabled={register.isPending}
              >
                {register.isPending ? 'Inscription...' : 'S\'inscrire'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
