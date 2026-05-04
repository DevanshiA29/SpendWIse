
import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma"; 
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";
export const checkBudgetAlerts = inngest.createFunction(
  {
    id: "check-budget-alerts",
    name: "Check Budget Alerts",
    cron: "0 */6 * * *",
  },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: { isDefault: true },
              },
            },
          },
        },
      });
    });

    const startDate = new Date();
    startDate.setDate(1);

    for (const b of budgets) {
      const defaultAccount = b.user.accounts[0];
      if (!defaultAccount) continue;

      const expenses = await db.transaction.aggregate({
        where: {
          userId: b.userId,
          accountId: defaultAccount.id,
          type: "EXPENSE",
          date: {
            gte: startDate,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const totalExpenses = expenses._sum.amount?.toNumber() || 0;
      const budgetAmount = b.amount;

      const percentageUsed =
        budgetAmount > 0
          ? (totalExpenses / budgetAmount) * 100
          : 0;

      if (
        percentageUsed >= 80 &&
        (!b.lastAlertSent ||
          isNewMonth(new Date(b.lastAlertSent), new Date()))
      ) {
        // send email here
        
        await sendEmail({
          to: b.user.email,
          subject: `Budget Alert for ${defaultAccount.name}`,
          react:(
            <EmailTemplate
            userName= {b.user.name}
            type= "budget-alert"
            data= {{
                budgetAmount: Number(budgetAmount),
                totalExpenses: Number(totalExpenses),
                percentageUsed,
                accountName: defaultAccount.name,
            }}
          />
          ),
        });


        await db.budget.update({
          where: { id: b.id },
          data: { lastAlertSent: new Date() },
        });
      }
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}