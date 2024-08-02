import z from "zod";

const userSchema = z.object({
  name: z.string({
    invalid_type_error: "User name must be a string",
    required_error: "User name is required.",
  }),
  email: z.string().email({
    invalid_type_error: "User email must be a string",
    required_error: "User email is required.",
    message: "User email must be a valid email address",
  }),
  password: z
    .string({
      invalid_type_error: "User password must be a string",
      required_error: "User password is required.",
    })
    .min(6, {
      message: "User password must have at least 6 characters",
    }),
});

export function validateUser(input) {
  return userSchema.safeParse(input);
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input);
}
