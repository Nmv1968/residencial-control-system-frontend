import { z } from 'zod';

// --- Category Schemas ---
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema> & { _id: string };

// --- Unit Schemas ---
export const unitSchema = z.object({
  number: z.string().min(1, 'Unit Number is required'),
  residentName: z.string().min(1, 'Resident Name is required'),
  phone: z.string().optional(),
  status: z.enum(['OCCUPIED', 'VACANT', 'MAINTENANCE']),
  categoryId: z.string().min(1, 'Category is required'),
  // Balance is read-only from backend usually, but for display types:
  balance: z.number().optional(),
});

// For response from API which might populate category or just id
export type Unit = z.infer<typeof unitSchema> & {
  _id: string;
  category?: Category;
};

// --- PaymentMethod Schemas ---
export const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  isActive: z.boolean().default(true),
  isBank: z.boolean().default(false),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolder: z.string().optional(),
  accountType: z.enum(['SAVINGS', 'CURRENT']).optional(),
  additionalData: z.string().optional(),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema> & {
  _id: string;
};

// --- Debt Schemas ---
export const debtSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  concept: z.string().min(1, 'Concept is required'),
  dueDate: z.string().date().optional(), // ISO Date String
  unitId: z.string().min(1, 'Unit is required'),
});

export type Debt = z.infer<typeof debtSchema> & {
  _id: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  generationDate: string;
  unit?: Unit | any; // Populated
};

// --- Payment Schemas ---
export const paymentSchema = z.object({
  totalAmount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentDate: z.string().date(), // ISO Date
  observation: z.string().optional(),
  proofUrl: z.string().optional(),
  unitId: z.string().min(1, 'Unit is required'),
  paymentMethodId: z.string().min(1, 'Payment Method is required'),
  debtIds: z.array(z.string()).optional(), // Optional selection of debts
});

export type Payment = z.infer<typeof paymentSchema> & {
  _id: string;
  debtsPaid?: Debt[];
  unit?: Unit | any; // Populated
  paymentMethod?: PaymentMethod | any; // Populated
  snapshotData?: {
    unitNumber?: string;
    categoryName?: string;
  };
};

// --- Bulk Generation Schema ---
export const bulkDebtSchema = z
  .object({
    scope: z.enum(['ALL', 'CATEGORY', 'SINGLE']),
    targetId: z.string().optional(), // Required if scope is CATEGORY or SINGLE, validated in logic usually
    amount: z.number().min(0.01),
    concept: z.string().min(1),
    dueDate: z.string().date().optional(),
  })
  .refine(
    (data) => {
      if (data.scope === 'CATEGORY' || data.scope === 'SINGLE') {
        return !!data.targetId;
      }
      return true;
    },
    {
      message: 'Target ID is required for this scope',
      path: ['targetId'],
    }
  );
