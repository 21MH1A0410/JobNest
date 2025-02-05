import { useEffect, useState,useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import {Building2, CircleX, Filter, FilterX, MapPin, X } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  const { isLoaded } = useUser();

  const {
    // loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);
  
  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    
  }, [isLoaded, location, company_id, searchQuery]);
  
  const filteredJobs = useMemo(() => {
    return searchQuery
      ? jobs?.filter((job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : jobs;
  }, [jobs, searchQuery]);

  const totalJobs = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const currentJobs = useMemo(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    return filteredJobs?.slice(indexOfFirstJob, indexOfLastJob);
  }, [filteredJobs, currentPage, jobsPerPage]);
  

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query").trim().toLowerCase();
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setCurrentPage(1);
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      <form
        onSubmit={handleSearch}
        className="relative h-14 flex flex-row w-full gap-2 items-center mb-3 "
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1  px-4 text-md pr-10"
          value = {searchQuery}
          onChange = {(e)=>setSearchQuery(e.target.value)}
        />
        {searchQuery &&
          <span
            onClick={()=>setSearchQuery("")}
            variant='red'
            className="absolute right-4 sm:right-5 rounded-full text-white hover:text-red-500 hover:bg-gray-900 transition" 
          >
            <X className="relative h-7 w-8 p-2 cursor-pointer hover:h-8 transition-transform duration-300 ease-in-out hover:rotate-180 rounded hover:scale-105" />
          </span>

        }
        
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger >
            <div class="flex gap-5">
                <MapPin className="text-gray-400 ml-4"/>
                <SelectValue placeholder="Filter by Location" />
            </div>
            
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="flex" >
            <div class="flex gap-5">
              <Building2  className="text-gray-400 ml-4" />
              <SelectValue placeholder="Filter by Company"/>
            </div>
            
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="sm:w-1/2 gap-2"
          variant="destructive"
          onClick={clearFilters}
        >
          <FilterX /> Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentJobs?.length ? (
              currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              ))
            ) : (
              <div>No Jobs Found 😢</div>
            )}
          </div>
          {/*pagination*/}
          <Pagination className="mt-3">
              { currentPage!==1 ?(
                <PaginationPrevious
                onClick={() => {if(currentPage!=1) paginate(currentPage - 1)
                }}
                isActive={currentPage>1}
                />):(<span></span>)
              }
              <PaginationContent>
                {/* Always show the first page */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => paginate(1)}
                    isActive={1 === currentPage}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {/* Show dots if currentPage is far from the start */}
                {currentPage > 3 && <PaginationItem><span>...</span></PaginationItem>}

                  {Array.from({ length: Math.min(totalPages-1,3) }, (_, index) => {
                    const page = currentPage - 1 +index;
                    if(page>1 && page<totalPages){
                      return (
                        <PaginationItem key={page} >
                          <PaginationLink onClick={() => paginate(page)} isActive={page=== currentPage}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  {currentPage < totalPages - 2 && <PaginationItem><span>...</span></PaginationItem>}
                  {/* Always show the last page */}
                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                         onClick={() => paginate(totalPages)}
                          isActive={totalPages === currentPage}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
              </PaginationContent>
              {currentPage!==totalPages?(
                <PaginationNext
                onClick={() => {
                  if(currentPage !== Math.ceil(filteredJobs?.length / jobsPerPage))paginate(currentPage + 1)
                }}
                isActive={currentPage<totalPages}
              />
              ):(<span></span>)}
                
          </Pagination>
        </>
      )}
    </div>
  );
};

export default JobListing;
