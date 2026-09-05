'use client'
import { Search, ShoppingCart, User, Store, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthModal from "./AuthModal";
import { logout } from "@/lib/features/auth/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('')
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)
    const { user, isAuthenticated, role, sellerStatus } = useSelector(state => state.auth || {})

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully.");
    }

    return (
        <>
            <nav className="relative bg-white z-40">
                <div className="mx-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                        <Link href="/" className="relative text-3xl font-semibold text-slate-700">
                            <span className="text-green-600">seunix</span> marketplace<span className="text-green-600 text-5xl leading-0">.</span>
                            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                                plus
                            </p>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden sm:flex items-center gap-4 lg:gap-6 text-slate-600">
                            <Link href="/" className="hover:text-green-600 transition">Home</Link>
                            <Link href="/shop" className="hover:text-green-600 transition">Shop</Link>

                            {isAuthenticated && (role === 'seller' || role === 'admin') && (
                                <Link href="/store" className="hover:text-green-600 transition flex items-center gap-1 font-medium text-slate-800">
                                    <Store size={16} className="text-green-600" />
                                    Store Dashboard
                                </Link>
                            )}

                            {isAuthenticated && role === 'admin' && (
                                <Link href="/admin" className="hover:text-green-600 transition flex items-center gap-1 font-medium text-slate-800">
                                    <Shield size={16} className="text-green-600" />
                                    Admin Panel
                                </Link>
                            )}

                            <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                                <Search size={18} className="text-slate-600" />
                                <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                            </form>

                            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
                                <ShoppingCart size={18} />
                                Cart
                                <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                            </Link>

                            {!isAuthenticated ? (
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition text-white rounded-full font-medium cursor-pointer shadow-xs"
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 pl-3 pr-2 py-1.5 rounded-full">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                                            {user?.name ? user.name.charAt(0) : 'U'}
                                        </div>
                                        <div className="flex flex-col text-xs leading-tight">
                                            <span className="font-semibold text-slate-800">{user?.name}</span>
                                            <span className="text-[10px] text-slate-400 capitalize">{role} {sellerStatus === 'pending' ? '(Pending NIN)' : ''}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        title="Logout"
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* Mobile User Button */}
                        <div className="sm:hidden flex items-center gap-3">
                            {!isAuthenticated ? (
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="px-6 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full font-medium cursor-pointer"
                                >
                                    Login
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-600 hover:text-red-600 transition cursor-pointer"
                                >
                                    <LogOut size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <hr className="border-gray-300" />
            </nav>

            {/* Interactive Authentication Modal */}
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    )
}

export default Navbar