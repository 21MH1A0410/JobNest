import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplications";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react"; 
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  
const ApplicationCard = ({application,isCandidate=false}) => {
    const {user} = useUser();
    const handleDownload =()=>{
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = '_blank'
        link.click();
    }
    const {
        loading: loadingHiringStatus,
        fn: fnHiringStatus,
      } = useFetch(updateApplicationStatus, {
        job_id:application.job_id,
    });
    const handleStatusChange = (status) =>{
        fnHiringStatus(status);
    };
  return (
    <Card className="flex flex-col rounded p-1 shadow-lg hover:shadow-slate-900 transition-all duration-500 hover:scale-105"> 
        {loadingHiringStatus && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
        <CardHeader>
            <CardTitle className="flex justify-between font-bold">
                {isCandidate
                    ?`${application?.job?.title} at ${application?.job?.company?.name}`
                    : application?.name
                }
                <HoverCard>
                    <HoverCardTrigger>
                        <Download
                            size={18}
                            className="bg-transparent  text-white  rounded-full h-7 w-8 p-1.5 cursor-pointer"
                            onClick={handleDownload}
                        />
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm px-3 py-2 w-25 capitalize">
                        Download resume of<br/>{application?.name}
                    </HoverCardContent>
                </HoverCard>
                
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col  justify-self-auto">
                <div className="flex  gap-2 items-center">
                    <BriefcaseBusiness size={15}/> {application?.experience} years of experience
                </div>
                <div className="flex gap-2 items-center">
                    <School size={15}/> {application?.education} 
                </div>
                <div className="flex gap-2 items-center">
                    <Boxes size={15}/> Skills: {application?.skills}
                </div>
            </div>
            <hr/>
        </CardContent>
        <CardFooter className="flex justify-between">
            <span>{new Date(application?.created_at).toLocaleString()}</span>
            {isCandidate?(
                <span className="capitalize font-bold">Status: {application?.status}</span>
            ) : (
                <Select 
                    onValueChange={handleStatusChange} 
                    defaultValue={application.status} 
                >
                    <SelectTrigger class="w-52 flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        <SelectValue placeholder="Application Status"/>
                    </SelectTrigger>           
                    <SelectContent >    
                        <SelectItem value={"applied"}>Applied</SelectItem>
                        <SelectItem value={"interviewing"}>Interviewing</SelectItem>
                        <SelectItem value={"hired"}>Hired</SelectItem>
                        <SelectItem value={"rejected"}>Rejected</SelectItem>
                    </SelectContent>
              </Select> 
                )
            }
            {user?.unsafeMetadata?.role === "candidate" && (
                <Link to={`/job/${application.job_id}`} className="flex">
                <Button variant="secondary" className="w-full shadow-md hover:shadow-inherit hover:text-white hover:bg-blue-600">
                    More details 
                </Button>
            </Link>
            )}
            
        </CardFooter>
    </Card>
  )
}

export default ApplicationCard
