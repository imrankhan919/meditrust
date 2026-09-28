import React, { useEffect, useState } from 'react';
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Loader from '../../components/common/Loader';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { register } from '../../features/auth/authSlice';



export default function LoginPage({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, data, isPending, isSuccess, isError, error } = useMutation({ mutationFn: (payload) => authService.loginUser(payload) })

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { email, password } = formData

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(formData)
  }


  useEffect(() => {

    if (data && isSuccess) {
      toast.success("You have been logged in")
      dispatch(register(data))
      navigate("/auth/dashboard")
    }

    if (isError && isError) {
      toast.error(error.response.data.message)
    }

  }, [isError, error, data, isSuccess])



  if (isPending) {
    return <Loader />
  }




  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-teal-50/20 to-white">
      <div className="w-full max-w-md space-y-6">

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to MediTrust
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unified access for patients, doctors, and healthcare partners
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-xl border-slate-200/80">
          <form className="space-y-4" onSubmit={handleSubmit}>

            <Input
              label="Email Address"
              type="email"
              placeholder="patient@example.com"
              icon={Mail}
              defaultValue={email}
              name="email"
              onChange={handleChange}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                defaultValue={password}
                name="password"
                onChange={handleChange}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-md shadow-teal-600/20 mt-2"
              type="submit"
            >
              Sign In to Account
            </Button>

            {/* Social Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
              </div>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have a MediTrust account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="font-bold text-teal-600 hover:text-teal-700 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>256-bit HIPAA compliant encrypted patient portal</span>
        </div>

      </div>
    </div>
  );
}
