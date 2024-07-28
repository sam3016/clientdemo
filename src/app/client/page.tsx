import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";
import {BasicAuth, Connection} from 'fm-odata-client';
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Client() {
    const data = await getServerSession(authOptions);
    
    if(!data) return <h1>Forbidden</h1>

    if (data) {
        // Get data from FMS using OData API
        const connection = new Connection(process.env.HOST!, new BasicAuth(data.user?.username, data.user?.password));
        const database = connection.database(process.env.DATABASE!);
        const clientTable = database.table(process.env.TABLE!);
        const clients = await clientTable.query({
            top: 10
        });
        
        //Remove attributes to match up to Client Type
        const clientsData = clients.map(client => {
            return {
                id: client.id as string,
                first_name: client.first_name as string,
                last_name: client.last_name as string,
                email: client.email as string,
                gender: client.gender as string,
                country: client.country as string,
                city: client.city as string,
            }
        })
        
        return (
            <DataTable 
                columns={columns} 
                data={clientsData}
            />
        )
    }
};