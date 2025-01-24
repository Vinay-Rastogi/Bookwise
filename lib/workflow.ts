import emailjs from "emailjs-com";
import { Client as WorkflowClient } from "@upstash/workflow";
import config from "./config";

// Initialize WorkflowClient
export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl, // Replace with your Upstash QStash URL
  token: config.env.upstash.qstashToken, // Replace with your Upstash QStash token
});

// Function to send an email using EmailJS
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
    // Prepare the template parameters for EmailJS
    const templateParams = {
      to_email: email,
      subject: subject,
      message: message,
    };

    // Retrieve EmailJS credentials from the config
    const serviceID = config.env.emailJS.seriveId; // EmailJS service ID
    const templateID = config.env.emailJS.templateId; // EmailJS template ID
    const publicKey = config.env.emailJS.publicKey; // EmailJS public key

    // Send the email via EmailJS
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

// Function to trigger a workflow
export const triggerWorkflow = async ({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) => {
  try {
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`, // API endpoint for workflow onboarding
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
