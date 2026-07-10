import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginUser, clearError } from '../store/slices/authSlice';
import Link from 'next/link';

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 object-cover w-full h-full -z-10 brightness-50"
      >
        <source src="/db_video.mp4" type="video/mp4" />
      </video>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md p-8 mx-4 border shadow-2xl rounded-3xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          borderColor: 'rgba(255,255,255,0.15)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />

        <div className="relative">
          <h1 className="mb-2 text-3xl font-bold text-center text-white">
            Welcome Back
          </h1>
          <p className="mb-8 text-sm text-center text-white/60">
            Sign in to your TravelHub account
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1.5 text-sm text-white/80">Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 text-white transition-all border outline-none bg-white/5 rounded-xl focus:ring-2 focus:ring-white/25 placeholder-white/30 ${
                  formik.errors.email && formik.touched.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/15 focus:border-white/25'
                }`}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="mt-1 text-xs text-red-400">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1.5 text-sm text-white/80">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 text-white transition-all border outline-none bg-white/5 rounded-xl focus:ring-2 focus:ring-white/25 placeholder-white/30 ${
                    formik.errors.password && formik.touched.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/15 focus:border-white/25'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-white/50 right-3 top-1/2 -translate-y-1/2 hover:text-white/80"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="mt-1 text-xs text-red-400">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold text-black transition-all bg-white rounded-xl hover:bg-white/90 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-white/60">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
