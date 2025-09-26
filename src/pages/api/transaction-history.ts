import type { NextApiRequest, NextApiResponse } from 'next';

interface Transaction {
  id: string;
  date: string;
  to: string;
  type: string;
  amount: number;
}

const transactions: Transaction[] = [
  { id: 'REF12345', date: '2025-08-01', to: 'Alice Smith', type: 'Credit', amount: 100.5 },
  { id: 'REF23456', date: '2025-08-15', to: 'Bob Johnson', type: 'Debit', amount: -45.0 },
  { id: 'REF34567', date: '2025-09-05', to: 'Netflix', type: 'Debit', amount: -20.25 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(transactions);
}
