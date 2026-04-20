"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { createTransaction } from '@/actions/transaction'
import { transactionSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Select,SelectTrigger, SelectValue ,SelectItem,SelectContent } from '@/components/ui/select'
const AddTransactionForm = ({accounts , categories}) => {

    const {register,
        setValue,
        handleSubmit , 
        formState:{errors},
        watch,
        getValues, reset,
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues:{
            type:"EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
        },
    });

    const {
        loading:transactionLoading,
        fn: transactionFn,
        data: transactionResult,

    }=useFetch(createTransaction);

    const type =watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");
  return (
    <div className="space-y-2">
   {/* Ai receipt scanner */}
   <div className="space-y-2">
    <label className="text-sm font-medium">Type</label>
    <Select 
      onValueChange={(value) => setValue("type" , value)}
      defaultValue={type}
    >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select type" />
    </SelectTrigger>
    <SelectContent>
   
      <SelectItem value="EXPENSE">Expense</SelectItem>
      <SelectItem value="INCOME">Income</SelectItem>
 
    </SelectContent>
   </Select>
     {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}

   </div>
  <div>
    <div className="space-y-2">
    <label className="text-sm font-medium">Amount</label>
   <Input 
   type="number"
   step="0.01"
   placeholder="0.00"
   {...register("amount")}
   />
     {errors.Amount && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}

   </div>
   </div>
   
    </div>
  )
}

export default AddTransactionForm
