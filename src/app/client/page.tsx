import { authOptions } from "../../../auth";
import { getServerSession } from "next-auth";
import {BasicAuth, Connection} from 'fm-odata-client';
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Client() {
    const data = await getServerSession(authOptions);
    
    if(!data) return (
        <>
            <h1 className="flex flex-row items-center justify-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Forbidden</h1>
            <p className="font-bold pl-20 pr-20 sm:h-40 md:p-10 flex justify-center items-center h-50 text-balance">You are not allowed to access this page without login.</p>
        </>
        
    )

    if (data) {
        // Get data from FMS using OData API
        const connection = new Connection(process.env.HOST!, new BasicAuth(data.user?.username, data.user?.password));
        const database = connection.database(process.env.DATABASE!);
        const clientTable = database.table(process.env.TABLE!);
        const clients = await clientTable.query({
            top: 1000
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
            <>
                <p className="text-sm flex flex-row items-end justify-end text-gray-500 dark:text-gray-300 sm:text-center">You are logged as {data.user?.username}</p>
                <h1 className="mb-4 flex flex-row justify-center items-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Clients</h1>
                <DataTable 
                    columns={columns}
                    data={clientsData}
                />
            </>
            
        )
    }
};