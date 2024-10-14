import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const getAllJobs = async (req, res, next) => {
    const jobs = await Job.find();
    res.status(200).json({
        success: true,
        jobs,
    });
};

export const postJob = async (req, res, next) => {
    const {role} = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }
    const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;
    console.log(req.body);
    if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("Please provide full job details", 400));
    }
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(new ErrorHandler("Please provide either fixed salary or ranged salary!", 400));
    }

    if (salaryFrom && salaryTo && fixedSalary) {
        return next(new ErrorHandler("Cannot enter fixed salary and ranged salary together!", 400));
    }

    const postedBy = req.user._id;
    console.log(postedBy);
    try {
        const job = await Job.create({
            title,
            description,
            category,
            country,
            city,
            location,
            fixedSalary,
            salaryFrom,
            salaryTo,
            postedBy
        });
        res.status(200).json({
            success: true,
            message: "Job posted successfully!"
            
        });
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler("Failed to post the job", 500));
    }
};

export const getmyJobs=async(req,res,next)=>{
    const {role}=req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }
    const myJobs=await Job.find({postedBy:req.user._id});
    res.status(200).json({
        success:true,
        myJobs,
    })
}

export const updateJob=async(req,res,next)=>{
    const{role}=req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }
    const {id}=req.params;
    let job=await Job.findById(id);
    
    if(!job){
    return next(new ErrorHandler("Oops, Job not found ", 404));
    }
    job=await Job.findByIdAndUpdate(id, req.body, {
        new:true,
        runValidators:true,
        useFindAndModify:false

    })
    res.status(200).json({
        success:true,
        job,
        message:"Job updated Successfully"
    })


}
export const deleteJob=async(req,res,next)=>{
    const{role}=req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }
    const{id}=req.params;
    let job=await Job.findById(id);
    
    if(!job){
    return next(new ErrorHandler("Oops, Job not found ", 404));
    }
await job.deleteOne();
res.status(200).json({
    success:true,
    message:"Job Deleted Successfully!"
})


}

export const getSinglejob= async(req,res,next)=>{
    const{id}=req.params;
    try{
        const job= await Job.findById(id);
        if(!job){
            return next(new ErrorHandler("Job not found",404))
        }
        res.status(200).json({
            success:true,
            job
        })
    }
    catch(error){
        return next(new ErrorHandler("Invalid ID/ CastError"))
    }
}