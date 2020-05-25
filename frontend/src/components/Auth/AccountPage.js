import React from 'react';

import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import EditProfilePage from "./EditProfilePage";

const AccountPage = () => (
    <div>
        <h1>Account Page</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
        {/* <EditProfilePage /> */}
    </div>
);

export default AccountPage;