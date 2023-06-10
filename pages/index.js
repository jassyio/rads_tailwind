import ProductItem from '../components/ProductItem';
import axios from 'axios';
import Layout from '../components/Layout';
// import data from '../utils/data';
import Product from '../models/Product';
import db from '../utils/db';
import { useContext, useState } from 'react';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
// import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import Carousel from '../components/Carousel';

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const router = useRouter();

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error('Sorry, product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to cart');
    router.push('/cart');
  };

  // for the search bar
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <Layout>
      <div className=" h-32 md:h-42 lg:h-52 overflow-hidden">
        <Carousel products={featuredProducts}></Carousel>
      </div>
      {/* <h1 className="h2 my-4 text-2xl">Latest Products</h1> */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 auto-rows-min h-auto w-full overflow-x-auto">
        {/* <div className="flex flex-wrap justify-between"> */}
        <div className="my-3">
          <h2>Search</h2>
          <form
            onSubmit={submitHandler}
            className="mx-auto flex items-center justify-left md:flex"
          >
            <input
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
              placeholder="Search products"
            />
            <button
              className="rounded rounded-tl-none rounded-bl-none bg-white-300 p-1 text-sm dark:text-black"
              type="submit"
              id="button-addon2"
            >
              <SearchIcon className="h-5 w-5"></SearchIcon>
            </button>
          </form>
        </div>
        <div className="my-3">
          <h2>Sort by</h2>
          <select
          // value={sort} onChange={sortHandler}
          >
            <option value="none"></option>
            <option value="featured">Featured</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Customer Reviews</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        <div className="my-3 hidden md:block">
          <h2>Categories</h2>
          <select
            className="w-full"
            // value={category}
            // onChange={categoryHandler}
          >
            <option value="all">All</option>
            {/* {categories &&
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))} */}
          </select>
        </div>
        <div className="my-3 hidden md:block">
          <h2>Brands</h2>
          <select
            className="w-full"
            // value={brand} onChange={brandHandler}
          >
            <option value="all">All</option>
            {/* {brands &&
                brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))} */}
          </select>
        </div>
        <div className="my-3 hidden md:block">
          <h2>Prices</h2>
          <select
            className="w-full"
            // value={price} onChange={priceHandler}
          >
            <option value="all">All</option>
            {/* {prices &&
                prices.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.name}
                  </option>
                ))} */}
          </select>
        </div>
        {/* </div> */}
      </div>

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"> */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            key={product.slug}
            product={product}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const data = await Product.find().lean();
  const products = JSON.parse(JSON.stringify(data));
  const featuredProductsData = await Product.find({ isFeatured: true }).lean();
  const featuredProducts = JSON.parse(JSON.stringify(featuredProductsData));
  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
