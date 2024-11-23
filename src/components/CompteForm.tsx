import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const SAVE_COMPTE = gql`
  mutation SaveCompte($compte: CompteRequest!) {
    saveCompte(compte: $compte) {
      id
      solde
      dateCreation
      type
    }
  }
`;

export default function CompteForm() {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('COURANT');
  const [saveCompte] = useMutation(SAVE_COMPTE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format the date to 'yyyy-MM-dd'
      const formattedDate = new Date()
      .toLocaleDateString('en-CA')
      .replace(/-/g, '/');

      // Send the mutation with the formatted data
      await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde), // Convert balance to a number
            dateCreation: formattedDate, // Send formatted date
            type, // Account type from dropdown
          },
        },
      });

      // Reset the form fields
      setSolde('');
      setType('COURANT');
      alert('Account created successfully!');
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">New Account</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="solde" className="block text-sm font-medium text-gray-700 mb-1">
            Initial Balance
          </label>
          <input
            type="number"
            id="solde"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
            required
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="COURANT">Courant</option>
            <option value="EPARGNE">Epargne</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        Create Account
      </button>
    </form>
  );
}
