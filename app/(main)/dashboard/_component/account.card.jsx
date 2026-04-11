"use client";
import { updateDefaultAccount } from '@/actions/dashboard';
import { Card ,CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowUpRight , ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
// import { Client } from 'pg';
import { useEffect } from 'react'
import { toast } from 'sonner';

const AccountCard = ({account}) => {
    const {name , type , balance , id ,isDefault} =account;

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount);
    const handleDefaultChange =async () =>{
        event.preventDefault
        if(isDefault){
            toast.warning("Atleas 1 default account is required");
            return;
        }
        await updateDefaultAccount(id);
    };
    useEffect(()=>{
        
            if(updatedAccount?.success){
                toast.success("Default account updated Successfully")
            }

        },[updatedAccount,updateDefaultLoading]);
    useEffect(()=>{
        
            if(error){
                toast.error(error.message || "Default account failed to update")
            }

        },[error]);




  return (
   <Card className = "hover:shadow-md transition-shadow group relative">
   

    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-10">
        <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
         <Switch checked={isDefault}
         onClick={handleDefaultChange}
         disabled = {updateDefaultLoading} /> 
        
          </CardHeader>
    <CardContent></CardContent>
        <Link href={`/account/${id}`}>
    <CardFooter className="flex items-center justify-between text-sm text-muted-foreground w-full">
  <div className="flex items-center">
    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
    Income
  </div>

  <div className="flex items-center">
    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
    Expense
  </div>
</CardFooter>
    </Link>
   </Card>
  )
}

export default AccountCard;
