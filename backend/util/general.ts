export function getMissingOrInvalidParameters(params: PossiblyEmptyParam[], invalidParameters?: string[]) {
	const missingParameters: string[] = [];

	for (const param of params) {
		if (!param.val) 
			missingParameters.push(param.paramName);
	}
	if (invalidParameters && invalidParameters.length === 0)
		return {missingParameters: missingParameters};
	else
		return {missingParameters: missingParameters, invalidParameters: invalidParameters};
}

interface PossiblyEmptyParam {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	val: any,
	paramName: string
}

export function randomIntFromInterval(min: number, max: number): number { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min);
}
