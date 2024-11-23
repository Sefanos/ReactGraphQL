/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, gql } from '@apollo/client';
import { FiDelete } from 'react-icons/fi'; // Importing the delete icon
import { useEffect } from 'react';

const GET_ALL_COMPTES = gql`
  query GetAllComptes {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;

const DELETE_COMPTE = gql`
  mutation DeleteCompte($id: ID!) {
    deleteCompte(id: $id)
  }
`;


const GET_TRANSACTIONS_BY_COMPTE = gql`
  query GetTransactionsByCompte($compteId: ID!) {
    transactionsByCompte(compteId: $compteId) {
      id
      amount
      date
      type
    }
  }
`;

export default function CompteList() {
  const { data: comptesData, loading: comptesLoading, error: comptesError, refetch: refetchComptes, subscribeToMore } = useQuery(GET_ALL_COMPTES);

  // Automatically subscribe to changes to keep the account list updated
  useEffect(() => {
    if (comptesData) {
      subscribeToMore({
        document: GET_ALL_COMPTES,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          return {
            allComptes: [...prev.allComptes, subscriptionData.data.newCompte],
          };
        },
      });
    }
  }, [comptesData, subscribeToMore]);

  if (comptesLoading) return <p className="text-center text-gray-600">Loading accounts...</p>;
  if (comptesError) return <p className="text-center text-red-500">Error loading accounts: {comptesError.message}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Accounts</h2>
      {comptesData?.allComptes.map((compte: any) => (
        <div key={compte.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-cyan-50 to-blue-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account {compte.id} - {compte.type}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Balance: {compte.solde} | Created: {new Date(compte.dateCreation).toLocaleDateString()}
            </p>
            <DeleteCompteButton compteId={compte.id} refetchComptes={refetchComptes} />
          </div>
          <div className="border-t border-gray-200">
            <TransactionList compteId={compte.id} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DeleteCompteButton({ compteId, refetchComptes }: { compteId: string, refetchComptes: any }) {
  const [deleteCompte, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_COMPTE);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteCompte({ variables: { id: compteId } })  // Correct the argument name here
        .then(() => {
          refetchComptes(); // Refetch comptes after deletion
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    }
  };

  if (deleteLoading) return <p className="text-center text-gray-600">Deleting...</p>;
  if (deleteError) return <p className="text-center text-red-500">Error deleting account: {deleteError.message}</p>;

  return (
    <button
      onClick={handleDelete}
      className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-700 text-sm flex items-center justify-center space-x-1"
    >
      <FiDelete className="text-white" size={16} />
      <span className="text-xs">Delete</span>
    </button>
  );
}

function TransactionList({ compteId }: { compteId: string }) {
  const { data: transactionsData, loading: transactionsLoading, error: transactionsError, refetch } = useQuery(GET_TRANSACTIONS_BY_COMPTE, {
    variables: { compteId },
  });

  useEffect(() => {
    // Automatically subscribe to changes for transactions
    if (transactionsData) {
      refetch();
    }
  }, [transactionsData, refetch]);

  if (transactionsLoading) return <p className="p-4 text-center text-gray-600">Loading transactions...</p>;
  if (transactionsError) return <p className="p-4 text-center text-red-500">Error loading transactions: {transactionsError.message}</p>;

  return (
    <ul className="divide-y divide-gray-200">
      {transactionsData?.transactionsByCompte.map((transaction: any) => (
        <li key={transaction.id} className="px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}: {transaction.amount}
            </p>
            <div className="ml-2 flex-shrink-0 flex">
              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {new Date(transaction.date).toLocaleString()}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
