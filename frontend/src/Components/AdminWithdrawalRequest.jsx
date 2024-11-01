import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminWithdrawalRequest = () => {
    // Static data for withdrawal requests with a placeholder image URL for the bank passbook
    const requests = [
        {
            username: 'john_doe',
            name: 'John Doe',
            email: 'john@example.com',
            withdrawAmount: '$100',
            passbookPhoto: 'https://via.placeholder.com/100' // Placeholder image
        },
        {
            username: 'jane_smith',
            name: 'Jane Smith',
            email: 'jane@example.com',
            withdrawAmount: '$200',
            passbookPhoto: 'https://via.placeholder.com/100'
        },
        {
            username: 'bob_brown',
            name: 'Bob Brown',
            email: 'bob@example.com',
            withdrawAmount: '$150',
            passbookPhoto: 'https://via.placeholder.com/100'
        },
    ];

    // Static handlers for approve and reject actions
    const handleApprove = (email) => {
        alert(`Approved request for ${email}`);
    };

    const handleReject = (email) => {
        alert(`Rejected request for ${email}`);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>
            <div className="bg-white shadow-md overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2 text-left">Username</th>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">Email</th>
                            <th className="border px-4 py-2 text-left">Withdraw Amount</th>
                            <th className="border px-4 py-2 text-left">Bank Passbook</th>
                            <th className="border px-4 py-2 text-left sticky right-0 bg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={index} className="border-b">
                                <td className="border px-4 py-2">{request.username}</td>
                                <td className="border px-4 py-2">{request.name}</td>
                                <td className="border px-4 py-2">{request.email}</td>
                                <td className="border px-4 py-2">{request.withdrawAmount}</td>
                                <td className="border px-4 py-2">
                                    <img
                                        src={request.passbookPhoto}
                                        alt="Bank Passbook"
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="px-4 pt-6 bg-white  flex items-center justify-center">
                                    <button
                                        onClick={() => handleApprove(request.email)}
                                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2 flex items-center"
                                    >
                                        <FaCheckCircle className="mr-1" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.email)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
                                    >
                                        <FaTimesCircle className="mr-1" /> Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminWithdrawalRequest;
