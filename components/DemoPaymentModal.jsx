'use client'

import { CreditCard, Landmark, Truck, X, CheckCircle2, ShieldCheck, Lock } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function DemoPaymentModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'
    const [method, setMethod] = useState('card') // 'card', 'transfer', 'cod'
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(false)

    // Form inputs for Card
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiry: '',
        cvc: ''
    })

    if (!isOpen) return null

    const handleFillDemoCard = () => {
        setCardDetails({
            cardNumber: '4000 •••• •••• 9010',
            cardHolder: 'Demo Buyer',
            expiry: '12/28',
            cvc: '321'
        })
        toast.success('Demo test card filled!')
    }

    const handlePayNow = (e) => {
        e.preventDefault()
        setProcessing(true)

        setTimeout(() => {
            setProcessing(false)
            setSuccess(true)
            toast.success('Payment Verified & Order Placed Successfully!')

            setTimeout(() => {
                onPaymentSuccess()
            }, 1200)
        }, 1500)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">Seunix Checkout</h2>
                            <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                                <Lock size={12} /> Secure Demo Gateway
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">Simulated Live Payment Environment</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                {success ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center gap-4">
                        <CheckCircle2 size={64} className="text-green-500 animate-bounce" />
                        <h3 className="text-2xl font-bold text-slate-800">Payment Successful!</h3>
                        <p className="text-slate-500 text-sm max-w-xs">Your payment of <span className="font-bold text-slate-800">{currency}{totalAmount.toLocaleString()}</span> has been confirmed. Redirecting to your orders...</p>
                    </div>
                ) : (
                    <div className="p-6">
                        {/* Order Amount Banner */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex justify-between items-center">
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Amount Payable</span>
                                <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{currency}{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400">Escrow Security</span>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <ShieldCheck size={14} /> Seller Protection
                                </p>
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <button
                                type="button"
                                onClick={() => setMethod('card')}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${method === 'card' ? 'border-slate-800 bg-slate-900 text-white font-medium shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <CreditCard size={20} />
                                <span className="text-xs">Card / Paystack</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMethod('transfer')}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${method === 'transfer' ? 'border-slate-800 bg-slate-900 text-white font-medium shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Landmark size={20} />
                                <span className="text-xs">Bank Transfer</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMethod('cod')}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${method === 'cod' ? 'border-slate-800 bg-slate-900 text-white font-medium shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Truck size={20} />
                                <span className="text-xs">Pay on Delivery</span>
                            </button>
                        </div>

                        {/* Method Specific Form */}
                        {method === 'card' && (
                            <form onSubmit={handlePayNow} className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500">Demo Card Payment</span>
                                    <button type="button" onClick={handleFillDemoCard} className="text-slate-800 underline font-semibold hover:text-slate-900">
                                        ⚡ Auto-Fill Test Card
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700 block mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="4000 0000 0000 9010"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-800 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-700 block mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={cardDetails.cardHolder}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-800 outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-700 block mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={cardDetails.expiry}
                                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-800 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-700 block mb-1">CVC / CVV</label>
                                        <input
                                            type="password"
                                            placeholder="123"
                                            maxLength={3}
                                            value={cardDetails.cvc}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-800 outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing Demo Payment...
                                        </>
                                    ) : (
                                        `Pay ${currency}${totalAmount.toLocaleString()} Now`
                                    )}
                                </button>
                            </form>
                        )}

                        {method === 'transfer' && (
                            <div className="space-y-4">
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 text-xs">Bank Name</span>
                                        <span className="font-semibold text-slate-800">Seunix Virtual Bank / Wema</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 text-xs">Account Number</span>
                                        <span className="font-mono font-bold text-slate-900 tracking-wider">802 391 0491</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 text-xs">Account Name</span>
                                        <span className="font-medium text-slate-700">Seunix Marketplace Checkout</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 text-center">Transfer exact amount to the account above and click verify below.</p>
                                <button
                                    type="button"
                                    onClick={handlePayNow}
                                    disabled={processing}
                                    className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Verifying Bank Transfer...
                                        </>
                                    ) : (
                                        'I Have Completed Transfer'
                                    )}
                                </button>
                            </div>
                        )}

                        {method === 'cod' && (
                            <div className="space-y-4 text-center">
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs text-left">
                                    <p className="font-bold">Cash on Delivery Info:</p>
                                    <p className="mt-1">You will pay <span className="font-bold">{currency}{totalAmount.toLocaleString()}</span> directly to the delivery rider upon inspecting your items.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePayNow}
                                    disabled={processing}
                                    className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Confirming Order...
                                        </>
                                    ) : (
                                        'Confirm Cash on Delivery Order'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
