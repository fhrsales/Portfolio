// Crop the presentation canvas without changing the source image or stretching the page.
export function galleryCrop(item) {
	const [x, y, width, height] = item.crop;
	const rotated = item.rotation === 90;
	const scale = Math.min(item.width / (rotated ? height : width), item.height / (rotated ? width : height));
	return {
		frame: `width:${width * scale / item.width * 100}%;height:${height * scale / item.height * 100}%;transform:translate(-50%,-50%) rotate(${rotated ? 90 : 0}deg);`,
		image: `position:absolute;max-width:none;max-height:none;width:${item.sourceWidth / width * 100}%;height:${item.sourceHeight / height * 100}%;left:${-x / width * 100}%;top:${-y / height * 100}%;`
	};
}
