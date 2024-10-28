import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import html2canvas from 'html2canvas';

const CardGenerator = () => {
    const [userProfile, setUserProfile] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);

    // Helper function to format dates consistently
    const formatDate = (date) => {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('No authToken found in localStorage');
            return;
        }



        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/userdata', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                if (response.data) {
                    setUserProfile(response.data.user);
                } else {
                    console.error('No user data found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);
        const capture = document.getElementById('IDCARD');
        if (!capture) {
            console.error('Capture element not found');
            setIsDownloading(false);
            return;
        }

        const canvas = await html2canvas(capture, {
            scale: 2,
            scrollX: 0,
            scrollY: 0,
            useCORS: true,
            allowTaint: true,
            logging: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        doc.addImage(imgData, 'PNG', 0, 10, pageWidth, imgHeight > doc.internal.pageSize.getHeight() - 10 ? doc.internal.pageSize.getHeight() - 10 : imgHeight);
        doc.save(`${userProfile.firstName || 'User'}_ID_Card.pdf`);
        setIsDownloading(false);
    };

    return (
        <div>
            <div id='IDCARD' className='w-full flex justify-center gap-10'>
                <div className="flex flex-col items-center">
                    {/* Front Side */}
                    <div className="border-[1px] border-gray-600 w-[450px] h-[300px] rounded-lg shadow-xl bg-white relative overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center">
                            <img src="/Photos/Logo.jpg" alt="Logo" className="pl-2 w-30 h-20 object-fill" />
                            <div className='w-full'>
                                <h2 className='text-[20px] tracking-wider text-nowrap text-center font-extrabold text-red-600'>
                                    <span className='text-[22px]'>D</span>IGITAL <span className='text-[22px]'>I</span>NDIA <span className='text-[22px]'>E</span>DUCATION
                                </h2>
                                <p className='text-center font-bold mt-[-10px]'>wa</p>
                                <h2 className='tracking-wide text-center mt-[-10px] text-[40px] font-extrabold'>
                                    <span className='text-red-600'>DIGITAL</span> <span className='text-blue-700'>MEDIA</span>
                                </h2>
                            </div>
                        </div>

                        {/* Photo and Info Section */}
                        <div className='px-2'>
                            <p className="text-[13px] text-red-500 text-center font-bold ">
                                IDENTITY CARD
                            </p>
                            <div className="flex">
                                <div>
                                    <img src={userProfile.userImage ? `../../uploads/${userProfile.userImage}` : '/Photos/PersonIcon.jpg'} alt="Profile" className="w-20 border-[1px] h-[100px] object-fill border-gray-500" />
                                </div>
                                <div className="ml-4 text-[12px] leading-snug flex-grow uppercase font-bold">
                                    <p><span className="font-bold">NAME: </span><span className="font-normal">{userProfile.firstName || 'Loading...'} {userProfile.lastName || 'Loading...'}</span></p>
                                    <p><span className="font-bold">DESIGNATION: </span><span className="font-normal">{userProfile.vigilanceOfficer || 'Loading...'}</span></p>
                                    <p><span className="font-bold">USER MOBILE: </span><span className="font-normal">{userProfile.phone || 'Loading...'}</span></p>
                                    <p><span className="font-bold">WORKING AREA: </span><span className="font-normal">{userProfile.state || 'Loading...'}</span></p>
                                    <p><span className="font-bold">ISSUE DATE: </span><span className="font-normal">{userProfile.registrationDate ? formatDate(userProfile.registrationDate) : 'Loading...'}</span></p>
                                    <p><span className="font-bold">EXPIRE DATE: </span><span className="font-normal">{userProfile.registrationDate ? formatDate(new Date(new Date(userProfile.registrationDate).setFullYear(new Date(userProfile.registrationDate).getFullYear() + 1))) : 'Loading...'}</span></p>
                                </div>
                                <div className="ml-4 mt-3">
                                    <img src="/Photos/QR.jpg" alt="QR Code" className="w-16 h-16" />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div>
                            <p className='mt-2 pb-2 bg-blue-700 text-white text-center text-[12px] font-bold m-0 p-0'>सबका साथ, सबका विकास</p>
                            <div className='bg-red-600 pb-3 pt-0'>
                                <p className='text-white text-center text-[13px] font-medium tracking-wider m-0 p-0'>www.digitalindiaeducation.co.in</p>
                                <p className='text-white text-center text-[13px] font-medium tracking-wider m-0 p-0'>REGISTERED UNDER GOVERNMENT OF INDIA</p>
                            </div>
                        </div>
                    </div>

                    {/* Back Side */}
                    <div className="border-[1px] border-gray-600 w-[450px] h-[300px] rounded-lg shadow-xl bg-white relative overflow-hidden mt-4">
                        <div className="bg-gradient-to-r from-blue-500 to-red-500 text-white text-center pb-3 font-semibold text-[12px] leading-tight">
                            <p className="text-[16px] tracking-wide">DIGITAL INDIA EDUCATION & DIGITAL INDIA MEDIA</p>
                            <p className="text-[11px]">REGISTERED UNDER GOVERNMENT OF INDIA REGISTRATION NO {userProfile.phone || 'Loading...'}</p>
                        </div>
                        <div className="px-4 text-[10px] leading-tight mb-1">
                            <p className="font-bold underline mb-3 text-[15px] text-center text-red-600">Declaration</p>
                            <ul className="list-disc pl-5 font-semibold text-[12px] mb-3">
                                <li>This Card is issued for the Identification of the Member & must be produced on demand.</li>
                                <li>The Card Holder is authorized to book advertisements from all over India for the website & promote the website throughout India.</li>
                                <li>This Card Is Not A Reporter Card.</li>
                                <li>The Company Is Not Liable For any illegal activity of the card holder.</li>
                                <li>If the Card is lost, the Member must lodge an FIR & inform the issuing authority.</li>
                                <li>This Card is not valid anymore after the validity date.</li>
                                <li>After expiry of the card's validity, the member must renew the card.</li>
                            </ul>
                        </div>

                        {/* Footer */}
                        <div className="bg-gradient-to-r from-blue-500 to-red-500 leading-tight pb-3">
                            <p className='text-white text-center text-[13px] font-semibold'>Corporate Office: E-112, Siddhi Appartment, Near Madhuvan Society, Ghodasar, Ahmedabad - 380050, Gujarat</p>
                            <p className='text-white text-center text-[10px] font-semibold'>Phone: +91 90991 00374</p>
                            <p className='text-white text-center text-[10px] font-semibold'>Email: digitalindiaeducation@gmail.com</p>
                            <p className='text-white text-center text-[10px] font-semibold'>Website: www.digitalindiaeducation.co.in</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <div className='flex justify-center'>
                <button
                    onClick={downloadPDF}
                    className={`w-40 h-10 rounded-md bg-blue-600 text-white font-semibold ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isDownloading}
                >
                    {isDownloading ? 'Downloading...' : 'Download Card'}
                </button>
            </div>
        </div>
    );
};

export default CardGenerator;
