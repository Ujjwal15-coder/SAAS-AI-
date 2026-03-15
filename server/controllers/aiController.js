// import OpenAI from "openai";
// import sql from "../configs/db.js";
// import { clerkClient} from "@clerk/express";
// import axios from "axios";
// import { v2 as cloudinary } from 'cloudinary';
// import FormData from "form-data";
// import { upload } from '../configs/multer.js';
// import fs from "fs";
// import pdfParse from "pdf-parse";

// const AI = new OpenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });



// export const generateArticle = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const {prompt,length} = req.body;
//         const plan = req.plan;
//         const free_usage = req.free_usage;
        
//         if(plan !== 'premium' && free_usage >=10){
//             return res.json({success: false, message: "Free usage limit reached. Please upgrade to Premium plan."});
//         }

// const response = await AI.chat.completions.create({
//     model: "gemini-3-flash-preview",
//     messages: [
//         {
//             role: "user",
//             content: prompt,
//         },
//     ],
//     temperature: 0.7,
//     max_tokens: length,
// });

// const content = response.choices[0].message.content

// await sql` INSERT INTO creations (user_id, prompt, content, type)
// VALUES (${userId}, ${prompt}, ${content}, 'article')`;

// if(plan !== 'premium'){
//     await clerkClient.users.updateUserMetadata(userId,{
//         privateMetadata: {
//             free_usage: free_usage + 1
//         }
//     })
// }

//         res.json({success: true, content});

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: "Failed to generate article. "+ error.message});
//     }
// }


// export const generateBlogTitle = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const {prompt} = req.body;
//         const plan = req.plan;
//         const free_usage = req.free_usage;
        
//         if(plan !== 'premium' && free_usage >=10){
//             return res.json({success: false, message: "Free usage limit reached. Please upgrade to Premium plan."});
//         }

// const response = await AI.chat.completions.create({
//     model: "gemini-3-flash-preview",
//     messages: [
//         {
//             role: "user",
//             content: prompt,
//         },
//     ],
//     temperature: 0.7,
//     max_tokens: 100,
// });

// const content = response.choices[0].message.content

// await sql`INSERT INTO creations (user_id, prompt, content, type)
// VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

// if(plan !== 'premium'){
//     await clerkClient.users.updateUserMetadata(userId,{
//         privateMetadata: {
//             free_usage: free_usage + 1
//         }
//     })
// }

//         res.json({success: true, content});

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: "Failed to generate article. "+ error.message});
//     }
// }


// export const generateImage = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const {prompt,publish} = req.body;
//         const plan = req.plan;
//          const free_usage = req.free_usage;


        
//         if(plan !== 'premium'  && free_usage >= 10){
//             return res.json({success: false, message: "Free usage limit reached. Please upgrade to Premium plan."});
//         }
//         const formData = new FormData()
//         formData.append('prompt', prompt);

//         const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
//             headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
//             responseType: 'arraybuffer',
//         })

//         const base64Image = `data:image/png;base64,${Buffer.from(data,'binary').toString('base64')}`;
//         const {secure_url} = await cloudinary.uploader.upload(base64Image)



// await sql`INSERT INTO creations (user_id, prompt, content, type, publish)
// VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;


//         res.json({success: true, content: secure_url});

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: "Failed to generate image. "+ error.message});
//     }
// }


// export const removeImageBackground = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const {image} = req.file;

//         const plan = req.plan;
//          const free_usage = req.free_usage;


        
//         if(plan !== 'premium' ){
//             return res.json({success: false, message: "Free usage limit reached. Please upgrade to Premium plan."});
//         }
       
        
//         const {secure_url} = await cloudinary.uploader.upload(image.path,{
//             transformation: [
//                 {
//                     effect: "background_removal",
//                     background_removal: 'remove_the_background'
//                 }
//             ]
//         })



// await sql`INSERT INTO creations (user_id, prompt, content, type)
// VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;


//         res.json({success: true, content: secure_url});

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: "Failed to remove background. "+ error.message});
//     }
// }


// export const removeImageObject=async(req,res)=>{


//     try{
//         const {userId}=req.auth();

//         const {object}=req.body;


//         const {image}=req.file;

//         const plan=req.plan;

       

//         if(plan!='premium'){
//             return res.json({
//                 success:false,message:"This feature is only available for premium subscriptions"
//             })
//         }
    


// const{public_id}=await cloudinary.uploader.upload(image.path)

// const imageUrl=cloudinary.url(public_id,{
//     transformation:[{effect:`gen_remove:${object}`}],
//     resource_type:'image'
// })

      
//       await sql `INSERT INTO creations (user_id, prompt,content,type) VALUES(${userId},${`Removed ${object} from image`},${imageUrl},'image')`;

    
//       res.json({
//         success:true,content:imageUrl
//       })


//     } catch(error){

//         console.log(error.message)
//         res.json({success:false,message:error.message})

//     }


// } 


// export const resumeReview = async (req, res) => {
//   try {
//     const { userId } = req.auth();

//     const plan = req.plan;
//     const free_usage = req.free_usage;
//     const resume = req.file;

//     if (!resume) {
//       return res.json({ success: false, message: "No resume file uploaded" });
//     }

//     if (resume.size > 5 * 1024 * 1024) {
//       return res.json({
//         success: false,
//         message: "Resume file exceeds allowed size (max 5MB)",
//       });
//     }

//     // 🔹 Free usage check (same as articles/images)
//     if (plan !== "premium" && free_usage >= 10) {
//       return res.json({
//         success: false,
//         message: "Limit Reached",
//       });
//     }
    
//     // ✅ Extract text from PDF
//     const buffer = fs.readFileSync(resume.path);
//     const pdfData = await pdf(buffer);

//     const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement:\n\n${pdfData.text}`;

//     // ✅ Send to AI
//     const response = await AI.chat.completions.create({
//       model: "gemini-3-flash-preview",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//       max_tokens: 1000,
//     });

//     const content = response.choices[0].message?.content || "No response generated";

//     // ✅ Store in DB
//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type)
//       VALUES (${userId}, 'Resume Review', ${content}, 'resume-review')
//     `;

//     // 🔹 Update free usage for non-premium users
//     if (plan !== "premium") {
//       await clerkClient.users.updateUserMetadata(userId, {
//         privateMetadata: {
//           free_usage: free_usage + 1,
//         },
//       });
//     }

//     return res.json({ success: true, content });
//   } catch (error) {
//     console.error("Resume Review Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// };
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import fs from "fs";



const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});


// ==========================
// GENERATE ARTICLE
// ==========================
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ FIXED

    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage ?? 0;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({ success: false, message: "Limit Reached" });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length || 500,
    });

    const content =
      response?.choices?.[0]?.message?.content || "No response generated";

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// ==========================
// GENERATE BLOG TITLE
// ==========================
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();

    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage ?? 0;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({ success: false, message: "Limit Reached" });
    }

     const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
    
      temperature: 0.7,
      max_tokens: 100,
    });

    const content =
      response?.choices?.[0]?.message?.content || "No response generated";
      console.log(response.choices[0].message.content)

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// ==========================
// GENERATE IMAGE
// ==========================
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();

    const { prompt, publish } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage ?? 0;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Premium feature or limit reached",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(), // ✅ important
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ?? false
    })
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// ==========================
// REMOVE BACKGROUND
// ==========================
// export const removeImageBackground = async (req, res) => {
//   try {
//     const { userId } = req.auth;
//     const image = req.file;

//     if (!image) {
//       return res.json({ success: false, message: "No image uploaded" });
//     }

//     if (req.plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "Premium only feature",
//       });
//     }

//     const { secure_url } = await cloudinary.uploader.upload(image.path, {
//       background_removal: "cloudinary_ai",
//     });

//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type)
//       VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
//     `;

//     res.json({ success: true, content: secure_url });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;

    if (!image) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const secure_url = cloudinary.url(public_id, {
      transformation: [{ effect: "background_removal" }]
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { object } = req.body;
    const image = req.file;

    if (!image) {
      return res.json({
        success: false,
        message: "No image uploaded",
      });
    }

    if (!object) {
      return res.json({
        success: false,
        message: "No object specified",
      });
    }

    // if (req.plan !== "premium" ) {
    //   return res.json({
    //     success: false,
    //     message: "This feature is only available for premium users",
    //   });
    // }

    // 🔹 Upload image first
    const { public_id } = await cloudinary.uploader.upload(image.path);

    // 🔹 Apply object removal transformation
    const imageUrl = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    // 🔹 Save in database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    return res.json({
      success: true,
      content: imageUrl,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// RESUME REVIEW (Node v22 SAFE)
// ==========================
export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
      

    if (!resume) {
      return res.json({ success: false, message: "No resume uploaded" });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume exceeds 5MB",
      });
    }

    const buffer = fs.readFileSync(resume.path)

    // ✅ Dynamic import fixes ESM issue
    // const pdfModule = await import("pdf-parse");
    // const pdfData = await pdfModule.default(buffer);
    const pdfData = await pdf(buffer);

    const prompt = `Review this resume and provide detailed feedback:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
    `;

    res.json({ success: true, content});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};