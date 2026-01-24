import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  email: z.email(),
  avatarUrl: z.url(),
  age: z.number().int().nonnegative(),
  jobTitle: z.string().trim().min(1),
  company: z.string().trim().min(1),
  phone: z.e164(),
  address: z.string().trim().min(1),
  bio: z.string().trim().min(1),
});

export type Profile = z.infer<typeof ProfileSchema>;
