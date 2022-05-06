import React from 'react';
import Skelecton from "../../components/UI/skeleton/Skeleton";

const PostSkeleton = () => {
    return (
        <Skelecton className="">
            <div className="flex items-start">
                <Skelecton.Circle height="70px" width='150px' radius={4} />
                <div className="flex-1 ml-1">
                    <div className="flex items-center">
                        <Skelecton.Circle height="24px" width='24px' radius={"999px"} />
                        <Skelecton.Line height={20} className="my-1 ml-1" />
                    </div>
                    <Skelecton.Line width='100%' height={10} className="my-1"  />
                    <Skelecton.Line width='90%' height={10} className="my-1"  />
                    <Skelecton.Line width="40%" height={10} className="my-1"  />
                </div>

            </div>
        </Skelecton>
    );
};

export default PostSkeleton;