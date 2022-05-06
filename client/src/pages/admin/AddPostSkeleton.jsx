import React from 'react';
import Skelecton from "../../components/UI/skeleton/Skeleton";

const AddPostSkeleton = () => {
    return (
        <div className="container px-4 min-h-viewport">
            <Skelecton>
                <Skelecton.Line width='300px' height={30} className="mx-auto my-0.5 mt-4"  />
                <div className="my-6">
                    <Skelecton.Line width='200px' height={20} className="my-0.5 mt-4"  />
                    <Skelecton.Line width='100%' height={30} className="my-0.5 mt-2"  />
                </div>
                <div className="my-6">
                    <Skelecton.Line width='200px' height={20} className="my-0.5 mt-4"  />
                    <Skelecton.Line width='100%' height={30} className="my-0.5 mt-2"  />
                </div>
    
                <div className="my-6">
                    <Skelecton.Line width='200px' height={20} className="my-0.5 mt-4"  />
                    <Skelecton.Line width='100%' height={30} className="my-0.5 mt-2"  />
                </div>
                <div className="my-6">
                    <Skelecton.Line width='200px' height={20} className="my-0.5 mt-4"  />
                    <Skelecton.Line width='100%' height={80} className="my-0.5 mt-2"  />
                </div>
                <div className="my-6">
                    <Skelecton.Line width='200px' height={20} className="my-0.5 mt-4"  />
                    <Skelecton.Line width='100%' height={140} className="my-0.5 mt-2"  />
                </div>
                <Skelecton.Line width='150px' height={30} radius="100px" className="my-0.5 mt-4"  />
            </Skelecton>
            
        </div>
      
    );
};

export default AddPostSkeleton;