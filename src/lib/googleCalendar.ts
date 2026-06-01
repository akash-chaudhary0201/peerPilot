import { google } from "googleapis";

// Initialize the JWT auth client
const getAuthClient = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    return null;
  }

  return new google.auth.JWT({
    email,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar.events"]
  });
};

interface CreateMeetEventInput {
  summary: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  attendeeEmails: string[];
  requestId: string;
}

/**
 * Creates a Google Calendar event with a Google Meet conference link.
 * If credentials are not configured in .env, it gracefully falls back to generating a mock Meet URL.
 */
export async function createGoogleMeetEvent({
  summary,
  description,
  startDateTime,
  endDateTime,
  attendeeEmails,
  requestId,
}: CreateMeetEventInput): Promise<string> {
  const auth = getAuthClient();

  if (!auth) {
    console.warn("Google Calendar credentials are not configured. Returning a mock Meet link.");
    // Return a mock meet link for local development
    return `https://meet.google.com/mock-meet-${requestId.substring(0, 8)}`;
  }

  try {
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "UTC",
      },
      attendees: attendeeEmails.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    if (response.data.hangoutLink) {
      return response.data.hangoutLink;
    }

    throw new Error("Google Meet hangoutLink was not returned in the API response.");
  } catch (error) {
    console.error("Failed to create Google Calendar event with Meet:", error);
    // Return a fallback mock link so that operations do not block in case of network or API authorization errors
    return `https://meet.google.com/mock-meet-${requestId.substring(0, 8)}`;
  }
}
