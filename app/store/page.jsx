'use client'
import { dummyStoreDashboardData, dummyStoreData } from "@/assets/assets"
import Loading from "@/components/Loading"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon, ShieldCheck, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Dashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(dummyStoreData)
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Ratings', value: dashboardData.ratings.length, icon: StarIcon },
    ]

    const fetchDashboardData = async () => {
        setDashboardData(dummyStoreDashboardData)
        setStoreInfo(dummyStoreData)
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className=" text-slate-500 mb-28">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="text-2xl">Seller <span className="text-slate-800 font-medium">Dashboard</span></h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your store products, orders, and identity verification status.</p>
                </div>
            </div>

            {/* Seller Verification Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-6 mb-8 shadow-md flex max-md:flex-col items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Image src={storeInfo.logo} alt={storeInfo.name} width={64} height={64} className="w-16 h-16 rounded-full bg-white p-1 object-contain shrink-0" />
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold">{storeInfo.name}</h2>
                            <span className="text-xs bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-full font-mono">@{storeInfo.username}</span>
                            <span className={`text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1 ${storeInfo.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'}`}>
                                <BadgeCheck size={14} />
                                {storeInfo.status === 'approved' ? 'Identity Verified & Approved' : 'Verification Pending'}
                            </span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1 max-w-xl">{storeInfo.description}</p>
                    </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 flex flex-col gap-1 text-xs shrink-0 w-full md:w-auto">
                    <p className="text-slate-400 font-medium flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-green-400" />
                        National Identification Number (NIN):
                    </p>
                    <span className="font-mono text-sm tracking-widest text-green-300 font-bold bg-slate-900/90 px-3 py-1 rounded border border-slate-700">
                        {storeInfo.nin || '12345678901'}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            <h2>Total Reviews</h2>

            <div className="mt-5">
                {
                    dashboardData.ratings.map((review, index) => (
                        <div key={index} className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl">
                            <div>
                                <div className="flex gap-3">
                                    <Image src={review.user.image} alt="" className="w-10 aspect-square rounded-full" width={100} height={100} />
                                    <div>
                                        <p className="font-medium">{review.user.name}</p>
                                        <p className="font-light text-slate-500">{new Date(review.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-slate-500 max-w-xs leading-6">{review.review}</p>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-slate-400">{review.product?.category}</p>
                                    <p className="font-medium">{review.product?.name}</p>
                                    <div className='flex items-center'>
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon key={index} size={17} className='text-transparent mt-0.5' fill={review.rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => router.push(`/product/${review.product.id}`)} className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all">View Product</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}