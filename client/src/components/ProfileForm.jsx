import React, { useEffect, useState } from 'react'
import Card from './common/Card'
import Button from './common/Button'
import { Mail, Phone, Save, User } from 'lucide-react'
import Input from './common/Input'
import { useMutation } from '@tanstack/react-query'
import authService from '../services/authService'
import Loader from './common/Loader'
import toast from 'react-hot-toast'

const ProfileForm = ({ user }) => {


    const { mutate, data, isPending, isSuccess, isError, error } = useMutation({ mutationFn: (payload) => authService.updateProfile(payload) })


    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
    })


    const { name, email, phone, address } = formData



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({ token: user.token, ...formData })
    }


    useEffect(() => {

        if (isSuccess && data) {
            toast.success("Profile Updated")
        }

        if (isError && error) {
            toast.error(error.response.data.message)
        }

    }, [isSuccess])


    if (isPending) {
        return (
            <Loader />
        )
    }

    return (
        <Card className="p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Personal Health Profile</h2>
                    <p className="text-xs text-slate-500">Edit demographic and medical contact details</p>
                </div>

            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue={name} name="name" onChange={handleChange} icon={User} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Email Address" type="email" defaultValue={email} name="email" onChange={handleChange} icon={Mail} required />
                    <Input label="Phone Number" type="tel" defaultValue={phone} name="phone" onChange={handleChange} icon={Phone} required />
                </div>



                <Input label="Default Delivery Address" defaultValue={address} name="address" onChange={handleChange} required />
                <Button type="submit" variant="primary" size="lg" icon={Save}>
                    Save Changes
                </Button>
            </form>
        </Card>
    )
}

export default ProfileForm
