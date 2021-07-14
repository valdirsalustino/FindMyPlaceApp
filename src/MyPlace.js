import { Map } from './UI/Map';

class LoadedPlace {
	constructor(coordinates, address){
		new Map(coordinates);
		const headerTitleEl = document.querySelector('header h1');
		headerTitleEl.textContent = address;

	}
}

const url = new URL(location.href);
const queryParameter = url.searchParams;
const coords = {
	lat: +queryParameter.get('lat'),
	lng: +queryParameter.get('lng')
};

const address = queryParameter.get('address');
new LoadedPlace(coords, address);