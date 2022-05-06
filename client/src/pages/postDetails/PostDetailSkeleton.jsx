import React from 'react';
import Skelecton from "../../components/UI/skeleton/Skeleton";



const SkeletonMeta = () => {
    return (
        <Skelecton>
            <div className="flex items-start">
                <Skelecton.Circle height="60px" width='60px' />
                <div className="flex-1 ml-4">
                    <div className="flex  items-center">
                        <div className="flex flex-1">
                            <Skelecton.Line height={15} width="50%" className="my-1" />
                            <Skelecton.Line height={15} width="80px" radius="20px" className="my-1 ml-4" />
                        </div>

                    </div>

                    <div className="flex flex-1 flex-col">
                        <Skelecton.Line width='100%' height={6} className="my-0.5"  />
                        <Skelecton.Line width='70%' height={6} className="my-0.5"  />
                        <Skelecton.Line width='100%' height={6} className="my-0.5"  />
                        <Skelecton.Line width="40%" height={6} className="my-0.5"  />
                    </div>

                </div>
            </div>

            <Skelecton.Line width='80%' height={30} className="my-0.5 mt-6" radius={100}  />
            <Skelecton.Line width='100px' height={8} className="my-0.5 mt-2"  />
            <Skelecton.Circle height="300px" width='100%' radius="0" className="mt-8" />
        </Skelecton>
    )
}

const SkeletonContent = () => {
    return (
        <div>
            <Skelecton delay="0.2s">
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-4"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='90%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='80%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='50%' height={10} className="my-0.5 mt-1"  />
            </Skelecton>
            <Skelecton delay="0.3s">
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-5"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='50%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='40%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='10%' height={10} className="my-0.5 mt-1"  />
            </Skelecton>
            <Skelecton delay="0.2s">
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-4"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='90%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='80%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='50%' height={10} className="my-0.5 mt-1"  />
            </Skelecton>
            <Skelecton delay="0.6s">
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-5"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='50%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='40%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='10%' height={10} className="my-0.5 mt-1"  />
            </Skelecton>
            <Skelecton delay="2s">
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-5"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='50%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='100%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='40%' height={10} className="my-0.5 mt-1"  />
                <Skelecton.Line width='10%' height={10} className="my-0.5 mt-1"  />
            </Skelecton>

            {/* Post Footer */}

            <Skelecton delay="0.9s">
                <div className="flex mt-6">
                    <Skelecton.Line width='30px' height={10} className="my-0.5"  />
                    <Skelecton.Line width='10px' height={10} className="my-0.5 ml-1 "  />
                    <Skelecton.Line width='60px' height={10} className="my-0.5 ml-2"  />

                    <Skelecton.Line width='30px' height={10} className="my-0.5 ml-4"  />
                    <Skelecton.Line width='10px' height={10} className="my-0.5 ml-1 "  />
                    <Skelecton.Line width='70px' height={10} className="my-0.5 ml-2"  />
                </div>
                <div className="flex items-start mt-4">
                    <Skelecton.Line width='50px' height={25} className=""  />
                    <div className="flex flex-1 flex-wrap ml-4">
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                        <Skelecton.Line width='30px' height={15} radius="100px" className="mt-0 m-1"  />
                    </div>
                </div>
            </Skelecton>
        </div>
    )
}


const PostDetailSkeleton = (props) => {
    return (
        <div className="container-1200">
            <div className="">
                {props.children}
            </div>
        </div>

    );
};

PostDetailSkeleton.SkeletonContent = SkeletonContent
PostDetailSkeleton.SkeletonMeta = SkeletonMeta

export default PostDetailSkeleton;