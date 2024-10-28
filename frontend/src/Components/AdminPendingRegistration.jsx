import  { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // For accessibility reasons

const AdminPendingRegistration = () => {
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [zoomLevel, setZoomLevel] = useState(1);

    const modalStyles = {
        modal: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '10px',
            outline: 'none',
            zIndex: 1000,
            width: '40%',
            height: '60%',
            display: 'flex',
            flexDirection: 'column',
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 500,
        },
        imageContainer: {
            flex: '1',
            overflow: 'hidden',
            position: 'relative',
        },
        image: {
            maxWidth: '100%',
            maxHeight: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
        },
    };

    // Fetch user data from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/users/pending');
                const data = await response.json();
                setUsers(data);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleApproval = async (email) => {
        if (window.confirm(`Are you sure you want to approve ${email}'s registration?`)) {
            try {
                const response = await fetch('http://localhost:3001/api/approve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    alert(`${email}'s registration approved!`);
                    // window.location.reload();
                } else {
                    alert('Failed to approve registration.');
                }
            } catch (error) {
                console.error('Error approving registration:', error);
                alert('Error occurred while approving registration.');
            }
        }
    };

    const handleRejection = async (email) => {
        if (window.confirm(`Are you sure you want to reject ${email}'s registration?`)) {
            try {
                const response = await fetch('http://localhost:3001/api/reject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    alert(`${email}'s registration rejected!`);
                    // window.location.reload();
                } else {
                    alert('Failed to reject registration.');
                }
            } catch (error) {
                console.error('Error rejecting registration:', error);
                alert('Error occurred while rejecting registration.');
            }
        }
    };

    const openModal = (image) => {
        setCurrentImage(image);
        setModalIsOpen(true);
        setZoomLevel(1);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentImage('');
        setZoomLevel(1);
    };

    const zoomIn = () => {
        setZoomLevel((prev) => prev + 0.1);
    };

    const zoomOut = () => {
        setZoomLevel((prev) => (prev > 1 ? prev - 0.1 : prev));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Pending Registration</h1>
            <div className="bg-white shadow-md overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-nowrap">
                            <th className="border  px-4 py-2 text-left">First Name</th>
                            <th className="border px-4 py-2 text-left">Last Name</th>
                            <th className="border px-4 py-2 text-left">Street Address</th>
                            <th className="border px-4 py-2 text-left">Town</th>
                            <th className="border px-4 py-2 text-left">State</th>
                            <th className="border px-4 py-2 text-left">Pincode</th>
                            <th className="border px-4 py-2 text-left">Phone</th>
                            <th className="border px-4 py-2 text-left">Email</th>
                            <th className="border px-4 py-2 text-left">Nominee Name</th>
                            <th className="border px-4 py-2 text-left">Sponsor ID</th>
                            <th className="border px-4 py-2 text-left">Vigilance Officer</th>
                            <th className="border px-4 py-2 text-left">Account Username</th>
                            <th className="border px-4 py-2 text-left">Registration Date</th>
                            <th className="border px-4 py-2 text-left">User Image</th>
                            <th className="border px-4 py-2 text-left">Aadhar Front</th>
                            <th className="border px-4 py-2 text-left">Aadhar Back</th>
                            <th className="border px-4 py-2 text-left">PAN Card</th>
                            <th className="border px-4 py-2 text-left">Bank Passbook</th>
                            <th className="border px-4 py-2 text-left">Payment Screenshot</th>
                            <th className="border px-4 pl-2 text-leftbg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="border-b">
                                <td className="border px-4 py-2">{user.firstName}</td>
                                <td className="border px-4 py-2">{user.lastName}</td>
                                <td className="border px-4 py-2">{user.streetAddress}</td>
                                <td className="border px-4 py-2">{user.town}</td>
                                <td className="border px-4 py-2">{user.state}</td>
                                <td className="border px-4 py-2">{user.pincode}</td>
                                <td className="border px-4 py-2">{user.phone}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">{user.nomineeName}</td>
                                <td className="border px-4 py-2">{user.sponsorId}</td>
                                <td className="border px-4 py-2">{user.vigilanceOfficer}</td>
                                <td className="border px-4 py-2">{user.accountUsername}</td>
                                <td className="border px-4 py-2">{user.registrationDate}</td>
                                <td className="border px-4 py-2">
                                    <img
                                        src={`../../uploads/${user.userImage}`}
                                        alt="User"
                                        className="h-16 w-16 object-contain cursor-pointer"
                                        onClick={() => openModal(`../../uploads/${user.userImage}`)}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <img
                                        src={`../../uploads/${user.aadharFront}`}
                                        alt="Aadhar Front"
                                        className="h-16 w-16 object-contain cursor-pointer"
                                        onClick={() => openModal(`../../uploads/${user.aadharFront}`)}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <img
                                        src={`../../uploads/${user.aadharBack}`}
                                        alt="Aadhar Back"
                                        className="h-16 w-16 object-contain cursor-pointer"
                                        onClick={() => openModal(`../../uploads/${user.aadharBack}`)}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <img
                                        src={`../../uploads/${user.panCard}`}
                                        alt="PAN Card"
                                        className="h-16 w-16 object-contain cursor-pointer"
                                        onClick={() => openModal(`../../uploads/${user.panCard}`)}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <img
                                        src={`../../uploads/${user.bankPassbook}`}
                                        alt="Bank Passbook"
                                        className="h-16 w-16 object-contain cursor-pointer"
                                        onClick={() => openModal(`../../uploads/${user.bankPassbook}`)}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <img
                                        src={`../../uploads/${user.paymentScreenshot}`}
                                        alt="Payment Screenshot"
                                        className="h-16 w-16 object-contain cursor-pointer"
                                        onClick={() => openModal(`../../uploads/${user.paymentScreenshot}`)}
                                    />
                                </td>
                                <td className="border px-2 py-4 bg-white flex gap-2 w-64">
                                    <button
                                        onClick={() => handleApproval(user.email)}
                                        className="bg-green-500 text-white px-2 py-3 rounded hover:bg-green-600 mr-2"
                                    >
                                        <span className='flex items-center justify-center gap-1'><FaCheckCircle /> Approve</span>
                                    </button>
                                    <button
                                        onClick={() => handleRejection(user.email)}
                                        className="bg-red-500 text-white px-2 py-3 w-28 rounded hover:bg-red-600"
                                    >
                                        <span className='flex items-center justify-center gap-1'><FaTimesCircle /> Reject</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Image Viewing */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="overlay"
                style={{
                    content: {
                        ...modalStyles.modal,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    overlay: modalStyles.overlay,
                }}
            >
                <div className=" flex flex-col items-center" style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%', // Adjust as necessary
                            overflow: 'scroll',
                        }}
                    >
                        <img
                            src={currentImage}
                            alt="Current"
                            style={{
                                transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                                transition: 'transform 0.3s ease',
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transformOrigin: 'center center', // Center the image for scaling
                            }}
                        />

                    </div>
                    <div className="flex mt-4">
                        <button onClick={zoomOut} className="mb-2 bg-gray-300 px-2 py-1 rounded mr-2">
                            Zoom Out
                        </button>
                        <button onClick={zoomIn} className="mb-2 bg-gray-300 px-2 py-1 rounded">
                            Zoom In
                        </button>
                    </div>
                    <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                        Close
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default AdminPendingRegistration;