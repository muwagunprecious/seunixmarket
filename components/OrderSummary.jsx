import { PlusIcon, SquarePenIcon, XIcon, CreditCard, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react'
import AddressModal from './AddressModal';
import DemoPaymentModal from './DemoPaymentModal';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/lib/features/cart/cartSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦';

    const router = useRouter();
    const dispatch = useDispatch();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const finalPrice = coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)) : totalPrice;

    const handleCouponCode = async (event) => {
        event.preventDefault();
        if (couponCodeInput.trim().toUpperCase() === 'SEUNIX10') {
            setCoupon({ code: 'SEUNIX10', discount: 10, description: '10% Launch Discount' });
            toast.success('10% Coupon Applied!');
        } else {
            toast.error('Invalid Coupon Code. Try "SEUNIX10"');
        }
    }

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setShowPaymentModal(true);
    }

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        dispatch(clearCart());
        router.push('/orders');
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/50 border border-slate-200 text-slate-500 text-sm rounded-xl p-7 shadow-xs'>
            <h2 className='text-xl font-semibold text-slate-700'>Payment Summary</h2>
            
            <p className='text-slate-400 text-xs my-3 uppercase tracking-wider font-semibold'>Payment Option</p>
            <div className='space-y-2'>
                <label htmlFor="CARD" className='flex items-center gap-2 cursor-pointer p-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition'>
                    <input type="radio" id="CARD" name="payment" onChange={() => setPaymentMethod('CARD')} checked={paymentMethod === 'CARD'} className='accent-slate-800' />
                    <CreditCard size={16} className='text-slate-600' />
                    <span className='text-xs font-medium text-slate-700'>Card / Bank Transfer (Demo Gateway)</span>
                </label>

                <label htmlFor="COD" className='flex items-center gap-2 cursor-pointer p-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition'>
                    <input type="radio" id="COD" name="payment" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-slate-800' />
                    <ShieldCheck size={16} className='text-slate-600' />
                    <span className='text-xs font-medium text-slate-700'>Pay on Delivery (COD)</span>
                </label>
            </div>

            <div className='my-4 py-4 border-y border-slate-200 text-slate-500'>
                <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2'>Delivery Address</p>
                {
                    selectedAddress ? (
                        <div className='flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700'>
                            <p className='font-medium'>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer text-slate-500 hover:text-slate-800' size={16} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-300 bg-white p-2 w-full mb-2 text-xs outline-none rounded-lg' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Select Delivery Address</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 mt-1' onClick={() => setShowAddressModal(true)}>
                                <PlusIcon size={16} /> Add Delivery Address
                            </button>
                        </div>
                    )
                }
            </div>

            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between text-xs'>
                    <div className='flex flex-col gap-1.5 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon Discount:</p>}
                    </div>
                    <div className='flex flex-col gap-1.5 font-medium text-right text-slate-700'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p className='text-green-600 font-semibold'>Free</p>
                        {coupon && <p className='text-green-600'>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={handleCouponCode} className='flex justify-center gap-2 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Try SEUNIX10' className='border border-slate-300 bg-white p-2 rounded-lg w-full text-xs outline-none focus:border-slate-800' />
                            <button className='bg-slate-800 text-white px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-900 active:scale-95 transition-all'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-between bg-green-50 border border-green-200 p-2 rounded-lg text-xs mt-3 text-green-800'>
                            <p><span className='font-bold'>{coupon.code}</span> - {coupon.description}</p>
                            <XIcon size={16} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>

            <div className='flex justify-between py-4 text-base font-semibold text-slate-800'>
                <p>Total Payable:</p>
                <p>{currency}{finalPrice.toLocaleString()}</p>
            </div>

            <button onClick={handlePlaceOrder} className='w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2'>
                Proceed to Checkout ({currency}{finalPrice.toLocaleString()})
            </button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

            <DemoPaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                totalAmount={finalPrice}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    )
}

export default OrderSummary