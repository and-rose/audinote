// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import { User } from "firebase/auth";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: { user: User | null | undefined; children }) => {
    return props.user ? props.children : <Navigate to="/Landing" replace />;
};

export default ProtectedRoute;
