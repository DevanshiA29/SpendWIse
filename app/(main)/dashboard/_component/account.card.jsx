"use client";

import { updateDefaultAccount } from '@/actions/dashboard';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/currency';

const AccountCard = ({ account }) => {
    const { name, type, balance, id, isDefault } = account;
    const [isTransitioning, setIsTransitioning] = useState(false);

    const {
        loading: updateDefaultLoading,
        data: updatedAccount,
        error,
        fn: updateDefaultFn,
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isDefault) {
            toast.warning("At least 1 default account is required");
            return;
        }
        try {
            await updateDefaultFn(id);
        } catch {
            // useFetch already shows the toast and stores the error state.
        }
    };

    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Default account updated Successfully");
        }
    }, [updatedAccount, updateDefaultLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Default account failed to update");
        }
    }, [error]);

    const handleCardClick = () => {
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 1000);
    };

    return (
        <Card 
            className={`group relative overflow-hidden transition-all duration-300 ease-out 
            bg-white dark:bg-card border-muted/40 shadow-sm 
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.02] hover:border-primary/30 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] cursor-pointer
            ${isTransitioning ? 'scale-95 opacity-0 pointer-events-none transition-all duration-500' : 'active:scale-[0.98]'}`}
        >
            {/* The clickable link overlaying the whole card */}
            <Link 
                href={`/account/${id}`} 
                className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                aria-label={`Press Enter to view details for ${name} account`}
                onClick={handleCardClick}
            >
                <span className="sr-only">View details for {name}</span>
            </Link>

            {/* Glowing background effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />

            {/* Card Content Layout */}
            <div className="relative z-20 grid h-full min-h-[170px] grid-cols-[minmax(0,1fr)_auto] gap-4 p-6 pointer-events-none">
                {/* Left Side: Account Name and Balance */}
                <div className="flex min-w-0 flex-col justify-between gap-5">
                    <div>
                        <h3 className="truncate text-lg font-bold capitalize tracking-tight text-foreground/90">{name}</h3>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">{type} Account</p>
                    </div>
                    
                    <div>
                        <div className="break-words text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            {formatCurrency(balance)}
                        </div>
                        <p className="mt-2 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            Open account details
                        </p>
                    </div>
                </div>

                {/* Right Side: Switch, Income and Expense */}
                <div className="flex h-full flex-col items-end justify-between gap-3">
                    <div 
                        className="pointer-events-auto flex min-h-6 items-center gap-2" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-xs text-muted-foreground font-medium">
                            {updateDefaultLoading ? "Updating..." : "Default"}
                        </span>
                        {updateDefaultLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                        <Switch 
                            checked={isDefault}
                            onClick={handleDefaultChange}
                            disabled={updateDefaultLoading} 
                            aria-label={`Set ${name} as default account`}
                        /> 
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex items-center justify-end gap-2 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                            <span>Income</span>
                            <ArrowUpRight className="h-4 w-4" />
                        </div>

                        <div className="flex items-center justify-end gap-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            <span>Expense</span>
                            <ArrowDownRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AccountCard;
