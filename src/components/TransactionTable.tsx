import React, { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  to: string;
  type: string;
  amount: number;
}

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/transaction-history');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Date</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Reference ID</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>To</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Transaction Type</th>
          <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(({ id, date, to, type, amount }) => (
          <tr key={id}>
            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{date}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{id}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{to}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{type}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>RM {amount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
