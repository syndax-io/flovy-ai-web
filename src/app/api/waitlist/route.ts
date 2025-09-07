import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID; // optional: put contacts in a list

// Custom attributes we want to create in Brevo
const CUSTOM_ATTRIBUTES = [
  { name: "CHALLENGE", type: "text" },
  { name: "GOAL", type: "text" },
  { name: "URGENCY", type: "text" },
  { name: "SOURCE", type: "text" },
];

// Function to create custom attributes in Brevo
async function ensureCustomAttributes() {
  try {
    // Get existing attributes
    const getRes = await fetch("https://api.brevo.com/v3/contacts/attributes", {
      headers: {
        "api-key": BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
    });

    if (!getRes.ok) {
      console.error("Failed to get existing attributes:", await getRes.text());
      return;
    }

    const existingAttributes = await getRes.json();
    const existingNames = existingAttributes.attributes?.map((attr: { name: string }) => attr.name) || [];

    // Create missing attributes
    for (const attr of CUSTOM_ATTRIBUTES) {
      if (!existingNames.includes(attr.name)) {
        console.log(`Creating attribute: ${attr.name}`);
        const createRes = await fetch("https://api.brevo.com/v3/contacts/attributes", {
          method: "POST",
          headers: {
            "api-key": BREVO_API_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: attr.name,
            type: attr.type,
          }),
        });

        if (!createRes.ok) {
          const errorText = await createRes.text();
          console.error(`Failed to create attribute ${attr.name}:`, errorText);
        } else {
          console.log(`Successfully created attribute: ${attr.name}`);
        }
      }
    }
  } catch (error) {
    console.error("Error ensuring custom attributes:", error);
  }
}

export async function POST(request: NextRequest) {
  if (!BREVO_API_KEY) {
    return NextResponse.json({ error: "Brevo API key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { email, name, challenge, goal, urgency } = body || {};

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Ensure custom attributes exist (only on first request)
    await ensureCustomAttributes();

    // Prepare attributes - only include non-empty values
    const attributes: Record<string, string | undefined> = {
      FIRSTNAME: name || undefined,
      SOURCE: "flovy_waitlist",
    };

    // Only add custom attributes if they have values
    if (challenge) attributes.CHALLENGE = challenge;
    if (goal) attributes.GOAL = goal;
    if (urgency) attributes.URGENCY = urgency;

    // Create/Update contact in Brevo
    const payload: {
      email: string;
      attributes: Record<string, string | undefined>;
      updateEnabled: boolean;
      listIds?: number[];
    } = {
      email,
      attributes,
      updateEnabled: true,
    };

    if (BREVO_LIST_ID) {
      payload.listIds = [Number(BREVO_LIST_ID)].filter(Boolean);
    }

    console.log("Sending payload to Brevo:", JSON.stringify(payload, null, 2));

    // Try to create the contact first
    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error("Brevo API error:", errText);
      
      // If contact exists, try update
      if (brevoRes.status === 400 && errText.includes("exists")) {
        console.log("Contact exists, updating...");
        
        // Try updating with PUT method
        const updateRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
          method: "PUT",
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (!updateRes.ok) {
          const updateText = await updateRes.text();
          console.error("Brevo update error:", updateText);
          
          // If PUT fails, try PATCH method
          console.log("Trying PATCH method...");
          const patchRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
            method: "PATCH",
            headers: {
              "api-key": BREVO_API_KEY,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          });
          
          if (!patchRes.ok) {
            const patchText = await patchRes.text();
            console.error("Brevo PATCH error:", patchText);
            return NextResponse.json({ error: "Brevo update failed", details: patchText }, { status: 500 });
          }
          
          console.log("Contact updated successfully with PATCH");
        } else {
          console.log("Contact updated successfully with PUT");
        }
      } else {
        return NextResponse.json({ error: "Brevo create failed", details: errText }, { status: 500 });
      }
    } else {
      console.log("Contact created successfully");
    }

    // Verify the contact was created/updated with attributes
    console.log("Verifying contact data...");
    const verifyRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (verifyRes.ok) {
      const contactData = await verifyRes.json();
      console.log("Contact verification:", JSON.stringify(contactData, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
