function CheckAccess(role)
{
    return (req,res,next)=>
    {
        const Role=req.user.role
        if(role.includes(Role))  //checks either true or false
        {
            next();
        }
        else
        {
            res.status(400).json({message:"Forbidden"})
        }
    }
}
module.exports=CheckAccess