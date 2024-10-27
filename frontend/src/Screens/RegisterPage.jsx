import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import IntroBanner from '../Components/IntroBanner';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import GoToTopButton from '../Components/GoToTopButton';

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const [aadharFront, setAadharFront] = useState(null);
    const [aadharBack, setAadharBack] = useState(null);
    const [pan, setPan] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [bankPassbook, setbankPassbook] = useState(null);

    const [uploadProgress, setUploadProgress] = useState({
        aadharFront: 0,
        aadharBack: 0,
        pan: 0,
        userImage: 0,
        paymentScreenshot: 0,
        bankPassbook: 0,
    });
    const navigate = useNavigate();

    // Function to check if the user is 18 years or older
    const isAdult = (dob) => {
        const dobDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDifference = today.getMonth() - dobDate.getMonth();
        return (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate()))
            ? age - 1 >= 18
            : age >= 18;
    };

    // Function to handle file uploads
    const handleFileChange = (field) => (event) => {
        const file = event.target.files[0];
        if (file) {
            if (field === 'aadharFront') {
                setAadharFront(file);
            } else if (field === 'aadharBack') {
                setAadharBack(file);
            } else if (field === 'pan') {
                setPan(file);
            } else if (field === 'userImage') {
                setUserImage(file);
            } else if (field === 'paymentScreenshot') {
                setPaymentScreenshot(file);
            } else if (field === 'bankPassbook') {
                setbankPassbook(file)  // Handling new field
            }
            // Simulate upload progress for demo purposes
            const uploadInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    const currentProgress = prev[field] || 0;
                    if (currentProgress >= 100) {
                        clearInterval(uploadInterval);
                        return { ...prev, [field]: 100 }; // Ensure it caps at 100%
                    }
                    return { ...prev, [field]: currentProgress + 10 };
                });
            }, 100);
        }
    };

    // Function to send form data to the backend
    const onSubmit = async (data) => {
        const formData = new FormData();

        // Append form fields
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('streetAddress', data.streetAddress);
        formData.append('town', data.town);
        formData.append('state', data.state);
        formData.append('pincode', data.pincode);
        formData.append('phone', data.phone);
        formData.append('nomineeName', data.nomineeName);
        formData.append('referPhoneNumber', data.referPhoneNumber); // Change here to referPhoneNumber
        formData.append('vigilanceOfficer', "Tahsil Officer");
        formData.append('accountUsername', data.accountUsername);
        formData.append('registrationDate', new Date().toISOString());

        // Append files
        formData.append('userImage', userImage);
        formData.append('aadharFront', aadharFront);
        formData.append('aadharBack', aadharBack);
        formData.append('panCard', pan);
        formData.append('bankPassbook', bankPassbook);
        formData.append('paymentScreenshot', paymentScreenshot);

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                body: formData,  // Send as FormData object
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            // const result = await response.json();
            setSubmitMessage('Registration successful!');
            reset();  // Reset the form after successful registration
            localStorage.setItem('isRegistered', 'true');
            navigate('/login');
        } catch (error) {
            console.error('Error:', error);
            setSubmitMessage('Registration failed. Please try again.');
        }
    };

    return (
        <>
            <IntroBanner />
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-[70%] m-10">
                    <h2 className="text-3xl font-bold mb-6 text-center">Registration Form</h2>
                    {submitMessage && (
                        <div className={`text-center ${submitMessage.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                            {submitMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">First Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('firstName', { required: 'First Name is required' })}
                                placeholder='Enter First Name'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Last Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('lastName', { required: 'Last Name is required' })}
                                placeholder='Enter Last Name'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Date of Birth <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="date"
                                {...register('dob', {
                                    required: 'Date of Birth is required',
                                    validate: (value) => {
                                        const isValidDate = !isNaN(new Date(value).getTime()); // Check if the date is valid
                                        if (!isValidDate) return 'Please enter a valid date';

                                        // Check if the user is at least 18 years old
                                        return isAdult(value) || 'You must be at least 18 years old';
                                    },
                                })}
                                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                        </div>



                        {/* Phone Number */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Phone Number <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('phone', {
                                    required: 'Phone Number is required',
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: 'Phone Number must be 10 digits',
                                    },
                                })}
                                placeholder='Enter Phone Number'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Email <span className='text-red-500'>*</span></label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Invalid email format',
                                    },
                                })}
                                placeholder='Enter Email'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                                autoComplete='email'
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Street Address */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Street Address<span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('streetAddress', { required: 'Street Address is required' })}
                                placeholder="Enter House Number and Street Name"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.streetAddress && <p className="text-red-500">{errors.streetAddress.message}</p>}
                        </div>

                        {/* Town*/}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Town <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('town', { required: 'Town is required' })}
                                placeholder="Enter Town"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                        </div>

                        {/* State Dropdown */}
                        <div className="relative">
                            <label className="block mb-1 font-semibold text-start">
                                State<span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                                {...register('state', { required: 'State is required' })} // Validation with react-hook-form
                            >
                                <option value="">Select State</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                <option value="Assam">Assam</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                                <option value="Goa">Goa</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Manipur">Manipur</option>
                                <option value="Meghalaya">Meghalaya</option>
                                <option value="Mizoram">Mizoram</option>
                                <option value="Nagaland">Nagaland</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Sikkim">Sikkim</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Uttarakhand">Uttarakhand</option>
                                <option value="West Bengal">West Bengal</option>
                            </select>
                            {/* Error Display */}
                            {errors.state && <p className="text-red-500">{errors.state.message}</p>}
                        </div>


                        {/* City Textbox */}
                        <div className="relative mt-4">
                            <label className="block mb-1 font-semibold text-start">
                                City<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter City"
                                {...register('city', { required: 'City is required' })}
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                            />
                            {/* Display Error */}
                            {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                        </div>

                        {/* Pincode */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Pincode <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('pincode', {
                                    required: 'Pincode is required',
                                    pattern: {
                                        value: /^[1-9][0-9]{5}$/,
                                        message: 'Invalid Pincode',
                                    },
                                })}
                                placeholder="Enter Pincode"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.pincode && <p className="text-red-500">{errors.pincode.message}</p>}
                        </div>

                        {/* Nominee Name */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Nominee Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('nomineeName', { required: 'Nominee Name is required' })}
                                placeholder="Enter Nominee Name"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.nomineeName && <p className="text-red-500">{errors.nomineeName.message}</p>}
                        </div>

                        {/* Sponsor ID */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Sponsor ID</label>
                            <input
                                type="text"
                                {...register('referPhoneNumber')} // Change here to referPhoneNumber
                                placeholder="Enter Sponsor ID"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.referPhoneNumber && <p className="text-red-500">{errors.referPhoneNumber.message}</p>} {/* Change here to referPhoneNumber */}
                        </div>


                        {/* Username */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Username <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('accountUsername', { required: 'Username is required' })}
                                placeholder="Enter Username"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block mb-1 font-semibold text-start">Password <span className='text-red-500'>*</span></label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                                placeholder="Enter Password"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 cursor-pointer">
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <label className="block mb-1 font-semibold text-start">Confirm Password <span className='text-red-500'>*</span></label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: (value) => value === watch('password') || 'Passwords do not match',
                                })}
                                placeholder="Confirm Password"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 cursor-pointer">
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </span>
                            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* User Image Upload */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">User Image <span className='text-red-500'>*</span></label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                {...register('userImage', { required: 'User Image is required' })}
                                onChange={handleFileChange('userImage')}
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            <div className="mt-2">
                                {userImage && <span>{userImage.name}</span>}
                                {errors.userImage && <p className="text-red-500">{errors.userImage.message}</p>}
                                {uploadProgress.userImage > 0 && (
                                    <div>
                                        <div className="relative w-full bg-gray-300 rounded">
                                            <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress.userImage}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-600">{uploadProgress.userImage}% uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Aadhar Front Upload */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Aadhar Card (Front) <span className='text-red-500'>*</span></label>
                            <input
                                type="file"
                                accept=".jpg, .jpeg, .png, .pdf"
                                {...register('aadharFront', { required: 'Aadhar Front is required' })}
                                onChange={handleFileChange('aadharFront')}
                                className='border border-gray-300 focus:border-black w-full p-2'
                            />
                            <div className="mt-2">
                                {aadharFront && <span>{aadharFront.name}</span>}
                                {errors.aadharFront && <p className="text-red-500">{errors.aadharFront.message}</p>}
                                {uploadProgress.aadharFront > 0 && (
                                    <div>
                                        <div className="relative w-full bg-gray-300 rounded">
                                            <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress.aadharFront}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-600">{uploadProgress.aadharFront}% uploaded</p>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Aadhar Back Upload */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Aadhar Card (Back) <span className='text-red-500'>*</span></label>
                            <input
                                type="file"
                                accept=".jpg, .jpeg, .png, .pdf"
                                {...register('aadharBack', { required: 'Aadhar Back is required' })}
                                onChange={handleFileChange('aadharBack')}
                                className='border border-gray-300 focus:border-black w-full p-2'
                            />
                            <div className="mt-2">
                                {aadharBack && <span>{aadharBack.name}</span>}
                                {errors.aadharBack && <p className="text-red-500">{errors.aadharBack.message}</p>}
                                {uploadProgress.aadharBack > 0 && (
                                    <div>
                                        <div className="relative w-full bg-gray-300 rounded">
                                            <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress.aadharBack}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-600">{uploadProgress.aadharBack}% uploaded</p>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* PAN Upload */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">PAN Card <span className='text-red-500'>*</span></label>
                            <input
                                type="file"
                                accept=".jpg, .jpeg, .png, .pdf"
                                {...register('panCard', { required: 'PAN is required' })}
                                onChange={handleFileChange('pan')}
                                className='border border-gray-300 focus:border-black w-full p-2'
                            />
                            <div className="mt-2">
                                {pan && <span>{pan.name}</span>}
                                {errors.pan && <p className="text-red-500">{errors.pan.message}</p>}
                                {uploadProgress.pan > 0 && (
                                    <div>
                                        <div className="relative w-full bg-gray-300 rounded">
                                            <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress.pan}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-600">{uploadProgress.pan}% uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Passbook Upload */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Bank Passbook <span className='text-red-500'>*</span></label>
                            <input
                                type="file"
                                accept=".jpg, .jpeg, .png, .pdf"
                                {...register('bankPassbook', { required: 'Bank Passbook is required' })}
                                onChange={handleFileChange('bankPassbook')}
                                className='border border-gray-300 focus:border-black w-full p-2'
                            />
                            <div className="mt-2">
                                {bankPassbook && <span>{bankPassbook.name}</span>} {/* Changed from pan.name to bank.name */}
                                {errors.bankPassbook && <p className="text-red-500">{errors.bankPassbook.message}</p>} {/* Fixed typo */}
                                {uploadProgress.bankPassbook > 0 && ( /* Changed to uploadProgress.bank */
                                    <div>
                                        <div className="relative w-full bg-gray-300 rounded">
                                            <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress.bankPassbook}%` }}></div> {/* Changed to uploadProgress.bank */}
                                        </div>
                                        <p className="text-sm text-gray-600">{uploadProgress.bankPassbook}% uploaded</p> {/* Changed to uploadProgress.bank */}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* QR Code For Payment */}
                        <div className="mb-6 text-center">
                            {/* Label or Heading */}
                            <h3 className="text-xl font-bold mb-2">Scan the QR Code for Payment</h3>

                            {/* QR Code Image */}
                            <img
                                src="Photos/QR.jpg" // Replace with the actual path of your QR code image in the public folder
                                alt="QR Code for Payment"
                                className="mx-auto mb-4 w-48 h-48"
                            />

                            {/* Optional additional info */}
                            <p className="text-gray-600">Please scan the QR code above to complete your payment before proceeding with registration.</p>
                        </div>

                        {/* Payment Screenshot Upload */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Payment Screenshot <span className='text-red-500'>*</span></label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                {...register('paymentScreenshot', { required: 'Payment Screenshot is required' })}
                                onChange={handleFileChange('paymentScreenshot')}
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            <div className="mt-2">
                                {paymentScreenshot && <span>{paymentScreenshot.name}</span>}
                                {errors.paymentScreenshot && <p className="text-red-500">{errors.paymentScreenshot.message}</p>}
                                {uploadProgress.paymentScreenshot > 0 && (
                                    <div>
                                        <div className="relative w-full bg-gray-300 rounded">
                                            <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress.paymentScreenshot}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-600">{uploadProgress.paymentScreenshot}% uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit and Reset buttons */}
                        <div className="flex space-x-4 justify-center">
                            <button
                                type="submit"
                                className={`bg-blue-500 ${isSubmitting ? 'bg-blue-400 hover:bg-blue-400' : ''} w-32 rounded text-white p-2 hover:bg-blue-600`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting" : "Submit"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="bg-gray-500 w-32 rounded text-white p-2 hover:bg-gray-600"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <GoToTopButton />
            <Footer />
        </>
    );
};
export default RegisterPage;