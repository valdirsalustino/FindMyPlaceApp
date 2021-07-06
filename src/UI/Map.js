export class Map {
  constructor(coods) {
		// this.coordinates = coords;
		this.render(coods); 
	}

  render(coordinates) {
		// skip in case gmaps unavailable;
		if (!google) {
			alert('Could not load maps library - please try again later!');
			return;
		}

		const map = new google.maps.Map(document.getElementById("map"), {
			center: coordinates,
			zoom: 16,
    });

		new google.maps.Marker({
			position: coordinates,
			map: map,
		});


	}
}