import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const UserRoutes = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()
    return user != null && !user.isAdmin ? <Outlet /> : navigate('/login')
}

export default UserRoutes 