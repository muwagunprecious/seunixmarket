'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        setStores(storesDummyData)
        setLoading(false)
    }

    const handleApprove = async ({ storeId, status }) => {
        setStores(prev => prev.map(s => s.id === storeId ? { ...s, status, isActive: status === 'approved' } : s))
        if (status === 'approved') {
            toast.success("Seller store approved successfully!")
        } else {
            toast.error("Seller store application rejected.")
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const pendingStores = stores.filter(s => s.status === 'pending')
    const ProcessedStores = stores.filter(s => s.status !== 'pending')

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="text-2xl">Approve <span className="text-slate-800 font-medium">Seller Applications</span></h1>
                    <p className="text-sm text-slate-500 mt-1">Review seller applications and verify National Identification Numbers (NIN).</p>
                </div>
            </div>

            {/* Pending Section */}
            <div className="mb-10">
                <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    Pending Applications
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">{pendingStores.length}</span>
                </h2>

                {pendingStores.length ? (
                    <div className="flex flex-col gap-4">
                        {pendingStores.map((store) => (
                            <div key={store.id} className="bg-white border border-yellow-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                                {/* Store Info */}
                                <StoreInfo store={store} />

                                {/* Actions */}
                                <div className="flex gap-3 pt-2 flex-wrap">
                                    <button onClick={() => handleApprove({ storeId: store.id, status: 'approved' })} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded text-sm transition shadow-xs cursor-pointer flex items-center gap-2" >
                                        Approve Seller
                                    </button>
                                    <button onClick={() => handleApprove({ storeId: store.id, status: 'rejected' })} className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium rounded text-sm transition cursor-pointer" >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-8 text-center max-w-4xl">
                        <p className="text-slate-500 font-medium">No pending seller applications</p>
                    </div>
                )}
            </div>

            {/* Processed Section */}
            {ProcessedStores.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-3">Reviewed Applications</h2>
                    <div className="flex flex-col gap-4">
                        {ProcessedStores.map((store) => (
                            <div key={store.id} className="bg-white border rounded-lg shadow-xs p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl opacity-90" >
                                <StoreInfo store={store} />
                                <div className="flex gap-3 pt-2 flex-wrap">
                                    {store.status === 'approved' ? (
                                        <button onClick={() => handleApprove({ storeId: store.id, status: 'rejected' })} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm transition cursor-pointer" >
                                            Revoke Approval
                                        </button>
                                    ) : (
                                        <button onClick={() => handleApprove({ storeId: store.id, status: 'approved' })} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition cursor-pointer" >
                                            Approve Seller
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    ) : <Loading />
}