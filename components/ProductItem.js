import Link from 'next/link';
import React from 'react';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p className="mb-2">ksh.{product.price}</p>
        {/* {product.compatibleVehicles &&
          product.compatibleVehicles.length > 0 && (
            <div className="mb-2">
              <strong>Compatibility</strong>
              <ul>
                {product.compatibleVehicles.map((vehicle, index) => (
                  <li key={index}>
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        <button
          className="primary-button text-white"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
