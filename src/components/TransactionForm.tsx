/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';

const ADD_TRANSACTION = gql`
  mutation AddTransaction($transactionRequest: TransactionRequest!) {
    addTransaction(transactionRequest: $transactionRequest) {
      id
      amount
      date
      type
    }
  }
`;

const GET_ALL_COMPTES = gql`
  query GetAllComptes {
    allComptes {
      id
      solde
      type
    }
  }
`;

export default function TransactionForm() {
  const [compteId, setCompteId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('DEPOSIT');
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const { data: comptesData } = useQuery(GET_ALL_COMPTES);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        variables: {
          transactionRequest: {
            compteId,
            amount: parseFloat(amount),
            type,
          },
        },
      });
      setCompteId('');
      setAmount('');
      setType('DEPOSIT');
      alert('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">New Transaction</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="compteId" className="block text-sm font-medium text-gray-700 mb-1">
            Account
          </label>
          <select
            id="compteId"
            value={compteId}
            onChange={(e) => setCompteId(e.target.value)}
            required
            className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select account</option>
            {comptesData?.allComptes.map((compte: any) => (
              <option key={compte.id} value={compte.id}>
                {compte.id} - {compte.type} ({compte.solde})
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            text-gray-700
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAWAL">Withdrawal</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-2 px-4 rounded-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Add Transaction
      </button>
    </form>
  );
}

