import emailjs from "emailjs-com";
import { Client as WorkflowClient } from "@upstash/workflow";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken, 
});


export const sendEmail = async ({

  email,
  subject,
  message,

}: {
  email: string;
  subject: string;
  message: string;

}) => {
  try {
    const templateParams = {
      to_email: email,
      subject: subject,
      message: message,
    };

    const serviceID = config.env.emailJS.seriveId; 
    const templateID = config.env.emailJS.templateId; 
    const publicKey = config.env.emailJS.publicKey; 

    emailjs.init(publicKey);

    await emailjs.send(serviceID, templateID, templateParams, publicKey);

    console.log(
      `Email sent successfully to ${email} with subject "${subject}"`
    );
  } catch (error: any) {
    console.error(
      `Error sending email to ${email} with subject "${subject}":`,
      error?.message || error
    );
  }
};


export const triggerWorkflow = async ({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) => {
  try {
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`,
      body: {
        email,
        fullName,
      },
    });
    console.log(`Workflow triggered successfully for ${email}`);
  } catch (error: any) {
    console.error(
      `Error triggering workflow for ${email}:`,
      error?.message || error
    );
  }
};
