import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";
import {BasicAuth, Connection} from 'fm-odata-client';
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Client() {
    const data = await getServerSession(authOptions);
    
    if(!data) return <h1>Forbidden</h1>

    if (data) {
        const connection = new Connection(process.env.HOST!, new BasicAuth(data.user?.username!, data.user?.password!));
        const database = connection.database(process.env.DATABASE!);
        const clientTable = database.table(process.env.TABLE!);
        const clients = await clientTable.query({
            top: 100
        });
        
        return (
            <DataTable 
                columns={columns} 
                data={clients}
            />
        )
    }
};