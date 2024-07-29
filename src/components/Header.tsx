import { getServerSession } from "next-auth";
import { ModeToggle } from "./ModeToggle";
import { authOptions } from "../../auth";
import LogoutButton from "./LogoutButton";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

async function Header() {
  const data = await getServerSession(authOptions);
  return (
    <nav className="flex justify-end items-end pr-5">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
          {data && (
            // Display the logout button when login
            <NavigationMenuItem>
            <LogoutButton />
          </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}

export default Header;