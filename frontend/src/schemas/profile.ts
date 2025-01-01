import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  photo: z.string().nullable(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
