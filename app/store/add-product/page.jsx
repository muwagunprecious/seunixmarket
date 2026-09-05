'use client'

import { assets } from "@/assets/assets"
import { addProduct } from "@/lib/features/product/productSlice"
import { ShieldAlert, ShieldCheck, Lock, ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"

export default function StoreAddProduct() {
    const categories = ['Clothing', 'Footwear', 'Fashion Accessories', 'Electronics', 'Home & Living', 'Beauty & Personal Care', 'Others']

    const router = useRouter()
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)

    // Seller Approval Check: Default to approved if authenticated as seller, or fallback check
    const isApprovedSeller = auth.isAuthenticated && (auth.role === 'seller' || auth.role === 'admin') && (auth.sellerStatus === 'approved' || auth.sellerStatus === 'none');

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "Clothing",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!productInfo.name || !productInfo.price) {
            toast.error("Please fill in all required fields.")
            return
        }

        setLoading(true)

        // Process images or use clothing defaults
        const imageList = []
        Object.keys(images).forEach(key => {
            if (images[key]) {
                imageList.push(URL.createObjectURL(images[key]))
            }
        })

        if (imageList.length === 0) {
            imageList.push(assets.clothing_tshirt_real || assets.product_img1)
        }

        const newProduct = {
            id: `prod_${Date.now()}`,
            name: productInfo.name,
            description: productInfo.description,
            mrp: Number(productInfo.mrp) || Number(productInfo.price) * 1.2,
            price: Number(productInfo.price),
            category: productInfo.category || "Clothing",
            images: imageList,
            rating: [
                { user: { name: auth.user?.name || "Verified Customer", image: assets.user_avatar }, rating: 5, review: "Newly published item!", createdAt: new Date().toISOString() }
            ],
            createdAt: new Date().toISOString()
        }

        setTimeout(() => {
            dispatch(addProduct(newProduct))
            setLoading(false)
            toast.success("Product published successfully to Seunix Marketplace!")
            router.push('/store/manage-product')
        }, 800)
    }

    // Unverified / Pending Seller Alert Banner
    if (auth.isAuthenticated && auth.sellerStatus === 'pending') {
        return (
            <div className="max-w-3xl my-12 mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-8 text-amber-900 shadow-sm">
                <div className="flex items-start gap-4">
                    <ShieldAlert size={36} className="text-amber-600 shrink-0 mt-1" />
                    <div>
                        <span className="bg-amber-200 text-amber-900 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Verification Pending</span>
                        <h2 className="text-2xl font-bold mt-2 text-slate-900">National Identification (NIN) Under Review</h2>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                            Your seller application with NIN (<span className="font-mono font-semibold">{auth.sellerNin || 'NIN Pending'}</span>) has been submitted and is awaiting approval by the Admin.
                        </p>
                        <div className="bg-white/80 border border-amber-200 rounded-xl p-4 mt-4 text-xs space-y-1 text-slate-700">
                            <p className="font-semibold text-slate-900">Why is verification required?</p>
                            <p>To keep Seunix Marketplace secure for buyers and prevent fraud, all sellers must be verified by admin approval before uploading products.</p>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <button onClick={() => router.push('/admin/approve')} className="bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-2">
                                Check Admin Approvals <ArrowRight size={14} />
                            </button>
                            <button onClick={() => router.push('/store')} className="text-xs text-slate-700 font-medium underline">
                                Back to Seller Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmitHandler} className="text-slate-600 mb-28 max-w-4xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New <span className="text-slate-600 font-normal">Product</span></h1>
                    <p className="text-xs text-slate-500 mt-1">Publish a new clothing item or product to the marketplace</p>
                </div>
                <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck size={16} /> Verified Seller
                </div>
            </div>

            <p className="text-sm font-medium text-slate-700 mb-2">Product Images</p>
            <p className="text-xs text-slate-400 mb-3">Upload up to 4 images of your product.</p>

            <div className="flex gap-3 mt-2">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`} className="relative group">
                        <Image
                            width={300}
                            height={300}
                            className='h-20 w-20 object-cover border border-slate-300 rounded-lg cursor-pointer group-hover:border-slate-800 transition bg-slate-50'
                            src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area}
                            alt=""
                        />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                    Product Name *
                    <input
                        type="text"
                        name="name"
                        onChange={onChangeHandler}
                        value={productInfo.name}
                        placeholder="e.g. Premium Cotton Hoodie"
                        className="w-full p-2.5 text-sm outline-none border border-slate-300 rounded-lg focus:border-slate-800"
                        required
                    />
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                    Category *
                    <select
                        onChange={e => setProductInfo({ ...productInfo, category: e.target.value })}
                        value={productInfo.category}
                        className="w-full p-2.5 text-sm outline-none border border-slate-300 rounded-lg focus:border-slate-800 bg-white"
                        required
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="flex flex-col gap-1 text-xs font-medium text-slate-700 my-6">
                Description
                <textarea
                    name="description"
                    onChange={onChangeHandler}
                    value={productInfo.description}
                    placeholder="Enter detailed description of material, sizing, and features..."
                    rows={4}
                    className="w-full p-2.5 text-sm outline-none border border-slate-300 rounded-lg focus:border-slate-800 resize-none"
                    required
                />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 max-w-md">
                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                    Original Price (₦)
                    <input
                        type="number"
                        name="mrp"
                        onChange={onChangeHandler}
                        value={productInfo.mrp}
                        placeholder="e.g. 25000"
                        className="w-full p-2.5 text-sm outline-none border border-slate-300 rounded-lg focus:border-slate-800"
                        required
                    />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                    Offer Sale Price (₦) *
                    <input
                        type="number"
                        name="price"
                        onChange={onChangeHandler}
                        value={productInfo.price}
                        placeholder="e.g. 18500"
                        className="w-full p-2.5 text-sm outline-none border border-slate-300 rounded-lg focus:border-slate-800"
                        required
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition shadow-sm flex items-center gap-2 mt-8"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing Product...
                    </>
                ) : (
                    'Publish Product to Store'
                )}
            </button>
        </form>
    )
}