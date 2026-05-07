"use client";

import { updateDefaultAccount } from '@/actions/dashboard';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AccountCard = ({ account }) => {
    const { name, type, balance, id, isDefault } = account;
    const [isTransitioning, setIsTransitioning] = useState(false);

    const {
        loading: updateDefaultLoading,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isDefault) {
            toast.warning("At least 1 default account is required");
            return;
        }
        await updateDefaultAccount(id);
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

            {/* Hover details overlay button at center bottom */}
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none translate-y-4 group-hover:translate-y-0">
                <div className="bg-background/95 backdrop-blur-md border border-primary/20 px-5 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 text-primary">
                    View details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>

            {/* Card Content Layout */}
            <div className="relative z-20 flex justify-between items-start p-6 pointer-events-none h-full">
                {/* Left Side: Account Name and Balance */}
                <div className="flex flex-col justify-between h-full gap-4">
                    <div>
                        <h3 className="text-lg font-bold capitalize tracking-tight text-foreground/90">{name}</h3>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">{type} Account</p>
                    </div>
                    
                    <div className="mt-4">
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                            ${parseFloat(balance || 0).toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Right Side: Switch, Income and Expense */}
                <div className="flex flex-col items-end gap-3 h-full justify-between">
                    <div 
                        className="pointer-events-auto flex items-center gap-2" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-xs text-muted-foreground font-medium">Default</span>
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
