/* eslint-disable no-const-assign */
// import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { redirect } = router.query;

  const {
    handleSubmit,
    register,

    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email }) => {
    try {
      const result = await axios.post('/api/auth/sendPasswordResetCode', {
        email,
      });
      console.log(result.status);

      toast.success(' password link sent to you email successfully');

      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Forgot Password">
      <form
        className="max-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Forgot Password</h1>
        <div className="mb-4">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter a valid email',
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <button className="primary-button">Send Reset Code</button>
        </div>
        <div className="mb-4"></div>
        <div className="mb-4">
          Don&apos;t have an account?{' '}
          {/* //&apos is apostrophe(') and &nbsp is admin-admin2 Gv9-5kajZ952@Bn
          space */}
          <Link id="link" href={`/register?redirect=${redirect || '/'}`}>
            Register
          </Link>
        </div>
      </form>
    </Layout>
  );
}