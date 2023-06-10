import Product from '../../models/Product';
// import user from '../../models/User';
import data from '../../utils/data';
import db from '../../utils/db';

const handler = async (req, res) => {
  try {
    await db.connect();
    // await user.deleteMany();
    // console.log('Deleted all users');
    // const result = await user.insertMany(data.users);
    // console.log('inserted ', result);
    await Product.deleteMany();
    await Product.insertMany(data.products);
    await db.disconnect();
    res.status(200).json({ message: 'seeded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error' });
  }
};

export default handler;

// const handler = async (req, res) => {
//   await db.connect();
//   await user.deleteMany();
//   await user.insertMany(data.users);
//   await db.disconnect();
//   res.send({ message: 'seeded successfully' });
// };
// export default handler;
