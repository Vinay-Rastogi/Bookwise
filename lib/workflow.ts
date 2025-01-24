import emailjs from "emailjs-com";
import fetch from "node-fetch";
import { Client as WorkflowClient } from "@upstash/workflow";
import config from "./config";

// Initialize WorkflowClient
export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
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
    const templateParams = {
      to_email: email,
      subject: subject,
      message: message,
    };

    const serviceID = config.env.emailJS.seriveId;
    const templateID = config.env.emailJS.templateId;
    const publicKey = config.env.emailJS.publicKey;

    // Use node-fetch to send the request in Node.js
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: serviceID,
        template_id: templateID,
        user_id: publicKey,
        template_params: templateParams,
      }),
    });

    // Check if the response is ok
    if (response.ok) {
      const result = await response.json(); // Parse the response as JSON if it's valid
      console.log(`Email sent successfully to ${email} with subject "${subject}"`);
    } else {
      // Log non-JSON response content for debugging
      const text = await response.text();
      console.error(`Error sending email: ${text}`);
    }
  } catch (error: any) {
    console.error(`Error sending email to ${email} with subject "${subject}":`, error?.message || error);
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
      url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`,
      body: {
        email,
        fullName,
      },
    });
    console.log(`Workflow triggered successfully for ${email}`);
  } catch (error: any) {
    console.error(`Error triggering workflow for ${email}:`, error?.message || error);
  }
};
