import { getToken } from 'next-auth/jwt';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import mpesaPush from '../../../../utils/mpesa';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send('Error: signin required');
  }

  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    if (order.isPaid) {
      await db.disconnect();
      return res.status(400).send({ message: 'Error: order is already paid' });
    }
    // order.isPaid = true;
    // order.paidAt = Date.now();

    // order.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   email_address: req.body.email_address,
    // };
    // const paidOrder = await order.save();
    // await db.disconnect();
    // res.send({ message: 'order paid successfully', order: paidOrder });
    const result = await mpesaPush(req.body.phonenumber, req.body.totalPrice);

    if (result) {
      res.send({ result });
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResponseCode = result.CheckoutRequestID;
      order.paymentResult = {
        id: result.CheckoutRequestID,
        status: 'pending_confirmation',
        phonenumber: req.body.phonenumber,
        email_address: 'null',
      };
      await order.save();
      await db.disconnect();
    } else {
      await db.disconnect();
      res.send({ message: 'failed to push to M-Pesa' });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Error: order not found' });
  }
};

export default handler;
