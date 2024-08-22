import { fetchCustomers, fetchFilteredCustomers } from "@/app/lib/data";
import { CustomerField, FormattedCustomersTable } from "@/app/lib/definitions";
import CustomersTable from "@/app/ui/customers/table";
import { useSearchParams } from "next/navigation";


export default async  function CustomerPage ({searchParams} : { searchParams : {
    query : string
}}) {

    const query = searchParams?.query || '';
    const customers = await fetchFilteredCustomers(query);

    return (
        <CustomersTable  customers={customers}/>
    )
}