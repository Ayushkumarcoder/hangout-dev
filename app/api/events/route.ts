import { Event } from "@/app/database";
import connectDB from "@/lib/mongodb";
import { rejects } from "assert";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest){
    try {

        //connecting to the db
        await connectDB();

        const formData = await req.formData();
        //we are using formData to get the data from the request body because we are sending the data as formData from the client side
        //what is formData? FormData is a built-in web API that allows you to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the fetch API or XMLHttpRequest.
        
        let event;
        try {

            event = Object.fromEntries(formData.entries());
            
            // Normalize mode to lowercase to match schema enum validation
            if (event.mode && typeof event.mode === 'string') {
                event.mode = event.mode.toLowerCase();
            }
            
        } catch (error) {
            return NextResponse.json({ message: "Invalid event data" , error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
        }

        //need to upload image to cloudinary and get the url
        const file = formData.get('image') as File;
        if (!file) {
            return NextResponse.json({ message: "Image file is required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer because fetch accepts it
        const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer for Node.js

        const uploadResult = await new Promise((resolve, rejects)=>{
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'hangout-dev/events' }, (error, result) => {
                if (error) {
                    rejects(error);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        })

        event.image = (uploadResult as {secure_url: string}).secure_url;
        //setting the image url to the event object

        const createdEvent = await Event.create(event);
        //saving the event to the database

        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });

    } catch (error) {
        console.error("Error in POST /api/events:", error);
        
        // Handle MongoDB duplicate key error
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json({ 
                message: "Event with this title already exists", 
                error: "Duplicate event" 
            }, { status: 409 });
        }
        
        return NextResponse.json({ 
            message: "Event creation failed", 
            error: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest){
    try {

        //connecting to the db
        await connectDB();

        const event = await Event.find().sort({ createdAt: -1 }); // Fetch events sorted by creation date (newest first)

        return NextResponse.json({ message: "Events fetched successfully", events: event }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ message: "Error fetching events", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
        
    }
}