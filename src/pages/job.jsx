import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import {  BriefcaseIcon, DoorClosedIcon,DoorOpenIcon, MapPinIcon, User } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
const JobPage = () => {
  const {isLoaded,user} = useUser();
  const {id} = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id:id,
  });

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, {
    job_id:id,
  }
  );

  const handleStatusChange = (value) =>{
    const isOpen = value ==="open";
    fnHiringStatus(isOpen).then(()=>fnJob());
  };

  useEffect(()=>{
    if(isLoaded) fnJob();
  },[isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return ( 
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">{job?.title}</h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon/>
          {job?.location}
        </div>
        <div className="flex gap-2">
          <BriefcaseIcon/> {job?.applications?.length} Applicants
        </div>
        {job?.recruiter_id!==user?.id ? 
        (
          <div className="flex gap-2">
            {job?.isOpen?(
              <>
                <DoorOpenIcon/>Open
              </>
            ):(
              <>
                <DoorClosedIcon/>Closed
              </>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Select onValueChange={handleStatusChange} > 
                <SelectTrigger 
                  className={`p-4 border-0 transition-all ${job?.isOpen ? "text-white bg-green-800 hover:bg-green-700" : "text-white bg-red-800 hover:bg-red-700"}`}
                >
                  
                  <SelectValue 
                    placeholder={loadingHiringStatus ?(
                    <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                    ):(
                      <div className="flex items-center gap-2 ">
                          {job?.isOpen?( 
                            <>
                              <DoorOpenIcon/> <span>Hiring Status: Open</span>
                            </>
                          ):(
                            <>
                              <DoorClosedIcon/><span>Hiring Status: Closed</span>
                            </>
                          )}
                      </div>
                    )}
                  />
                </SelectTrigger>
                <SelectContent>    
                  <SelectItem value={"open"}>Open</SelectItem>
                  <SelectItem value={"closed"}>Close</SelectItem>
                </SelectContent>
            </Select>
          </div>
        )}
      </div>
      

      {/*hiring status*/}
      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
      <MDEditor.Markdown source={job?.requirements.replace(/-(?!\s)/g, '- ')} className="bg-transparent sm:text-lg" />

      {/*render applications*/}
      {job?.recruiter_id!==user?.id && (
        <ApplyJobDrawer job={job} user={user} fetchJob={fnJob} 
          applied={job?.applications?.find((ap)=>ap.candidate_id===user.id)}
        />
      )}
      {job?.applications?.length>0 && job?.recruiter_id===user?.id &&(
        <>
          <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
          <div className="gap-2">
            
            {job?.applications.map((application)=>{
              return (
                <ApplicationCard 
                  key={application.id}
                  application={application}
                />
              );
            })}
          </div>
        </> 
      )}
    </div>
  );
};

export default JobPage
