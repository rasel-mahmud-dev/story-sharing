import React from 'react';
import Skelecton from "../../components/UI/skeleton/Skeleton";
import PostSkeleton from "../postFilterPage/PostSkeleton";


const ProfileSkeleton = () => {
    return (
        <div className="mt-2">
            <Skelecton delay="0.5s">
                <div className="relative">
                    <Skelecton.Circle height="400px" width='100%' radius="0" className="" bg="#cdcdcd" />
                    
                    <div className="container-1200 mx-4">
                        <div className="absolute  w-1/2 top-10 z-10 left-1/2 transform -translate-x-1/2">
                            <div className="flex flex-col items-center">
                                <Skelecton.Circle height="90px" width='90px' className="mt-8" />
                                <Skelecton.Line width='50%' height={20} className="my-0.5 mt-4"  />
                                <Skelecton.Line width='100%' height={5} className="my-0.5 mt-4"  />
                                <Skelecton.Line width='100%' height={5} className="mt-1"  />
                                <Skelecton.Line width='100%' height={5} className="mt-1"  />
                                <Skelecton.Line width='90%' height={5} className="mt-1"  />
            
                                <div className="flex">
                                    <Skelecton.Circle height="20px" width='20px' className="mt-8 mx-1" />
                                    <Skelecton.Circle height="20px" width='20px' className="mt-8 mx-1" />
                                    <Skelecton.Circle height="20px" width='20px' className="mt-8 mx-1" />
                                    <Skelecton.Circle height="20px" width='20px' className="mt-8 mx-1" />
                                    <Skelecton.Circle height="20px" width='20px' className="mt-8 mx-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </Skelecton>

            <div className="container-1200 mx-4">
                <Skelecton delay="0.4s">
        
                    <div className="flex justify-center">
                        <Skelecton.Line width='50%' height={30} className="my-0.5 mt-4"  />
                    </div>
        
                    <Skelecton.Line width='150px' height={30} radius="100px" className="my-0.5 mt-4 mb-4"  />
    
                </Skelecton>
    
                { new Array(5).fill(1).map((a, i)=>(
                  <li className="my-4" key={i}><PostSkeleton /></li>
                )) }
            </div>
        </div>

    );
};



export default ProfileSkeleton;