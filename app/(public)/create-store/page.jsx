'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

import { registerSeller } from "@/lib/features/auth/authSlice"
import { useDispatch } from "react-redux"

export default function CreateStore() {

    const dispatch = useDispatch()
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        nin: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (!storeInfo.nin || storeInfo.nin.length !== 11 || !/^\d+$/.test(storeInfo.nin)) {
            toast.error("Please enter a valid 11-digit National Identification Number (NIN).")
            return
        }

        dispatch(registerSeller({
            name: storeInfo.name,
            email: storeInfo.email,
            storeName: storeInfo.name,
            storeUsername: storeInfo.username,
            description: storeInfo.description,
            nin: storeInfo.nin,
            contact: storeInfo.contact,
            address: storeInfo.address
        }))

        setStatus("pending")
        setMessage(`Your store "${storeInfo.name}" with NIN Verification (${storeInfo.nin}) has been submitted successfully! Admin will review your verification details.`)
        setAlreadySubmitted(true)
        toast.success("Application submitted successfully!")
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={e => onSubmitHandler(e)} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
                            <p className="max-w-lg">To become a seller on Seunix Marketplace, submit your store details along with your NIN verification number for review. Your store will be activated after admin verification.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Store Logo
                            <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>

                        <p>Username</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Enter your store username" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <p>Name</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Enter your store name" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <p>Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Enter your store description" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" required />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Enter your store email" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <p>Contact Number</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Enter your store contact number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <div>
                            <p className="font-medium text-slate-700">NIN Verification Number (National Identification Number)</p>
                            <p className="text-xs text-slate-400 mb-1">Enter your 11-digit National Identification Number for verification</p>
                            <input name="nin" onChange={onChangeHandler} value={storeInfo.nin} type="text" maxLength={11} placeholder="e.g. 12345678901" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded tracking-widest font-mono" required />
                        </div>

                        <p>Address</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Enter your store address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" required />

                        <button type="submit" className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition cursor-pointer">Submit Application</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">redirecting to dashboard in <span className="font-semibold">5 seconds</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}