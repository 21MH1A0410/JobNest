import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import companiesData from "../data/companies.json";
import Autoplay from "embla-carousel-autoplay"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import faqs from "../data/faq.json";
const companies = companiesData;
const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-5 sm:py-10 ">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-tittle text-4xl 
        font-extrabold sm:text-5xl lg:text-7xl tracking-tighter py-3">
          Find Your Dream Job{" "}
          <span className="flex items-center gap-2 sm:gap-6">
            and get{" "}
            <img
             src="/logo.png"
             alt='Hired Logo'
             className="h-12  sm:h-20 lg:h-29" 
            /> 
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Explore thousands of jobs and find the right one for you
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        <Link to="/jobs" > 
          <Button variant="blue" size="xl" >
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job" >
          <Button variant="destructive" size="xl">Post a Job</Button>
        </Link>
      </div>
      {/*Carousel*/}
      <Carousel 
       plugins ={[Autoplay({delay: 2000})]}
       className="w-full py-2">
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({name,path,id})=>(
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img 
                  src={path} 
                  alt={name} 
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            
          ))}
        </CarouselContent>
      </Carousel>

      {/*banner*/}
      <img src='/banner.jpeg' className="w-full"/>
      {/*Cards*/}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekeers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track your applications and get hired quickly
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications and find the right candidate
          </CardContent>
        </Card>

      </section>
      {/*Accordion*/}
      <Accordion type="multiple" collapsible className='w-full'>
        {faqs.map((faq,index)=>(
              <AccordionItem key={index} value={`item-${index+1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
