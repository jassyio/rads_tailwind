import { getToken } from 'next-auth/jwt';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });

  // console.log(user);

  if (!user) {
    return res.status(401).send('signin required');
  }
  // const user = {
  //   email: 'kev1@gmail.com',
  //   image: 'f',
  //   name: 'Kev',
  //   _id: '643dacabdb7117caa589b3d2',
  // };
  // const { user } = session;
  await db.connect();
  const newOrder = new Order({
    ...req.body,
    user: user._id,
  });

  const order = await newOrder.save();
  res.status(201).send(order);
};
export default handler;
