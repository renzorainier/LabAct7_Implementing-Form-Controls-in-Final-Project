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

const ValidationError = ({ message }) => {
    if (!message) return null;
    return <p className="validation-error">{message}</p>;
};

const ToggleSwitch = ({ label, name, checked, onChange }) => {
    return (
        <div className="flex items-center justify-between">
            <label htmlFor={name} className="form-label mb-0">{label}</label>
            <label className="switch">
                <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} />
                <span className="slider"></span>
            </label>
        </div>
    )
};

// --- Form Validation Functions ---
const validateStudentForm = (data, students = []) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idRegex = /^S-\d{3}$/;
    const phoneRegex = /^(09|\+639)\d{9}$/;
    const today = new Date().toISOString().split('T')[0];

    if (!data.name || data.name.length < 3) errors.name = "Full name is required (min 3 chars).";

    if (!data.id) errors.id = "Student ID is required.";
    else if (!idRegex.test(data.id)) errors.id = "Student ID must be in the format S-000.";
    else if (students.some(s => s.id === data.id)) errors.id = "Student ID already exists.";

    if (!data.email) errors.email = "Email is required.";
    else if (!emailRegex.test(data.email)) errors.email = "Please enter a valid email address.";

    if (!data.dob) errors.dob = "Date of Birth is required.";
    else if (data.dob > today) errors.dob = "Date of Birth cannot be in the future.";

    if (data.phone && !phoneRegex.test(data.phone)) errors.phone = "Must be a valid 11-digit (09...) or 12-digit (+639...) number.";

    if (!data.grade) errors.grade = "Please select a grade level.";
    if (!data.status) errors.status = "Please select a status.";
    if (data.hasScholarship && !data.scholarshipDetails) errors.scholarshipDetails = "Please provide scholarship details.";

    return errors;
};

const validatePaymentForm = (data, students = []) => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!data.studentId) errors.studentId = "Please select a student.";

    if (!data.amount || data.amount <= 0) errors.amount = "Amount must be greater than 0.";
    else if (data.studentId) {
        const student = students.find(s => s.id === data.studentId);
        if (student && data.amount > student.balance) {
            errors.amount = `Amount cannot be more than the student's balance of ₱${student.balance.toLocaleString()}.`;
        }
    }

    if (!data.date) errors.date = "Payment date is required.";
    else if (data.date > today) errors.date = "Payment date cannot be in the future.";

    if (data.type !== 'Cash' && !data.refNo) errors.refNo = "Reference No. is required for non-Cash payments.";
    if (data.for.length === 0) errors.for = "Please select at least one payment item.";
    if (data.for.includes('Other') && !data.notes) errors.notes = "Please specify details for 'Other' payment.";

    return errors;
};

// --- MAJOR FORM 1: Add Student Form ---
const AddStudentForm = ({ onAddStudent, onClose, students }) => {
    const emptyStudent = {
        id: '', name: '', grade: '', status: 'Pending', balance: 0, email: '', phone: '', guardian: '', dob: '', address: '', hasScholarship: false, scholarshipDetails: ''
    };
    const [formData, setFormData] = useState(emptyStudent);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateStudentForm(formData, students); // Pass students list
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log("Form is valid. Submitting new student:", formData);
            onAddStudent(formData); // This updates the main App state
            onClose();
        } else {
            console.log("Form has errors:", validationErrors);
        }
    };

    const handleReset = () => {
        setFormData(emptyStudent);
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Student ID */}
                <div>
                    <label htmlFor="id" className="form-label">Student ID</label>
                    <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} className="form-input" placeholder="e.g., S-004" required />
                    <ValidationError message={errors.id} />
                </div>
                {/* 2. Full Name */}
                <div>
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g., Jane Smith" required />
                    <ValidationError message={errors.name} />
                </div>
                {/* 3. Email */}
                <div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="e.g., jane.s@example.com" required />
                    <ValidationError message={errors.email} />
                </div>
                {/* 4. Date of Birth */}
                <div>
                    <label htmlFor="dob" className="form-label">Date of Birth</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="form-input" required />
                    <ValidationError message={errors.dob} />
                </div>
                {/* 5. Grade Level (Dropdown) */}
                <div>
                    <label htmlFor="grade" className="form-label">Grade Level</label>
                    <select id="grade" name="grade" value={formData.grade} onChange={handleChange} className="form-input" required>
                        <option value="">-- Select Grade --</option>
                        {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ValidationError message={errors.grade} />
                </div>
                {/* 6. Phone */}
                <div>
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="e.g., 09187654321" />
                    <ValidationError message={errors.phone} />
                </div>
                {/* 7. Guardian Name */}
                <div>
                    <label htmlFor="guardian" className="form-label">Guardian Name</label>
                    <input type="text" id="guardian" name="guardian" value={formData.guardian} onChange={handleChange} className="form-input" placeholder="e.g., Robert Smith" />
                </div>
                {/* 8. Address (Textarea) */}
                <div className="md:col-span-2">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} className="form-input" rows="2" placeholder="123 Main St, Quezon City..."></textarea>
                </div>
                {/* 9. Status (Radio) */}
                <div className="md:col-span-2">
                    <label className="form-label">Student Status</label>
                    <div className="flex gap-4 mt-2">
                        {STUDENT_STATUSES.map(s => (
                            <div key={s} className="flex items-center">
                                <input type="radio" id={`status-${s}`} name="status" value={s} checked={formData.status === s} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                                <label htmlFor={`status-${s}`} className="ml-2 block text-sm text-gray-700">{s}</label>
                            </div>
                        ))}
                    </div>
                    <ValidationError message={errors.status} />
                </div>
                {/* 10. Scholarship (Checkbox) */}
                <div className="md:col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="hasScholarship" name="hasScholarship" checked={formData.hasScholarship} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded" />
                    <label htmlFor="hasScholarship" className="form-label mb-0">Has Scholarship?</label>
                </div>
                {/* 11. Scholarship Details (Conditional Textarea) */}
                {formData.hasScholarship && (
                    <div className="md:col-span-2">
                        <label htmlFor="scholarshipDetails" className="form-label">Scholarship Details</label>
                        <textarea id="scholarshipDetails" name="scholarshipDetails" value={formData.scholarshipDetails} onChange={handleChange} className="form-input" rows="2" placeholder="e.g., Academic Full, 50% Grant..."></textarea>
                        <ValidationError message={errors.scholarshipDetails} />
                    </div>
                )}
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleReset} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                    Reset
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">
                    Add Student
                </button>
            </div>
        </form>
    );
};

// --- MAJOR FORM 2: Record Payment Form ---
const RecordPaymentForm = ({ students, onAddPayment, onClose }) => {
    const emptyPayment = {
        studentId: '', date: '', amount: '', type: 'Cash', refNo: '', for: ['Tuition'], notes: '', receiptSent: true
    };
    const [formData, setFormData] = useState(emptyPayment);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
           const newFor = [...prev.for];
           if (checked) {
               newFor.push(value);
           } else {
               const index = newFor.indexOf(value);
               if (index > -1) newFor.splice(index, 1);
           }
           return { ...prev, for: newFor };
        });
    };

    const handleToggle = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validatePaymentForm(formData, students); // Pass students
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const student = students.find(s => s.id === formData.studentId);
            const newPayment = {
                ...formData,
                id: `P-${String(Math.floor(Math.random() * 900) + 100)}`, // Random ID
                studentName: student ? student.name : 'Unknown',
                amount: parseFloat(formData.amount)
            };
            console.log("Form is valid. Submitting new payment:", newPayment);
            onAddPayment(newPayment); // This updates the main App state
            onClose();
        } else {
            console.log("Form has errors:", validationErrors);
        }
    };

    const handleReset = () => {
        setFormData(emptyPayment);
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Student (Dropdown) */}
                <div className="md:col-span-2">
                    <label htmlFor="studentId" className="form-label">Student</label>
                    <select id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} className="form-input" required>
                        <option value="">-- Select Student --</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id}) - Bal: ₱{s.balance}</option>)}
                    </select>
                    <ValidationError message={errors.studentId} />
                </div>
                {/* 2. Amount */}
                <div>
                    <label htmlFor="amount" className="form-label">Amount (PHP)</label>
                    <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="form-input" placeholder="e.g., 5000" min="0" step="0.01" required />
                    <ValidationError message={errors.amount} />
                </div>
                {/* 3. Payment Date */}
                <div>
                    <label htmlFor="date" className="form-label">Payment Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="form-input" required />
                    <ValidationError message={errors.date} />
                </div>
                {/* 4. Payment Type (Radio) */}
                <div className="md:col-span-2">
                    <label className="form-label">Payment Type</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {PAYMENT_TYPES.map(p => (
                            <div key={p} className="flex items-center">
                                <input type="radio" id={`type-${p}`} name="type" value={p} checked={formData.type === p} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                                <label htmlFor={`type-${p}`} className="ml-2 block text-sm text-gray-700">{p}</label>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 5. Reference No (Conditional) */}
                {formData.type !== 'Cash' && (
                    <div className="md:col-span-2">
                        <label htmlFor="refNo" className="form-label">Reference No.</label>
                        <input type="text" id="refNo" name="refNo" value={formData.refNo} onChange={handleChange} className="form-input" placeholder="e.g., CHK-12345 or Transaction ID" />
                        <ValidationError message={errors.refNo} />
                    </div>
                )}
                {/* 6. Payment For (Checkboxes) */}
                <div className="md:col-span-2">
                    <label className="form-label">Payment For</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {PAYMENT_FOR_OPTIONS.map(p => (
                            <div key={p} className="flex items-center">
                                <input type="checkbox" id={`for-${p}`} name="for" value={p} checked={formData.for.includes(p)} onChange={handleCheckboxChange} className="w-4 h-4 text-blue-600 rounded" />
                                <label htmlFor={`for-${p}`} className="ml-2 block text-sm text-gray-700">{p}</label>
                            </div>
                        ))}
                    </div>
                    <ValidationError message={errors.for} />
                </div>
                {/* 7. Notes (Textarea) */}
                <div className="md:col-span-2">
                    <label htmlFor="notes" className="form-label">Notes / Details</label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="form-input" rows="2" placeholder="e.g., For 'Other': Janitorial Fee"></textarea>
                    <ValidationError message={errors.notes} />
                </div>
                {/* 8. Send Receipt (Toggle) */}
                <div className="md:col-span-2">
                    <ToggleSwitch
                        label="Send Email Receipt to Guardian"
                        name="receiptSent"
                        checked={formData.receiptSent}
                        onChange={handleToggle}
                    />
                </div>
                {/* 9. Hidden Field (Not shown, but counts) */}
                <input type="hidden" name="form_source" value="financials_modal" />
            </div>
            {/* 10. Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleReset} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                    Reset
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold">
                    Record Payment
                </button>
            </div>
        </form>
    );
};

// --- Views and Components ---
const StudentManagementView = ({ students, setStudents, setCurrentView, setSelectedStudent, onAddStudent }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Student Management</h2>
                <button onClick={() => setIsAddStudentModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <PlusIcon />
                    Add New Student
                </button>
            </div>

            {/* --- SUPPORTING FORM 2: Search Bar --- */}
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search" className="form-label sr-only">Search Students</label>
                <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder="Search students by name or ID... (e.g., Jane or S-002)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                />
                {/* This form meets the "functionality" requirement by filtering the list below in real-time */}
            </form>

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Grade</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Balance Due</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer" onClick={() => {
                                setSelectedStudent(student);
                                setCurrentView('profile');
                            }}>
                                <td className="py-3 px-6 whitespace-nowrap font-medium text-gray-700">{student.id}</td>
                                <td className="py-3 px-6 font-bold text-gray-800">{student.name}</td>
                                <td className="py-3 px-6">{student.grade}</td>
                                <td className="py-3 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        student.status === 'Enrolled' ? 'bg-green-200 text-green-600'
                                        : (student.status === 'Pending' ? 'bg-yellow-200 text-yellow-600' : 'bg-red-200 text-red-600')
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-red-500 font-semibold">₱{student.balance.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} title="Add New Student (Major Form 1)">
                {/* --- MAJOR FORM 1 --- */}
                <AddStudentForm
                    onAddStudent={onAddStudent}
                    onClose={() => setIsAddStudentModalOpen(false)}
                    students={students}
                />
            </Modal>
        </div>
    );
};

const FinancialsView = ({ students, payments, onAddPayment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Financial Management</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                    <PlusIcon />
                    Record New Payment
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">Student Name</th>
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Amount Paid</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-left">Ref No.</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {payments.map(payment => (
                            <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="py-3 px-6 whitespace-nowrap font-medium text-gray-700">{payment.studentName}</td>
                                <td className="py-3 px-6">{payment.date}</td>
                                <td className="py-3 px-6 text-green-600 font-semibold">₱{payment.amount.toLocaleString()}</td>
                                <td className="py-3 px-6">{payment.type}</td>
                                <td className="py-3 px-6">{payment.refNo || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Payment (Major Form 2)">
                {/* --- MAJOR FORM 2 --- */}
                <RecordPaymentForm
                    students={students}
                    onAddPayment={onAddPayment}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

const StudentProfileView = ({ student, setCurrentView }) => {
    if (!student) return <div className="p-8 text-center text-gray-500">Student not found.</div>;

    const studentPayments = initialPayments.filter(p => p.studentId === student.id);

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Student Profile</h2>
                <button onClick={() => setCurrentView('students')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 transition font-medium">
                    <BackArrowIcon />
                    Back to List
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                        <EditIcon /> Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-gray-700">
                    <div><p className="font-semibold text-gray-500 text-sm">Student ID</p><p className="font-medium text-lg">{student.id}</p></div>
                    <div><p className="font-semibold text-gray-500 text-sm">Grade Level</p><p className="font-medium text-lg">{student.grade}</p></div>
                    <div><p className="font-semibold text-gray-500 text-sm">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.status === 'Enrolled' ? 'bg-green-200 text-green-600'
                            : (student.status === 'Pending' ? 'bg-yellow-200 text-yellow-600' : 'bg-red-200 text-red-600')
                        }`}>
                            {student.status}
                        </span>
                    </div>
                    <div><p className="font-semibold text-gray-500 text-sm">Outstanding Balance</p><p className="font-medium text-lg text-red-500">₱{student.balance.toLocaleString()}</p></div>
                    <div><p className="font-semibold text-gray-500 text-sm">Email</p><p className="font-medium text-lg">{student.email}</p></div>
                    <div><p className="font-semibold text-gray-500 text-sm">Phone</p><p className="font-medium text-lg">{student.phone}</p></div>
                    <div><p className="font-semibold text-gray-500 text-sm">Guardian</p><p className="font-medium text-lg">{student.guardian}</p></div>
                    <div><p className="font-semibold text-gray-500 text-sm">Date of Birth</p><p className="font-medium text-lg">{student.dob}</p></div>
                    <div className="lg:col-span-2"><p className="font-semibold text-gray-500 text-sm">Address</p><p className="font-medium text-lg">{student.address}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Payment History</h3>
                {studentPayments.length > 0 ? (
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <tr>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Amount</th>
                                <th className="py-3 px-6 text-left">Type</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {studentPayments.map(payment => (
                                <tr key={payment.id} className="border-b border-gray-200">
                                    <td className="py-3 px-6">{payment.date}</td>
                                    <td className="py-3 px-6 text-green-600 font-semibold">₱{payment.amount.toLocaleString()}</td>
                                    <td className="py-3 px-6">{payment.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-sm">No payment history found for this student.</p>
                )}
            </div>
        </div>
    );
};

// --- SUPPORTING FORM 1: Login Form ---
const LoginView = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // --- NEW VALIDATION: Input Length ---
        if (!username || !password) {
            setError('Username and Password are required.');
            return;
        }

        // --- NEW VALIDATION: Input Length ---
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        // Authentication Logic
        if (username === 'admin' && password === 'password') {
            onLogin(true);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Metroview Baptist Academy</h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Enrollment & Student Information System
                </p>

                {/* The <form> tag starts here */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
                    {/* 1. Username (Textbox) */}
                    <div>
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    {/* 2. Password (Password) */}
                    <div>
                        <label htmlFor="password"className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    {/* Error message shown on validation fail */}
                    <ValidationError message={error} />

                    {/* 3. Submit Button */}
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md mt-2">Login</button>
                </form>
                {/* The <form> tag ends here */}

                <p className="text-center text-xs mt-6 text-gray-400">
                    Use username: <span className="font-semibold text-gray-500">`admin`</span> and password: <span className="font-semibold text-gray-500">`password`</span> to login.
                </p>
            </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    // Set initial view to 'students' instead of 'dashboard'
    const [currentView, setCurrentView] = useState('students');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Lifted State ---
    const [students, setStudents] = useState(initialStudents);
    const [payments, setPayments] = useState(initialPayments);
    // --- ---

    const handleAddStudent = (newStudent) => {
        setStudents(prev => [...prev, { ...newStudent, balance: 7500 } ]); // Add default balance
    };

    const handleAddPayment = (newPayment) => {
        setPayments(prev => [newPayment, ...prev]);
        // Update student balance
        setStudents(prevStudents =>
            prevStudents.map(s =>
                s.id === newPayment.studentId
                ? { ...s, balance: s.balance - newPayment.amount }
                : s
            )
        );
    };

    const renderView = () => {
        switch (currentView) {
            case 'students':
                return <StudentManagementView
                            students={students}
                            setStudents={setStudents}
                            setCurrentView={setCurrentView}
                            setSelectedStudent={setSelectedStudent}
                            onAddStudent={handleAddStudent}
                        />;
            case 'financials':
                return <FinancialsView
                            students={students}
                            payments={payments}
                            onAddPayment={handleAddPayment}
                        />;
            case 'profile':
                return <StudentProfileView
                            student={selectedStudent}
                            setCurrentView={setCurrentView}
                        />;
            default:
                // Default to 'students' page
                return <StudentManagementView
                            students={students}
                            setStudents={setStudents}
                            setCurrentView={setCurrentView}
                            setSelectedStudent={setSelectedStudent}
                            onAddStudent={handleAddStudent}
                        />;
        }
    };

    if (!isAuthenticated) {
        // This renders Supporting Form 1
        return <LoginView onLogin={setIsAuthenticated} />;
    }

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
