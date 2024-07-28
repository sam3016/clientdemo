import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";
import {BasicAuth, Connection} from 'fm-odata-client';
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Client() {
    const data = await getServerSession(authOptions);
    
    if(!data) return <h1>Forbidden</h1>

    if (data) {
        const connection = new Connection(process.env.HOST!, new BasicAuth(data.user?.username, data.user?.password));
        const database = connection.database(process.env.DATABASE!);
        const clientTable = database.table(process.env.TABLE!);
        const clients = await clientTable.query({
            top: 10
        });
        
        // const clientsData = clients.map(client => {
        //     return {
        //         id: client.id,
        //         first_name: client.first_name,
        //         last_name: client.last_name,
        //         email: client.email,
        //         gender: client.gender,
        //         country: client.country,
        //         city: client.city,
        //     }
        // })
        
        
        return (
            <DataTable 
                columns={columns} 
                data={clients}
            />
        )
    }
};