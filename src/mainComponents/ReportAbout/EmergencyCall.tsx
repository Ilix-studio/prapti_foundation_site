import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function EmergencyCall() {
  return (
    <section className='w-full py-8 bg-white-50 border-y border-white-100'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <div className='p-2 rounded-full bg-red-100 flex-shrink-0'>
              <AlertTriangle className='h-6 w-6 text-red-500' />
            </div>
            <div>
              <h2 className='text-lg font-semibold'>See a dog in distress?</h2>
              <p className='text-sm text-gray-600 mt-1'>
                Report injured or abused dogs to help us rescue them.
              </p>
            </div>
          </div>
          <Link to='/report' className='w-full md:w-auto'>
            <Button className='bg-red-500 hover:bg-red-600 w-full md:w-auto'>
              Report Now
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
