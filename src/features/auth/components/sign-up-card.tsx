"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DottedSeparator from "@/components/dotted-sperator";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "../schema/validation";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRegister } from "../api/use-register";

export function SignUpCard() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutate: register, isPending } = useRegister();

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    register({ json: values });
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none mt-10">
      <CardHeader className="flex items-center justify-center text-center gap-y-2 p-7">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/terms-of-service" className="text-blue-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-blue-500">
            Privacy Policy
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col gap-y-4">
        <Button variant="secondary" size="lg" className="w-full">
          <FcGoogle className="size-5 me-2" />
          <span>Sign up with Google</span>
        </Button>
        <Button variant="secondary" size="lg" className="w-full">
          <FaGithub className="size-5 me-2" />
          <span>Sign up with Github</span>
        </Button>
      </CardContent>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardFooter className="flex justify-center mt-4">
        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
