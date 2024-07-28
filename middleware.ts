import { withAuth } from "next-auth/middleware";

export default withAuth;

// Protected Client Page
export const config = {
    matcher: ["/client"],
};