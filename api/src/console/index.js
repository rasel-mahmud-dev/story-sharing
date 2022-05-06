export default  ()=> {
	
	if(process.env.NODE_ENV === "development") {
		
		
		['log', 'info'].forEach((methodName) => {
			const originalMethod = console[methodName];
			console[methodName] = (...args) => {
				let initiator = 'unknown place';
				try {
					throw new Error();
				} catch (e) {
					if (typeof e.stack === 'string') {
						let isFirst = true;
						for (const line of e.stack.split('\n')) {
							const matches = line.match(/^\s+at\s+(.*)/);
							if (matches) {
								if (!isFirst) { // first line - current function
									// second line - caller (what we are looking for)
									initiator = matches[1];
									break;
								}
								isFirst = false;
							}
						}
					}
				}
				
				originalMethod.apply(console, [...args, `\x1b[33m ${initiator.slice(60)} \x1b[0m`]);
			};
		});
	}
	
}




