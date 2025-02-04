import dummyBooks from "@/dummybooks.json";
import ImageKit from "imagekit";
import { books } from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({
    path:'.env.local'
});

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql);

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string
) => {
  try {
    const res = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return res.filePath;
  } catch (error) {
    console.log(error);
  }
};

const seed = async () => {
  console.log("Seeding data ...");

  try {
    for (const book of dummyBooks) {
      const cover_url = await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        "./books/covers"
      );

      const video_url = await uploadToImageKit(
        book.videoUrl,
        `${book.title}.mp4`,
        "./books/videos"
      );

      await db.insert(books).values({
        ...book,
        cover_url,
        video_url
      }) 

    }

    console.log("Data seeded successful")
  } catch (error) {
    console.log("Error seeding data", error);
  }
};

seed();