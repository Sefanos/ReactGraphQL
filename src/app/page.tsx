'use client'

import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import CompteForm from '../components/CompteForm';
import TransactionForm from '../components/TransactionForm';
import CompteList from '../components/CompteList';

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-2xl font-semibold mb-5 text-center text-gray-900">Banking Management</h1>
            <div className="space-y-8">
              <CompteForm />
              <TransactionForm />
              <CompteList />
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}
