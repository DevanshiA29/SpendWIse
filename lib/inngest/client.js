// src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "SpendWise" , 
    name: "SpendWise" , 
    retryFunction: async (attempt) =>({
        delay: Math.pow(2,attempt)*1000, //Exponential Backoff
        maxAttempts: 2,
    })
 });