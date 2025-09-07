import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      console.error("Missing Firebase Admin configuration:", {
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!privateKey,
      });
    }

    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
}

export async function GET(request: NextRequest) {
  console.log("Waitlist data API called:", { method: request.method, url: request.url });

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY not configured");
    return NextResponse.json({ error: "Brevo API key not configured" }, { status: 500 });
  }

  // Check authentication
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing or invalid authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    
    if (decodedToken.email !== "faiz@flovy.ai") {
      console.log("Unauthorized access attempt:", decodedToken.email);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.log("Authentication successful for:", decodedToken.email);
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Get contacts from Brevo
    const url = BREVO_LIST_ID 
      ? `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts`
      : "https://api.brevo.com/v3/contacts";

    console.log("Fetching contacts from Brevo:", url);

    const brevoRes = await fetch(url, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!brevoRes.ok) {
      const errorText = await brevoRes.text();
      console.error("Brevo API error:", { status: brevoRes.status, statusText: brevoRes.statusText, error: errorText });
      return NextResponse.json({ error: "Failed to fetch contacts", details: errorText }, { status: 500 });
    }

    const data = await brevoRes.json();
    console.log("Brevo API response received, contacts count:", data.contacts?.length || 0);
    
    // Format the data to show survey responses
    const contacts = data.contacts || data || [];
    const formattedContacts = contacts.map((contact: {
      email: string;
      attributes?: {
        FIRSTNAME?: string;
        CHALLENGE?: string;
        GOAL?: string;
        URGENCY?: string;
        SOURCE?: string;
      };
      createdAt: string;
      modifiedAt: string;
    }) => ({
      email: contact.email,
      name: contact.attributes?.FIRSTNAME || "N/A",
      challenge: contact.attributes?.CHALLENGE || "N/A",
      goal: contact.attributes?.GOAL || "N/A",
      urgency: contact.attributes?.URGENCY || "N/A",
      source: contact.attributes?.SOURCE || "N/A",
      createdAt: contact.createdAt,
      updatedAt: contact.modifiedAt,
    }));

    console.log("Successfully formatted contacts:", formattedContacts.length);

    return NextResponse.json({
      total: formattedContacts.length,
      contacts: formattedContacts,
    });
  } catch (error: unknown) {
    console.error("Error fetching waitlist data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
