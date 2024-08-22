'use server'
// marcamos que todas las funciones son de servidor y se ejectuan en el servidor
// no se ejecutan ni envian al cliente.
import { z } from 'zod'
import { Invoice } from './definitions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createInvoiceShcema = z.object({
    id : z.string(),
    customerId : z.string(),
    amount : z.coerce.number(),
    status : z.enum(['pending', 'paid']),
    date : z.string()
})

const createInvoiceShcemaFormData = createInvoiceShcema.omit({
    id : true,
    date : true
})

export async function createInvoice(formaData : FormData){
    // console.log(formaData);
    const {status, amount, customerId} = createInvoiceShcemaFormData.parse({
        customerId : formaData.get('customerId'),
        amount : formaData.get('amount'),
        status : formaData.get('status')

    })
    const [ date, time ] = new Date().toISOString().split('T')

    const data = await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES(${customerId}, ${amount}, ${status}, ${date})

    `
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
    
    


} 


export async function deleteInvoice(id: string){
    const data = await sql`DELETE FROM invoices WHERE id = ${id}`
    revalidatePath('/dashboard/invoices')
    return data.rowCount;

    
}