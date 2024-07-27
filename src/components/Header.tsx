import { getServerSession } from "next-auth";
import { ModeToggle } from "./ModeToggle";
import { authOptions } from "../../auth";


async function Header() {
  const data = await getServerSession(authOptions);
  return (
    <nav className="flex justify-end items-end">
      <ModeToggle />
    </nav>
  )
}

export default Header;