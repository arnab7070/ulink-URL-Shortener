import { NextResponse } from "next/server";
import { connectToDatabase } from "../utils/dbConnect";
import Url from "../models/url";
import ShortUniqueId from "short-unique-id";

await connectToDatabase(); // firstly connect to database to perform any of the requests

export async function POST(req) {
  const { url } = await req.json();
  try {
    const urlData = await Url.findOne({ originalUrl: url });
    if (urlData) return NextResponse.json({ success: "true", urlDetails: urlData });
    const urldoc = new Url({
      originalUrl: url,
      shortUrl: new ShortUniqueId({ length: 5 }).rnd(),
    });
    const data = await urldoc.save();
    return NextResponse.json({ success: "true", urlDetails: data });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ method: "POST" });
}

export async function GET(request) {
  const shortId = request.nextUrl.searchParams.get("uid");
  try {
    const urlData = await Url.findOne({ shortUrl: shortId });
    if (urlData) {
      await Url.updateOne({ shortUrl: shortId }, { $inc: { clickCount: 1 } });
      return NextResponse.redirect(urlData.originalUrl);
    } else {
      return NextResponse.redirect("/404"); // or handle the case where short URL is not found
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect("/500"); // or handle the case where an error occurs
  }
}

export async function PUT(request) {
  const { shortUrl } = await request.json();
  try {
    const result = await Url.findOne({ shortUrl }, { clickCount: 1, _id: 0 });

    if (result) {
      console.log(`Click count for ${shortUrl}: ${result.clickCount}`);
      return NextResponse.json(result);
    } else {
      console.log(`URL with shortUrl ${shortUrl} not found.`);
      return NextResponse.json({result: 0});
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}