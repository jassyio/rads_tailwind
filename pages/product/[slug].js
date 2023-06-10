import React, { useContext } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
// import data from '../../utils/data';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  // const { query } = useRouter();
  // const { slug } = query;
  // const product = data.products.find((item) => item.slug === slug);

  if (!product) {
    return <Layout title={'Product not Found'}>Product Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      alert('Sorry, product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link id="link" href={'/'}>
          Back to products
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">
                <strong>{product.name}</strong>
              </h1>
            </li>
            <li>
              <p className="text-sm">
                <strong>Brand:</strong> {product.brand}
              </p>
            </li>
            <li>
              <p className="text-sm">
                <strong>Category: </strong>
                {product.category}
              </p>
            </li>
            <li>
              <p className="text-sm">
                <strong>Rating: {''}</strong>
                {product.rating} of {product.numReviews} reviews
              </p>
            </li>
            <li>
              <p className="text-sm">
                <strong>Description:</strong> {product.description}
              </p>
            </li>
          </ul>
          {product.compatibleVehicles &&
            product.compatibleVehicles.length > 0 && (
              <div className="w-full">
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr text-sm font-medium text-gray-700 text-left bg-gray-200>
                      <th className="px-2 py-1" colspan="3">
                        Compatibility
                      </th>
                    </tr>
                    <tr text-sm font-medium text-gray-700 text-left bg-gray-200>
                      <th className="w-1/3">Make</th>
                      <th className="w-1/3">Model</th>
                      <th className="w-1/3">YoM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.compatibleVehicles.map((vehicle, i) => (
                      <tr key={i}>
                        <td>{vehicle.make}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>ksh.{product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button text-white w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
            <div className="py-2 flex justify-center">
              <Link id="link" href={'/'}>
                Back to products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const data = await Product.findOne({ slug }).lean();
  let product = JSON.parse(JSON.stringify(data));
  console.log(product);

  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
