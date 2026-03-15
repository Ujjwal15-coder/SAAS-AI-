// //Middleware to check userID and has Premium plan

// import { clerkClient } from "@clerk/express";

// export const auth = async (req,res,next) => {
//     try{
//         const { userId,has} = await req.auth;
//         const hasPremiumPlan = await has({plan: 'premium'});

//         const user = await clerkClient.users.getUser(userId);

//         if(!hasPremiumPlan && user.privateMetadata.free_usage){
//             req.free_usage = user.privateMetadata.free_usage;
//         }
//           else{
//             await clerkClient.users.updateUserMetadata(userId,{
//                 privateMetadata: {
//                     free_usage: 0
//                 }
//             })
//             req.free_usage = 0;
//         }
//         req.plan = hasPremiumPlan ? 'premium' : 'free';
//         console.log(req.plan)
//         next()
//     } catch (error) {
//         res.json({success: false, message: "Authentication Failed. "+ error.message});
//     }
// }

    import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth; // Clerk middleware populates this

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    // Check plan from privateMetadata (you must store it during signup/upgrade)
    const hasPremiumPlan = user.privateMetadata.plan === "premium";

    if (!hasPremiumPlan) {
      // Fallback: use free usage counter
      const usage = user.privateMetadata.free_usage ?? 0;
      req.free_usage = usage;
    } else {
      // Premium users reset usage
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    console.log(req.plan);
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
        