const express=require('express')
const router=express.Router()
const User=require("../Models/models")
const Post=require("../Models/postschema")
const authMiddleware=require("../OAUTH/auth")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

router.post("/register",async(req,res)=>{
  try 
  {
      const {name,email,password,confirmpassword}=req.body
      if (password !== confirmpassword) 
      {
         return res.status(400).json({ message: "Passwords do not match" });
      }
      const existingUser=await User.findOne({email})
      if(existingUser)
      {
        return res.status(409).json({message:"User Already Exist"})
      }
      const hashpassword=await bcrypt.hash(password,10)
      const user=new User({name,email,password:hashpassword,authProvider:"local"})
      await user.save()

      const token=jwt.sign({id:user._id,email:user.email},process.env.Private_key,{expiresIn:"1hr"})
      
      return res.status(201).json({message:"User Registered Succesfully",token:token,users:{
            id:user._id,
            name:user.name,
            email:user.email,
       }})
      
    

   } 
   catch (error) 
   {
       console.log(error)
       return res.status(500).json({message:"Invalid Registration"})
   }
}
)
router.post("/login",authMiddleware,async(req,res)=>{

      try 
      {
       const {email}=req.user //modification
       const {password}=req.body
       const user=await User.findOne({email})
       if(!user)
       return res.status(401).json({message:"Invalid Details"})
      
       if (user.authProvider === "google")
       return res.status(400).json({message: "Please login using Google"})

       const validpassword=await bcrypt.compare(password,user.password)
       
       if(!validpassword)
        return res.status(401).json({message:"Invalid Password"})

       return res.status(201).json({message:"Login Succesfull",users:{
            id:user._id,
            name:user.name,
            email:user.email,
       }})
      } catch (err) 
      {
          console.log(err)
          return res.status(500).json({message:"Invalid Login"})
      }
})

router.post("/google-auth", async (req, res) => {
    try 
    {
      const {name,email,googleId,picture}=req.body;
      let user = await User.findOne({ email });
     if (!user)
     {
      user = new User({name,email,googleId,authProvider: "google",picture});
      await user.save();
    }
    
    const token=jwt.sign({id:user._id,email:user.email},process.env.Private_key,{expiresIn:"1hr"})
    res.status(200).json({message: "Google Registration successful",token:token,users:{
         id:user._id,
         name:user.name,
         email:user.email,
         picture:user.picture
    }});
    } catch (err) 
    {
      console.log(err)
      return res.status(500).json({message:"Google Registration Failed"})
    }
});


router.post("/google-login",authMiddleware,async(req,res)=>{
    try 
    {
      const {email}=req.user
      if(req.user.email!=req.body.email)
      {
           return res.status(401).json({message:"Invalid Sign in"})
      }
    const user=await User.findOne({email})
    if(!user)
    {
      return res.status(409).json({message:"Invalid Logged In"})
    }
    return res.status(201).json({message:"Google Login Successfull",users:{
         id:user.id,
         name:user.name,
         email:user.email,
         picture:user.picture
    }})
   } catch (err) 
   {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
   }
})

// router.post("/posts",authMiddleware,async(req,res)=>{
//   try
//   {
//       const{title,content,tags}=req.body
//       console.log(title,content,tags)
//       const post=new Post({title,content,tags,author:req.user.id})
//       await post.save()
//       if(!post)
//       {
//         return res.status(409).json({message:"Invalid Post"})
//       }
//       return res.status(201).json({message:"Post Created Successfully",post})
//   } catch (err) 
//   {
//       return res.status(500).json({message:"Failed To Create Post"})
//   }
// })
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user.id  // Link post to user
    });
    console.log(req.user.id)
    await post.save();

    await User.findByIdAndUpdate(req.user.id, {$inc: { "stats.totalCreated": 1 }},{new:true});

    return res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});











router.get("/posts/me", authMiddleware, async (req, res) => {
  const posts = await Post.find({ author: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(posts);
});

router.get("/posts/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.stats) {
      return res.json({
        totalCreated: 0,
        totalUpdated: 0,
        totalDeleted: 0,
      });
    }

    res.json({
      totalCreated: user.stats.totalCreated,
      totalUpdated: user.stats.totalUpdated,
      totalDeleted: user.stats.totalDeleted,
  })
} 
  catch (err) {
    console.error("STATS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.put("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id}, // ownership check
      { title, content, tags },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { "stats.totalUpdated": 1 },
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.delete("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id, // ownership check
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 
        "stats.totalDeleted": 1,
        "stats.totalCreated": -1  // Reduce created count when deleted
      },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

router.get("/posts/me", authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    
    console.log("Search param:", search); // Debug log

    let query = {};

    if (search && search.trim() !== "") {
      query = {
        title: { $regex: search.trim(), $options: "i" }
      };
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    console.log(posts)
    return res.status(200).json(posts);
  } catch (err) {
    console.error("FETCH MY POSTS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

module.exports=router