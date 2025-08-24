import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!BREVO_API_KEY) {
    return res.status(500).json({ error: "Brevo API key not configured" });
  }

  // Check authentication
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    
    if (decodedToken.email !== "faiz@flovy.ai") {
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    // Get contacts from Brevo
    const url = BREVO_LIST_ID 
      ? `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts`
      : "https://api.brevo.com/v3/contacts";

    const brevoRes = await fetch(url, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!brevoRes.ok) {
      const errorText = await brevoRes.text();
      return res.status(500).json({ error: "Failed to fetch contacts", details: errorText });
    }

    const data = await brevoRes.json();
    
    // Format the data to show survey responses
    const contacts = data.contacts || data || [];
    const formattedContacts = contacts.map((contact: any) => ({
      email: contact.email,
      name: contact.attributes?.FIRSTNAME || "N/A",
      challenge: contact.attributes?.CHALLENGE || "N/A",
      goal: contact.attributes?.GOAL || "N/A",
      urgency: contact.attributes?.URGENCY || "N/A",
      source: contact.attributes?.SOURCE || "N/A",
      createdAt: contact.createdAt,
      updatedAt: contact.modifiedAt,
    }));

    return res.status(200).json({
      total: formattedContacts.length,
      contacts: formattedContacts,
    });
  } catch (error: any) {
    console.error("Error fetching waitlist data:", error);
    return res.status(500).json({ error: error?.message || "Unexpected error" });
  }
}
