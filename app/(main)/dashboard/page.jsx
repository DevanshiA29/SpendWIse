import React, { Suspense } from 'react'
import { CreateAccountDrawer } from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, WalletCards } from 'lucide-react'
import { getDashboardData, getUserAccounts } from '@/actions/dashboard'
import AccountCard  from './_component/account.card'
import { checkUser } from '@/lib/checkUser'
import { getCurrentBudget } from '@/actions/budget'
import { BudgetProgress } from './_component/budget-progress'
import { DashboardOverview } from './_component/transaction-overview'
import { processCurrentUserRecurringSafely } from '@/lib/current-user-recurring'
import { RecurringAutomationNotice } from '@/components/recurring-automation-notice'
const DashboardPage = async () => {
    await checkUser();
    const recurringResult = await processCurrentUserRecurringSafely();
    const accounts = await getUserAccounts();
    const defaultAccount = accounts?.find((account) =>account.isDefault);
    let budgetData =null;
    if(defaultAccount){
        budgetData = await getCurrentBudget(defaultAccount.id);
    }

    const transactions = await getDashboardData();
    return (
        <div className="px-5 space-y-8">
            <RecurringAutomationNotice initialProcessed={recurringResult?.processed || 0} />
            {/* Budget Progress - Placeholder for now */}
             {defaultAccount&&(
                <BudgetProgress
                initialBudget={budgetData?.budget}
                currentExpenses={budgetData?.currentExpenses || 0} />
             )}
           
            {accounts.length > 0 ? (
                <Suspense fallback={"Loading Overview..."}>
                    <DashboardOverview
                        accounts={accounts}
                        transactions={transactions || []}
                    />
                </Suspense>
            ) : (
                <CreateAccountDrawer>
                    <Card className="cursor-pointer border-2 border-dashed border-primary/30 bg-primary/5 transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:shadow-md">
                        <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                            <div className="rounded-full bg-white p-4 text-primary shadow-sm">
                                <WalletCards className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-lg font-bold">Create your first account</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add a wallet before viewing monthly insights and transactions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>
            )}
            {/* Accounts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts.length > 0 && (
                    <CreateAccountDrawer>
                        <Card className="hover:shadow-lg transition-all cursor-pointer border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 duration-300">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full min-h-[160px]">
                                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3 group-hover:bg-primary/10 transition-colors">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-bold">Add New Account</span>
                            </CardContent>
                        </Card>
                    </CreateAccountDrawer>
                )}
{/* render the wallet created on to the frontend */}
                {accounts.length > 0 && accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                ))}
            </div>
        </div>
    )
}

export default DashboardPage;
