import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAIL_CHIMP_ERROR_TITLES: Record<string, string> = {
  // ["Invalid Resource"]: "One of the fields is invalid",
  ["Invalid Resource"]: "Invalid Email Address",

  ["Member Exists"]: "Member already exists",
};

export async function OPTIONS(req: Request) {
  try {
    const { email, name, surName, newsletter, subscriber } = await req.json();

    const res = NextResponse.next();
    res.headers.append("Access-Control-Allow-Origin", "*");
    res.headers.append(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.append("Access-Control-Allow-Headers", "Content-Type");

    if (!email) {
      return NextResponse.json({ error: "Email is required" });
    }

    const AUDIANCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const API_SERVER = process.env.MAILCHIMP_API_SERVER;

    let tags = [];

    if (newsletter) {
      tags.push(newsletter);
    }

    if (subscriber) {
      tags.push(subscriber);
    }

    const data = {
      email_address: email,
      status: "subscribed",
      status_if_new: "subscribed",
      merge_fields: {
        NOME: name,
        COGNOME: surName,
      },
      tags: tags,
    };

    const response = await fetch(
      `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIANCE_ID}/members/${email}`,

      {
        body: JSON.stringify(data),
        headers: {
          Authorization: `apikey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
      }
    );

    const resData = await response.json();

    console.log(resData, "@resData");

    if (response.status >= 400) {
      return NextResponse.json(
        {
          success: false,
          error:
            MAIL_CHIMP_ERROR_TITLES[resData?.title] || "Something went wrong",
          data: resData,
        },
        {
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        error: "",
        data: { id: resData?.id },
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message as string,
      },
      {
        headers: corsHeaders,
      }
    );
  }
}
