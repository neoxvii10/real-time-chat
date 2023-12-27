import HomePage from "../HomePage/HomePage"
import Signup from '../Authentications/Signup/Signup'
import Signin from '../Authentications/Signin/Signin'
import Redirect from '../Authentications/Redirect/Redirect'
import ResetPassword from '../Authentications/ResetPassword/ResetPassword';
import InputEmail from '../Authentications/ResetPassword/InputEmail/InputEmail';
import AdminManagement from '../Dashboard/Admin';

const publicRoutes = [
    {path: '/signin', component: Signin},
    {path: '/signup', component: Signup},
    {path: '/reset-password', component: ResetPassword},
    {path: '/reset-password/email', component: InputEmail},
    {path: '/redirect/:username', component: Redirect}
]

const privateRoutes = [
    {path: '/', component: HomePage},
    {path: '/:username', component: HomePage},
    {path: '/admin', component: AdminManagement}
]

export {publicRoutes, privateRoutes};