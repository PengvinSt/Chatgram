class DevController {
    async devFun(req,res){
        try {
            
            res.status(200).json({message:"DevApi is available", info:req.body})
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new DevController()