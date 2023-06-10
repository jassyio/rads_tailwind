import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
// import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PUSH_SUCCESS':
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      };
    case 'PAY_SUCCESS':
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      };
    case 'PAY_FAIL':
      return {
        ...state,
        loadingPay: false,
        successPay: true,
        errorPay: action.payload,
      };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };

    default:
      state;
  }
}
function OrderScreen() {
  const { data: session } = useSession();
  // order/:id
  // const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { query } = useRouter();
  const orderId = query.id;

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (
      !order._id ||
      // successPush ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      // if (successPush) {
      //     dispatch({ type: 'PUSH_SUCCESS' });
      //   }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      // const loadPaypalScript = async () => {
      //   const { data: clientId } = await axios.get('/api/keys/paypal');
      //   paypalDispatch({
      //     type: 'resetOptions',
      //     value: {
      //       'client-id': clientId,
      //       currency: 'USD',
      //     },
      //   });
      //   paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      // };
      // loadPaypalScript();
    }
  }, [
    order,
    orderId,
    // successPush,
    successDeliver,
    successPay,
  ]);
  const {
    // pendingConfirmation = true,
    paymentResult,
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  console.log(order);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ phonenumber }) => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(`/api/orders/${order._id}/mpesaPush`, {
        phonenumber,
        totalPrice,
        orderId,
      });
      if (data.result.ResultCode == 0) {
        console.log(data.result);
        // paymentResult = { status: 'pending_confirmation' };
        dispatch({ type: 'PUSH_SUCCESS' });
        alert('confirm transaction on your phone: ' + phonenumber);
      }
    } catch (err) {
      // paymentResult = { status: 'failed' };
      dispatch({ type: 'PAY_FAIL' });
      alert('Payment failed, check phone number and try again');
    }
  };

  const handleConfirm = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/orders/${orderId}`);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  // function createOrder(data, actions) {
  //   return actions.order
  //     .create({
  //       purchase_units: [
  //         {
  //           amount: { value: totalPrice },
  //         },
  //       ],
  //     })
  //     .then((orderID) => {
  //       return orderID;
  //     });
  // }

  // function onApprove(data, actions) {
  //   return actions.order.capture().then(async function (details) {
  //     try {
  //       dispatch({ type: 'PAY_REQUEST' });
  //       const { data } = await axios.put(
  //         `/api/orders/${order._id}/pay`,
  //         details
  //       );
  //       dispatch({ type: 'PAY_SUCCESS', payload: data });
  //       toast.success('Order is paid successfully');
  //     } catch (err) {
  //       dispatch({ type: 'PAY_FAIL', payload: getError(err) });
  //       toast.error(getError(err));
  //     }
  //   });
  // }
  // function onError(err) {
  //   toast.error(getError(err));
  // }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city},{' '}
              </div>
              {isDelivered ? (
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {paymentResult &&
              paymentResult.status === 'pending_confirmation' ? (
                <div className="alert-pending">Pending Confirmation</div>
              ) : isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                            }}
                          ></Image>
                          {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">ksh.{item.price}</td>
                      <td className="p-5 text-right">
                        ksh.{item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="py-1 flex justify-center">
              <Link id="link" href="/admin/orders">
                Back to all orders
              </Link>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>ksh.{itemsPrice}</div>
                  </div>
                </li>{' '}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>ksh.{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>ksh.{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div className="font-bold">Total</div>
                    <div>ksh.{totalPrice}</div>
                  </div>
                </li>
                {/* display pay by mpesa button if order not paid   */}
                {!isPaid && (
                  <li>
                    {
                      <div className="w-full">
                        <form onSubmit={handleSubmit(submitHandler)}>
                          <input
                            className="w-full"
                            id="phonenumber"
                            placeholder="M-Pesa phonenumber"
                            autoFocus
                            {...register('phonenumber', {
                              required: 'Please enter M-Pesa phone number',
                            })}
                          />
                          {errors.phonenumber && (
                            <div className="text-red-500">
                              {errors.phonenumber.message}
                            </div>
                          )}
                          <div className="mb-2 mt-2 flex justify-center">
                            <button className="pay-button w-full">
                              M-Pesa Pay
                            </button>
                          </div>
                        </form>
                      </div>
                    }
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
                {/* display confirm button if order paid but not confirmed */}
                {paymentResult &&
                  paymentResult.status === 'pending_confirmation' && (
                    <li>
                      {
                        <div className="w-full">
                          <form onSubmit={handleSubmit(handleConfirm)}>
                            {errors.phonenumber && (
                              <div className="text-red-500">
                                {errors.phonenumber.message}
                              </div>
                            )}
                            <div className="mb-2 mt-2 flex justify-center">
                              <button className="confirm-button w-full">
                                Confirm
                              </button>
                            </div>
                          </form>
                        </div>
                      }
                      {loadingPay && <div>Loading...</div>}
                    </li>
                  )}
                {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                  <li>
                    {loadingDeliver && <div>Loading...</div>}
                    <button
                      className="primary-button w-full"
                      onClick={deliverOrderHandler}
                    >
                      Deliver Order
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div className="py-1 flex justify-center">
              <Link id="link" href="/admin/orders">
                Back to all orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
