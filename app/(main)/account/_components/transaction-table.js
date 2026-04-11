"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { format } from "date-fns";
import { categoryColors } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Clock, Delete, DeleteIcon, Edit2, LucideDelete, MoreHorizontal, RefreshCcw, Search, Trash, Trash2, X } from "lucide-react";
import { BarLoader } from "react-spinners";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/accounts";
import { Toaster } from "@/components/ui/sonner";
const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
const router = useRouter();
const [selectedIds,setSelectedIds] = useState([]);
const [sortConfig,setSortConfig] = useState({ field:"date", direction:"desc"});
   
 

 const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

const [searchTerm, setSearchTerm] = useState("");
const [typeFilter,setTypeFilter] = useState("");
const [recurringFilter , setRecurringFilter] = useState("");
const { loading: deleteLoading, fn:deleteFn, data:deleted,
}=useFetch(bulkDeleteTransactions);
 const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

const handleSelect=(id)=>{
  setSelectedIds((current)=>
    current.includes(id)?
    current.filter(item=>item!==id)
    :[...current,id]);
};
const handleSelectAll=(current) => {
  setSelectedIds((current)=>
  current.length === filteredAndSortedTransactions.length?[]
  :filteredAndSortedTransactions.map((t)=>t.id));
  
};
// console.log(selectedIds);
const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };
  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      router.refresh();
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters =() =>{
   setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
};


  return (
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}
      {/* filters */}
     <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className=" absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
        <Input className="pl-8" 
        placeholder="Search Transactions..."
        value={searchTerm}
        onChange={(e) =>setSearchTerm(e.target.value)}
        />
        
      </div>
      <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
  <SelectTrigger className="">
    <SelectValue placeholder="All Types" />
  </SelectTrigger>
  <SelectContent className="bg-white"> 
      <SelectItem value="INCOME">Income</SelectItem>
      <SelectItem value="EXPENSE">Expense</SelectItem>
  </SelectContent>
      </Select>

      <Select 
      value={recurringFilter} onValueChange={(value)=>setRecurringFilter(value)}>
  <SelectTrigger className="width-[150px]">
    <SelectValue placeholder="All Transactions" />
  </SelectTrigger>
  <SelectContent className="bg-white"> 
      <SelectItem  value="Reccuring Only">Reccuring Only</SelectItem>
      <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
  </SelectContent>
      </Select>
      {selectedIds.length>0 && (<div className="flex items-center gap-2">
        <Button className="bg-red-600 text-white" size="sm" onClick={handleBulkDelete}>
          <Trash2 className="h-4 w-5 mr-2"/>
          Delete Selected ({selectedIds.length})
        </Button>
        </div>)}
        {(searchTerm || typeFilter || recurringFilter)&&(
          <Button variant="outline" size="icon" 
          onClick={handleClearFilters} title="Clear Filters">
          <X className="h-4 w-5" />
          </Button>)}
      </div>
     </div>


      {/* transactions */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your recent Transactions.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox onCheckedChange={handleSelectAll}
                checked={selectedIds.length === filteredAndSortedTransactions.length && 
                filteredAndSortedTransactions.length >0} />
              </TableHead>

              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("date")}
              >
               <div className=""> Date{" "}
                {sortConfig.field==="date" &&
                (sortConfig.direction ==='asc'?(<ChevronUp className="m1-1 h-4 w-4"/>)
                :(<ChevronDown className="m1-1 h-4 w-4" /> ))}</div>
              </TableHead>

              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("description")}
              >
                Description
              </TableHead>

              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("category")}

              >
                Category{" "}{sortConfig.field==="category"&&
                (sortConfig.direction ==='asc'?(<ChevronUp className="m1-1 h-4 w-4"/>)
                :(<ChevronDown className="m1-1 h-4 w-4" /> ))}

              </TableHead>

              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("amount")}
              >
                Amount{" "}{sortConfig.field==="amount"&&
                (sortConfig.direction ==='asc'?(<ChevronUp className="m1-1 h-4 w-4"/>):(<ChevronDown className="m1-1 h-4 w-4" /> ))}
                
              </TableHead>

              <TableHead className="text-center">Recurring</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <Checkbox onCheckedChange={()=>handleSelect(transaction.id)} 
                    checked={selectedIds.includes(transaction.id)} />
                  </TableCell>

                  <TableCell className="text-center">
                    {format(new Date(transaction.date),"PPP")}
                  </TableCell>

                  <TableCell className="text-center">
                    {transaction.description}
                  </TableCell>

                  <TableCell className="text-center capitalize">
                    <div className="flex justify-center">
                      <span
                        style={{
                          background: categoryColors[transaction.category],
                        }}
                        className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105"
                      >
                        {transaction.category}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    className="text-center font-medium"
                    style={{
                      color: transaction.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>

                  <TableCell className="text-center">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-300"
                            >
                              <RefreshCcw className="h-3 w-3" />
                              {RECURRING_INTERVALS[transaction.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-700 text-blue-200">
                          <div className="font-medium">
                            <div className="text-sm">Next Date:</div>
                            <div>{format(new Date(transaction.nextRecurringDate),"PP")}</div>
                          </div>

                          
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-Time
                      </Badge>
                    )}
                  </TableCell>
<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="bg-slate-600 text-blue-400">
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          // alert("clicked")
          // console.log("Deleting transaction:", transaction.id);
          deleteFn([transaction.id]);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>  </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;