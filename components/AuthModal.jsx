'use client'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, registerSeller } from '@/lib/features/auth/authSlice';
import { X, ShieldCheck, Store, User, Lock, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    // Mode: 'signin' | 'signup' | 'seller_verify'
    const [mode, setMode] = useState('signin');
    const [role, setRole] = useState('customer'); // 'customer' | 'seller'

    // Form States
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
    const [sellerData, setSellerData] = useState({
        name: '',
        email: '',
        password: '',
        storeName: '',
        storeUsername: '',
        description: '',
        nin: '',
        contact: '',
        address: ''
    });

    if (!isOpen) return null;

    const handleSignIn = (e) => {
        e.preventDefault();
        if (!signInData.email || !signInData.password) {
            toast.error("Please fill in all credentials.");
            return;
        }

        const nameFromEmail = signInData.email.split('@')[0];
        const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        dispatch(login({
            name: displayName,
            email: signInData.email,
            role: role,
            sellerStatus: role === 'seller' ? 'approved' : 'none',
            sellerNin: role === 'seller' ? '12345678901' : '',
            storeInfo: role === 'seller' ? {
                name: `${displayName}'s Store`,
                username: nameFromEmail.toLowerCase(),
                status: 'approved',
                nin: '12345678901'
            } : null
        }));

        toast.success(`Welcome back, ${displayName}! Logged in as ${role}.`);
        onClose();
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!signUpData.name || !signUpData.email || !signUpData.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        dispatch(login({
            name: signUpData.name,
            email: signUpData.email,
            role: role,
            sellerStatus: role === 'seller' ? 'approved' : 'none'
        }));

        toast.success(`Account created successfully for ${signUpData.name}!`);
        onClose();
    };

    const handleSellerRegister = (e) => {
        e.preventDefault();

        if (!sellerData.nin || sellerData.nin.length !== 11 || !/^\d+$/.test(sellerData.nin)) {
            toast.error("Please enter a valid 11-digit National Identification Number (NIN).");
            return;
        }

        if (!sellerData.storeName || !sellerData.storeUsername || !sellerData.email) {
            toast.error("Please complete all required store fields.");
            return;
        }

        dispatch(registerSeller({
            name: sellerData.name || sellerData.storeName,
            email: sellerData.email,
            storeName: sellerData.storeName,
            storeUsername: sellerData.storeUsername,
            description: sellerData.description,
            nin: sellerData.nin,
            contact: sellerData.contact,
            address: sellerData.address
        }));

        toast.success(`Seller store application submitted with NIN ${sellerData.nin}! Pending admin verification.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative text-slate-700">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer">
                    <X size={18} />
                </button>

                {/* Header Tabs */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 pt-6 text-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {mode === 'signin' && 'Sign In to Seunix Marketplace'}
                        {mode === 'signup' && 'Create Your Account'}
                        {mode === 'seller_verify' && 'Become a Verified Seller'}
                    </h2>

                    <div className="flex justify-center gap-2 mt-4 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
                        <button
                            onClick={() => setMode('signin')}
                            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => setMode('seller_verify')}
                            className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${mode === 'seller_verify' ? 'bg-green-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <ShieldCheck size={14} />
                            Seller Verification
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 max-h-[75vh] overflow-y-auto">

                    {/* SIGN IN FORM */}
                    {mode === 'signin' && (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            {/* Role Toggle */}
                            <div className="flex gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('customer')}
                                    className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${role === 'customer' ? 'border-green-500 bg-green-50 text-green-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <User size={16} /> Customer Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('seller')}
                                    className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${role === 'seller' ? 'border-green-500 bg-green-50 text-green-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Store size={16} /> Seller Login
                                </button>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={signInData.email}
                                        onChange={e => setSignInData({ ...signInData, email: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={signInData.password}
                                        onChange={e => setSignInData({ ...signInData, password: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition shadow-sm cursor-pointer mt-2">
                                Sign In as {role === 'seller' ? 'Seller' : 'Customer'}
                            </button>

                            <p className="text-xs text-center text-slate-500 pt-2">
                                Want to register as a seller with NIN?{' '}
                                <button type="button" onClick={() => setMode('seller_verify')} className="text-green-600 font-semibold hover:underline cursor-pointer">
                                    Verify Seller Account
                                </button>
                            </p>
                        </form>
                    )}

                    {/* SIGN UP FORM */}
                    {mode === 'signup' && (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="flex gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('customer')}
                                    className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${role === 'customer' ? 'border-green-500 bg-green-50 text-green-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <User size={16} /> Customer Account
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('seller')}
                                    className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${role === 'seller' ? 'border-green-500 bg-green-50 text-green-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Store size={16} /> Seller Account
                                </button>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={signUpData.name}
                                    onChange={e => setSignUpData({ ...signUpData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={signUpData.email}
                                    onChange={e => setSignUpData({ ...signUpData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={signUpData.password}
                                    onChange={e => setSignUpData({ ...signUpData, password: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-green-500"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition shadow-sm cursor-pointer mt-2">
                                Create Account
                            </button>
                        </form>
                    )}

                    {/* SELLER VERIFICATION & REGISTRATION FORM */}
                    {mode === 'seller_verify' && (
                        <form onSubmit={handleSellerRegister} className="space-y-3.5">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800 flex items-start gap-2 mb-2">
                                <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-semibold">NIN Seller Identity Verification</p>
                                    <p className="text-green-700 mt-0.5">Enter your store details and your 11-digit National Identification Number (NIN) for verification.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Store Name</label>
                                    <input
                                        type="text"
                                        placeholder="My Fashion Store"
                                        value={sellerData.storeName}
                                        onChange={e => setSellerData({ ...sellerData, storeName: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Store Username</label>
                                    <input
                                        type="text"
                                        placeholder="fashionstore"
                                        value={sellerData.storeUsername}
                                        onChange={e => setSellerData({ ...sellerData, storeUsername: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-0.5 flex items-center justify-between">
                                    <span>NIN Verification Number</span>
                                    <span className="text-[10px] text-green-600 font-bold">11 Digits Required</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={11}
                                    placeholder="12345678901"
                                    value={sellerData.nin}
                                    onChange={e => setSellerData({ ...sellerData, nin: e.target.value })}
                                    className="w-full px-3 py-2 border border-green-400 bg-green-50/30 rounded-lg text-sm font-mono tracking-widest outline-none focus:border-green-600 font-semibold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Seller Email</label>
                                <input
                                    type="email"
                                    placeholder="seller@example.com"
                                    value={sellerData.email}
                                    onChange={e => setSellerData({ ...sellerData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-green-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Contact Number</label>
                                    <input
                                        type="text"
                                        placeholder="+234 8012345678"
                                        value={sellerData.contact}
                                        onChange={e => setSellerData({ ...sellerData, contact: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Owner Name"
                                        value={sellerData.name}
                                        onChange={e => setSellerData({ ...sellerData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Store Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Describe your store products and offerings..."
                                    value={sellerData.description}
                                    onChange={e => setSellerData({ ...sellerData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-green-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Store Address</label>
                                <input
                                    type="text"
                                    placeholder="City, State, Country"
                                    value={sellerData.address}
                                    onChange={e => setSellerData({ ...sellerData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-green-500"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition shadow-sm cursor-pointer mt-3 flex items-center justify-center gap-2">
                                <ShieldCheck size={18} />
                                Submit Seller NIN Verification
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AuthModal;
