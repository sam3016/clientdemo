"use client";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react"
import { Button } from "./ui/button";

function LogoutButton() {
    return (
        <Button 
            variant="outline" 
            size="icon" 
            onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}
        >
            <LogOutIcon />
        </Button>
    )
}

export default LogoutButton