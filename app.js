const { useState, useEffect } = React;

// --- Dummy Data ---
const initialStudents = [
    { id: 'S-001', name: 'John Doe', grade: 'Grade 1', status: 'Enrolled', balance: 5000, email: 'john.d@example.com', phone: '09171234567', guardian: 'Maria Doe', dob: '2018-05-15', address: '123 Main St, Manila', hasScholarship: false, scholarshipDetails: '' },
    { id: 'S-002', name: 'Jane Smith', grade: 'Grade 2', status: 'Enrolled', balance: 0, email: 'jane.s@example.com', phone: '09187654321', guardian: 'Robert Smith', dob: '2017-02-20', address: '456 Oak Ave, Quezon City', hasScholarship: true, scholarshipDetails: 'Academic Full' },
];

const initialPayments = [
    { id: 'P-001', studentId: 'S-002', studentName: 'Jane Smith', date: '2025-09-20', amount: 8000, type: 'Cash', refNo: '', for: ['Tuition'], notes: 'Full payment', receiptSent: true },
    { id: 'P-002', studentId: 'S-001', studentName: 'John Doe', date: '2025-09-22', amount: 3000, type: 'Check', refNo: 'CHK-12345', for: ['Tuition'], notes: 'Downpayment', receiptSent: false },
];

const GRADE_LEVELS = ["Kinder 1", "Kinder 2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
const STUDENT_STATUSES = ["Enrolled", "Pending", "Waitlisted", "Withdrew"];
const PAYMENT_TYPES = ["Cash", "Check", "Bank Transfer", "Online"];
const PAYMENT_FOR_OPTIONS = ["Tuition", "Books", "Uniform", "Other"];

// --- Inline SVG Icons ---
const PeopleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const MoneyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a2 2 0 00-2 2v2H5a2 2 0 00-2 2v5a2 2 0 002 2h8a2 2 0 002-2v-5a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H8zM6 4a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v2H6V4zm2 5h4a1 1 0 010 2H8a1 1 0 010-2z" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-2 0V4H5v12h4v-1a1 1 0 112 0v1a2 2 0 01-2 2H4a2 2 0 01-2-2V4a1 1 0 011-1zm10.586 10.586a2 2 0 01-2.828-2.828l.707-.707a1 1 0 00-1.414-1.414l-.707.707a4 4 0 005.656 5.656l-.707-.707z" clipRule="evenodd" /></svg>);
const AccountIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const BackArrowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>);
const TimesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>);

// --- Shared Components (Modal, Form Inputs) ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 modal" onClick={onClose}>
            <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <TimesIcon />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Logic to be placed here
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
            {/* Sidebar for large screens */}
            <aside className="hidden lg:flex flex-col w-80 min-h-screen bg-white shadow-xl rounded-r-3xl">
                <div className="p-6 bg-blue-600 rounded-br-3xl mb-6">
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                        <AccountIcon />
                        Admin Portal
                    </div>
                </div>
                <nav className="flex-1 p-6 space-y-2">
                    <a href="#" onClick={() => setCurrentView('students')} className={`sidebar-item flex items-center gap-3 p-3 rounded-lg transition-colors ${currentView === 'students' || currentView === 'profile' ? 'sidebar-item-active' : ''}`}>
                        <PeopleIcon />
                        <span>Student Management</span>
                    </a>
                    <a href="#" onClick={() => setCurrentView('financials')} className={`sidebar-item flex items-center gap-3 p-3 rounded-lg transition-colors ${currentView === 'financials' ? 'sidebar-item-active' : ''}`}>
                        <MoneyIcon />
                        <span>Financials</span>
                    </a>
                </nav>
                <div className="p-6">
                    <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 w-full p-3 hover:bg-gray-200 rounded-lg transition-colors text-red-600 font-medium">
                        <LogoutIcon />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 flex flex-col">
                {/* Mobile Navbar with toggle button */}
                <header className="lg:hidden flex justify-between items-center p-4 bg-white shadow-md">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <span className="text-xl font-bold">Metroview Admin</span>
                    <button onClick={() => setIsAuthenticated(false)} className="p-2 rounded-lg text-red-600">
                        <LogoutIcon />
                    </button>
                </header>

                {/* Mobile sidebar (Drawer) */}
                <div className={`fixed inset-0 z-50 flex transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <aside className="w-80 bg-white shadow-xl flex flex-col">
                        <div className="flex justify-between items-center p-6 bg-blue-600 text-white">
                            <div className="text-xl font-bold flex items-center gap-2">
                                <AccountIcon />
                                Admin Portal
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2">
                                <TimesIcon />
                            </button>
                        </div>
                        <nav className="flex-1 p-6 space-y-2">
                            <a href="#" onClick={() => { setCurrentView('students'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-200 ${currentView === 'students' || currentView === 'profile' ? 'bg-gray-200' : ''}`}>
                                <PeopleIcon />
                                <span>Student Management</span>
                            </a>
                            <a href="#" onClick={() => { setCurrentView('financials'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-200 ${currentView === 'financials' ? 'bg-gray-200' : ''}`}>
                                <MoneyIcon />
                                <span>Financials</span>
                            </a>
                        </nav>
                    </aside>
                    <div className="flex-1 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
