
export default async function getEndTime(duration, callback) {
	const endTime = Date.now() + duration * 1000;
    callback(endTime)
}
