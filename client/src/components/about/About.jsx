import React from 'react';

const About = () => {
	return (
		<div>
			<div className="container-1200 px-4 dark_subtitle">
				<h4 className="text-center text-2xl font-medium mt-4 dark_title">About My BLOG</h4>
				
				<h4 className="text-2xl mt-4">
					Publish, grow, spread knowledge all in one place.
				</h4>
				
				
				<div className="mt-4">
					<p>If you have a story to tell, knowledge to share.</p>
					<p>Sign up for free so your writing can thrive in a network supported by millions of readers — not ads.</p>
				</div>
				
				<button className="btn btn-outline my-4 dark:bg-dark-600 dark_subtitle">Start Writing</button>
				
				<h4 className="text-2xl font-medium text-md">Questions About My Blog </h4>
				<div className="mt-3">
					<div className="my-4">
						<h4 className="font-medium text-md">How do I start writing on this Website? </h4>
						<p>First, make a free account. Then, to create a story, click on your profile picture in the top-right corner of the page, then “Add Post Button Click.” </p>
					</div>
					
					<div className="my-4">
						<h4 className="font-medium text-md">Who writes on this Website? </h4>
						<p>
							Anyone can write. Whether you’ve never written before or are ready to create a full publication, it’s easy to get started and we allow you to focus more on big ideas and less on driving clicks. With the option to earn for your work, you can also be directly rewarded for the value you provide readers.
						</p>
					</div>
					
					<div className="my-4">
						<h4 className="font-medium text-md">What can I write about on this Website? </h4>
						<p>
							My Blog designed for short stories that make someone’s day better, manifestos that change the world, and everything in between. It’s used by everyone from professional journalists to data scientists to amateur cooks. Whatever the topic, Medium helps you find the right audience for what you have to say.
						</p>
					</div>
				
				</div>
			
			</div>
		
		
		</div>
	);
};

export default About;