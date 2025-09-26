import TransactionTable from '../components/TransactionTable';

export default function Dashboard() {
  return (
    <main style={{ padding: '1rem' }}>
      <h1>Dashboard - Transaction History</h1>
      <TransactionTable />
    </main>
  );
}
