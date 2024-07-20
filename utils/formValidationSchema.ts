import { z } from 'zod'

export const technologyFormSchema = z.object({
  technologyUrl: z.string().url('Please enter a valid URL'),
  technologyName: z.string().min(1, 'Technology name is required'),
  description: z.string().min(1, 'Description is required'),
  docsUrl: z
    .string()
    .min(1, 'Please enter a valid URL for the documentation page')
    .refine((data) => !data || z.string().url().safeParse(data).success, {
      message: 'Please enter a valid URL'
    }),
  updateUrl: z
    .string()
    .min(1, 'Please enter a valid URL for the update page')
    .refine((data) => !data || z.string().url().safeParse(data).success, {
      message: 'Please enter a valid URL'
    }),
  theme: z.string().min(1, 'Colour theme is required'),
  c4ModelAbstraction: z.array(z.string()).min(1, 'C4 model abstraction is required')
})
