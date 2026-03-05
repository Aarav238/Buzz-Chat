const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const http = require("http");
const { use } = require("../routes/userRoutes");

function getLocationFromIp(ip) {
  return new Promise((resolve) => {
    // Skip lookup for local/private IPs
    if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      return resolve({ ip: ip || "" });
    }
    http.get(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.status === "success") {
            resolve({ ip, city: parsed.city, region: parsed.regionName, country: parsed.country });
          } else {
            resolve({ ip });
          }
        } catch {
          resolve({ ip });
        }
      });
    }).on("error", () => resolve({ ip }));
  });
}

//Register

module.exports.register= async (req,res,next) => {
   try{
    const {username , email , password } = req.body;
    const usernameCheck = await User.findOne({username});
    if(usernameCheck)
    return res.status(409).json({msg:"Username already used", status:false});
    const emailCheck = await User.findOne({email});
    if(emailCheck)
    return res.status(409).json({msg:"Email already used", status:false});
    const hashedPassword = await bcrypt.hash(password,10);

    const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
    const location = await getLocationFromIp(clientIp);

    const user = await User.create({
        email,
        username,
        password: hashedPassword,
        location,
    });
    delete user.password;
    return res.json({status:true,user})

   }catch(ex){
    next(ex);
   }
   };

//    LOGIN

   module.exports.login= async (req,res,next) => {
    try{
     const {identifier , password } = req.body;
     const user = await User.findOne({
       $or: [{ username: identifier }, { email: identifier }]
     });
     if(!user)
     return res.status(400).json({msg:"Incorrect username, email or password", status:false});
     const isPasswordValid = await bcrypt.compare(password,user.password);
     if(!isPasswordValid)
     return res.status(400).json({msg:"Incorrect Username or Password", status:false});
     delete user.password;
     return res.json({status:true,user})
     
    }catch(ex){
     next(ex);
    }
    };

    

    module.exports.setAvatar = async (req,res,next) => { 
      try{
         const userId =   req.params.id;
         const avatarImage = req.body.image;
         const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet : true,
            avatarImage,
         }, { new: true });
         return res.json({
            isSet:userData.isAvatarImageSet,
            image : userData.avatarImage,
         })

      }catch(ex){
         next(ex)
      }
    };




    module.exports.getAllUsers = async (req,res,next) => {
      try{
         const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
         ]); 
         return res.json(users);
      }

      catch(ex){
         next(ex);

      }



    };
