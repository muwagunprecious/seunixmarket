'use client'

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useSelector } from "react-redux"

export default function StoreManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'
    const productList = useSelector(state => state.product.list)

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    useEffect(() => {
        setProducts(productList)
        setLoading(false)
    }, [productList])

    const toggleStock = (productId) => {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p))
        toast.success("Product stock status updated!")
    }

    if (loading) return <Loading />

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl text-slate-500">Manage <span className="text-slate-800 font-medium">Products</span></h1>
                    <p className="text-xs text-slate-500 mt-1">Showing {products.length} active products in your catalog</p>
                </div>
            </div>
            {products.length > 0 ? (
                <div className="overflow-x-auto ring ring-slate-200 rounded-xl">
                    <table className="w-full max-w-4xl text-left rounded overflow-hidden text-sm">
                        <thead className="bg-slate-900 text-white uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-4 py-3.5">Product</th>
                                <th className="px-4 py-3.5 hidden md:table-cell">Category</th>
                                <th className="px-4 py-3.5 hidden md:table-cell">MRP</th>
                                <th className="px-4 py-3.5">Price</th>
                                <th className="px-4 py-3.5 text-center">In Stock</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 divide-y divide-slate-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3 items-center">
                                            <Image width={44} height={44} className='h-11 w-11 object-cover shadow-xs rounded-lg border border-slate-200' src={product.images[0]} alt="" />
                                            <div>
                                                <p className="font-medium text-slate-800">{product.name}</p>
                                                <p className="text-xs text-slate-400 md:hidden">{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell font-medium text-xs text-slate-500">{product.category || 'Clothing'}</td>
                                    <td className="px-4 py-3 hidden md:table-cell text-slate-400 line-through">{currency}{product.mrp?.toLocaleString()}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800">{currency}{product.price?.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input type="checkbox" className="sr-only peer" onChange={() => toggleStock(product.id)} checked={product.inStock !== false} />
                                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-lg">No products found in store.</p>
                </div>
            )}
        </>
    )
}