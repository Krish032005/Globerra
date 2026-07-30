import React from "react";
import './CSS/Navbar.css';
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useClerk, useUser, UserButton, Show,SignUp, SignUpButton, SignInButton } from "@clerk/react";

   
export default function Navbar(){
    const navigate = useNavigate();

    const {openSignIn} = useClerk()
    const {user} = useUser()

    return(
        <>
        
            


            

            <nav  className="navbar navbar-expand-sm justify-content-center">
            <div className="container-fluid">
                <a className="navbar-brand" href="/"><h1 id="logo">Globerra</h1></a>
               
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" to="/">Home</Link>
                    </li>
                    
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/blog">Blog</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/destination">Destination</Link>
                    </li>
                </ul>
            </div>
                    {user ? 
                    (<Show when="signed-in">
                        <div className="signed-in-btn"> <UserButton /></div>
                       
                    </Show>)
                    :
                    (<button type="button" className="btn btn-dark login" onClick={openSignIn}>Login</button>)
                    } 
                    
                
                
        </nav>
        
        
        
        
        </>
    )
}